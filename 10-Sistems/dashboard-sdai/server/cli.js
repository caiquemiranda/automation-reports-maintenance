// Linha de comando do banco do SDAI.
//   npm run db:import -- --client bayer data/log.txt [outro.txt ...]   importa só o que é novo
//        opções: --site <id> (arquivo sem cabeçalho) · --novo-site (confirma painel novo do cliente)
//   npm run db:check -- --client bayer                                 integridade (buracos na sequência)
//   npm run db:stats                                                   clientes, sites e totais
import { readFileSync } from 'node:fs'
import { basename } from 'node:path'
import { parseArgs } from 'node:util'
import { openDb, getClient, listClients, listImports, integrity } from './db.js'
import { IngestError, ingestLog } from './ingest.js'

const { values: opt, positionals } = parseArgs({
  allowPositionals: true,
  options: { client: { type: 'string' }, site: { type: 'string' }, 'novo-site': { type: 'boolean' } },
})
const [cmd, ...files] = positionals
const db = openDb()
const day = (ts) => (ts ? new Date(ts).toISOString().slice(0, 16).replace('T', ' ') : '—')

function needClient() {
  const c = opt.client && getClient(db, opt.client)
  if (!c) {
    console.error(`Informe o cliente: --client ${listClients(db).map((x) => x.slug).join(' | ')}`)
    process.exit(1)
  }
  return c
}

function printIntegrity(client) {
  const r = integrity(db, client.id)
  console.table(
    r.sites.flatMap((s) =>
      s.volumes.map((v) => ({
        site: s.siteName,
        volume: v.vol ?? '(desconhecido)',
        eventos: v.events,
        seq: `${v.minSeq}–${v.maxSeq}`,
        faltando: v.missing,
        periodo: `${day(v.firstTs)} → ${day(v.lastTs)}`,
      })),
    ),
  )
  for (const s of r.sites) for (const v of s.volumes) for (const [a, b] of v.gaps.slice(0, 20)) console.log(`  buraco em ${s.siteName} / volume ${v.vol}: seq ${a}${a === b ? '' : `–${b}`}`)
  for (const s of r.sites) if (s.conflicts.length) console.log(`  conflitos em ${s.siteName} (mesmo seq, conteúdo diferente):`, s.conflicts)
  console.log(r.ok ? '✔ sequência completa, sem duplicados' : '✖ há registros faltando ou conflitos')
  return r.ok
}

if (cmd === 'import') {
  const client = needClient()
  if (!files.length) {
    console.error('Uso: npm run db:import -- --client <cliente> <arquivo.txt> [...]')
    process.exit(1)
  }
  const rows = []
  for (const file of files) {
    try {
      const r = ingestLog(db, readFileSync(file, 'utf8'), {
        client: client.slug,
        fileName: basename(file),
        siteId: opt.site ? Number(opt.site) : null,
        createSite: !!opt['novo-site'],
      })
      rows.push({ arquivo: basename(file), site: r.siteName, lidos: r.parsed, novos: r.inserted, existentes: r.duplicates, completados: r.completed, 'total no site': r.dbTotal, ms: r.ms })
      for (const w of r.warnings) console.warn(`⚠ ${basename(file)}: ${w}`)
    } catch (err) {
      if (!(err instanceof IngestError)) throw err
      console.error(`✖ ${basename(file)}: ${err.message}`)
      if (err.extra.sites) console.error('  sites do cliente:', err.extra.sites.map((s) => `${s.id} = ${s.name} (${s.source ?? 'sem painel'})`).join(', '))
      process.exitCode = 1
    }
  }
  if (rows.length) console.table(rows)
  printIntegrity(client)
} else if (cmd === 'check') {
  process.exit(printIntegrity(needClient()) ? 0 : 1)
} else if (cmd === 'stats') {
  console.table(
    listClients(db).map((c) => ({
      cliente: c.name,
      slug: c.slug,
      sites: c.sites.map((s) => `${s.id}: ${s.name}`).join(', ') || '—',
      eventos: c.events,
      periodo: c.events ? `${day(c.firstTs)} → ${day(c.lastTs)}` : '—',
      importacoes: c.events ? listImports(db, getClient(db, c.slug).id).length : 0,
    })),
  )
} else {
  console.log('Comandos: import --client <slug> <arquivos...> | check --client <slug> | stats   (banco: SDAI_DB ou db/sdai.sqlite)')
}
