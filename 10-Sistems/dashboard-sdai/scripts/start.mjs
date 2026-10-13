// Sobe o SDAI com um comando só.
//
//   npm run app               backend + dashboard em modo desenvolvimento (recarrega ao editar)
//   npm run app -- --prod     compila o dashboard e serve tudo pelo backend (um processo só)
//   npm run app -- --no-open  não abre o navegador
//   npm run app -- --check    sobe tudo, confere que responde e encerra (teste rápido)
//
// No Windows também dá para dar dois cliques em iniciar.cmd.
// Ctrl+C encerra tudo, inclusive os processos filhos (sem deixar servidor órfão
// segurando o banco).
import { spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { createInterface } from 'node:readline'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = new Set(process.argv.slice(2))
const PROD = args.has('--prod')
const CHECK = args.has('--check')
const OPEN = !args.has('--no-open') && !CHECK
const API_PORT = Number(process.env.PORT || 3001)
const API = `http://127.0.0.1:${API_PORT}`
const NODE_FLAGS = ['--disable-warning=ExperimentalWarning']

const tty = process.stdout.isTTY
const paint = (code, s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s)
const say = (msg) => console.log(`${paint('36;1', '[sdai]')} ${msg}`)
const fail = (msg) => {
  console.error(`${paint('31;1', '[sdai]')} ${msg}`)
  process.exit(1)
}

// ── Pré-requisitos ──────────────────────────────────────────────────────────

const [major, minor] = process.versions.node.split('.').map(Number)
if (major < 22 || (major === 22 && minor < 13)) {
  fail(`Node ${process.versions.node} é antigo: o banco usa o SQLite embutido do Node 22.13+. Atualize em https://nodejs.org`)
}

if (!existsSync(join(ROOT, 'node_modules', 'vite'))) {
  say('Instalando dependências (só na primeira vez)…')
  const r = spawnSync('npm', ['install'], { cwd: ROOT, stdio: 'inherit', shell: true })
  if (r.status !== 0) fail('npm install falhou.')
}

// ── Processos ───────────────────────────────────────────────────────────────

const children = []
let stopping = false

/** Encerra o processo e todos os filhos dele (no Windows, kill() sozinho deixa órfãos). */
function killTree(child) {
  if (child.exitCode !== null || child.signalCode !== null) return
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
  else child.kill('SIGTERM')
}

function stopAll(code = 0) {
  if (stopping) return
  stopping = true
  for (const c of children) killTree(c)
  process.exit(code)
}

/** Roda um processo com a saída prefixada ([api], [web]) no mesmo terminal. */
function run(tag, color, argv, { env = {}, onLine } = {}) {
  const child = spawn(process.execPath, argv, {
    cwd: ROOT,
    env: { ...process.env, FORCE_COLOR: tty ? '1' : '0', ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  children.push(child)
  const prefix = paint(color, `[${tag}]`)
  for (const stream of [child.stdout, child.stderr]) {
    createInterface({ input: stream }).on('line', (line) => {
      if (!line.trim()) return
      console.log(`${prefix} ${line}`)
      onLine?.(line)
    })
  }
  child.on('exit', (code) => {
    if (stopping) return
    console.error(`${paint('31;1', '[sdai]')} ${tag} encerrou (código ${code}). Parando o resto.`)
    stopAll(code || 1)
  })
  return child
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function health(base) {
  try {
    const res = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(1500) })
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}

async function waitFor(what, fn, timeoutMs = 60000) {
  const end = Date.now() + timeoutMs
  while (Date.now() < end) {
    const v = await fn()
    if (v) return v
    await sleep(300)
  }
  fail(`${what} não respondeu em ${timeoutMs / 1000}s.`)
}

function openBrowser(url) {
  const [cmd, argv] =
    process.platform === 'win32' ? ['cmd', ['/c', 'start', '""', url]] : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]]
  spawn(cmd, argv, { stdio: 'ignore', detached: true, windowsVerbatimArguments: true }).unref()
}

process.on('SIGINT', () => {
  console.log()
  say('Encerrando…')
  stopAll(0)
})
process.on('SIGTERM', () => stopAll(0))

// ── Backend ─────────────────────────────────────────────────────────────────

async function startBackend({ watch }) {
  const running = await health(API)
  if (running) {
    say(`Backend já está rodando em ${API} (${running.events} eventos) — vou usar esse.`)
    return
  }
  // porta ocupada por outro programa?
  try {
    await fetch(API, { signal: AbortSignal.timeout(800) })
    fail(`A porta ${API_PORT} está ocupada por outro programa. Feche-o ou rode com outra porta: PORT=3002 npm run app`)
  } catch {
    /* porta livre */
  }
  const argv = [...NODE_FLAGS, ...(watch ? ['--watch-path=server', '--watch-path=src/lib'] : []), 'server/index.js']
  run('api', '35', argv)
  const h = await waitFor('O backend', () => health(API))
  say(`Backend pronto: ${h.events} eventos no banco.`)
}

// ── Modos ───────────────────────────────────────────────────────────────────

async function dev() {
  await startBackend({ watch: true })
  let webUrl = null
  run('web', '32', [join('node_modules', 'vite', 'bin', 'vite.js')], {
    env: { SDAI_API: API },
    onLine: (line) => {
      const m = /Local:\s+(http:\/\/\S+?)\/?\s*$/.exec(line.replace(/\x1b\[[0-9;]*m/g, ''))
      if (m) webUrl = m[1]
    },
  })
  const url = await waitFor('O dashboard (Vite)', () => webUrl)
  await waitFor('O proxy /api do dashboard', () => health(url)) // dashboard → backend funcionando
  return url
}

async function prod() {
  say('Compilando o dashboard…')
  const b = spawnSync(process.execPath, [join('node_modules', 'vite', 'bin', 'vite.js'), 'build'], { cwd: ROOT, stdio: 'inherit' })
  if (b.status !== 0) fail('A compilação falhou.')
  await startBackend({ watch: false })
  return API
}

const url = await (PROD ? prod() : dev())
const page = `${url}/analytics`
console.log()
say(paint('1', `SDAI no ar: ${page}`))
say(PROD ? 'Modo produção (dashboard compilado servido pelo backend).' : 'Modo desenvolvimento: as telas recarregam ao salvar os arquivos.')

if (CHECK) {
  const res = await fetch(page)
  const ok = res.ok && (await res.text()).includes('id="root"')
  say(ok ? '✔ Verificação ok: dashboard e API respondendo. Encerrando.' : '✖ O dashboard não respondeu como esperado.')
  stopAll(ok ? 0 : 1)
} else {
  say('Ctrl+C para encerrar tudo.')
  if (OPEN) openBrowser(page)
}
