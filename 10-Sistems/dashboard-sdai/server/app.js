import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { gzipSync } from 'node:zlib'
import { clientDetail, getClient, integrity, listClients, listEvents, listEventsPage, listImports, stats } from './db.js'
import { IngestError, ingestLog } from './ingest.js'

const MAX_UPLOAD = 100 * 1024 * 1024
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json' }

const REPLY = Symbol('reply')
/** Resposta com status diferente de 200 (handlers comuns devolvem só o corpo). */
const reply = (status, body) => ({ [REPLY]: true, status, body })

class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message)
    Object.assign(this, { status, extra })
  }
}

const safeDecode = (s) => {
  try {
    return decodeURIComponent(s)
  } catch {
    return null
  }
}

function send(req, res, status, body) {
  let data = Buffer.from(JSON.stringify(body))
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  if (data.length > 1024 && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    data = gzipSync(data)
    headers['Content-Encoding'] = 'gzip'
  }
  res.writeHead(status, { ...headers, 'Content-Length': data.length })
  res.end(data)
}

function readBody(req) {
  return new Promise((ok, fail) => {
    const chunks = []
    let size = 0
    req.on('data', (c) => {
      size += c.length
      if (size > MAX_UPLOAD) {
        fail(new HttpError(413, 'Arquivo maior que 100 MB'))
        req.destroy()
      } else chunks.push(c)
    })
    req.on('end', () => ok(Buffer.concat(chunks).toString('utf8')))
    req.on('error', fail)
  })
}

const dayToTs = (day, end = false) => {
  if (!day) return undefined
  const ts = /^\d{4}-\d{2}-\d{2}$/.test(day) ? Date.parse(day + 'T00:00:00Z') : NaN
  if (Number.isNaN(ts)) throw new HttpError(400, `Data inválida: ${day} (use AAAA-MM-DD)`)
  return ts + (end ? 86400000 - 1 : 0)
}

const intParam = (v, def, min, max) => {
  const n = v === null || v === '' ? def : Number(v)
  if (!Number.isInteger(n) || n < min || n > max) throw new HttpError(400, `Parâmetro inválido: ${v}`)
  return n
}

/**
 * Servidor HTTP do SDAI (sem framework): API JSON + dashboard compilado.
 * @param {{db: import('node:sqlite').DatabaseSync, dist?: string, log?: (msg: string) => void}} opts
 */
export function createApp({ db, dist = resolve('dist'), log = console.log }) {
  const client = (slug) => getClient(db, slug) ?? (() => { throw new HttpError(404, `Cliente "${slug}" não existe`) })()

  const routes = [
    ['GET', '/api/health', () => ({ ok: true, ...stats(db) })],
    ['GET', '/api/clients', () => listClients(db)],
    ['GET', '/api/clients/:slug', ({ p }) => clientDetail(db, client(p.slug))],
    ['GET', '/api/clients/:slug/imports', ({ p }) => listImports(db, client(p.slug).id)],
    ['GET', '/api/clients/:slug/integrity', ({ p }) => integrity(db, client(p.slug).id)],
    [
      'GET',
      '/api/clients/:slug/events',
      ({ p, q }) => listEvents(db, client(p.slug).id, { from: dayToTs(q.get('from')), to: dayToTs(q.get('to'), true) }),
    ],
    [
      'GET',
      '/api/clients/:slug/events/page',
      ({ p, q }) =>
        listEventsPage(db, client(p.slug).id, {
          page: intParam(q.get('page'), 0, 0, 1e7),
          size: intParam(q.get('size'), 50, 1, 500),
          q: (q.get('q') || '').trim().slice(0, 100),
          siteId: q.get('site') ? intParam(q.get('site'), 0, 1, 1e9) : null,
          order: q.get('order') === 'asc' ? 'asc' : 'desc',
        }),
    ],
    [
      'POST',
      '/api/clients/:slug/imports',
      async ({ req, p }) => {
        const c = client(p.slug)
        const text = await readBody(req)
        if (!text.trim()) throw new HttpError(400, 'Arquivo vazio')
        const fileName = safeDecode(req.headers['x-file-name'] || 'log.txt') || 'log.txt'
        const siteId = req.headers['x-site-id'] ? intParam(req.headers['x-site-id'], 0, 1, 1e9) : null
        try {
          const report = ingestLog(db, text, { client: c.slug, fileName, siteId, createSite: req.headers['x-create-site'] === '1' })
          log(`[import] ${c.name} / ${report.siteName} · ${fileName}: ${report.inserted} novos, ${report.duplicates} já existentes, ${report.completed} completados (${report.ms} ms)`)
          return reply(201, report)
        } catch (err) {
          if (err instanceof IngestError) throw new HttpError(err.status, err.message, { code: err.code, ...err.extra })
          throw err
        }
      },
    ],
  ].map(([method, pattern, handler]) => ({ method, handler, re: new RegExp('^' + pattern.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$') }))

  function serveStatic(req, res, url) {
    if (!existsSync(dist)) return false
    const path = safeDecode(url.pathname)
    if (path === null) return false
    let file = normalize(join(dist, path))
    if (!file.startsWith(dist + sep)) return false // não sai de dist/
    if (!existsSync(file) || statSync(file).isDirectory()) file = join(dist, 'index.html') // SPA
    const immutable = file.startsWith(join(dist, 'assets') + sep)
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream', 'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache' })
    createReadStream(file).pipe(res)
    return true
  }

  return createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    try {
      for (const r of routes) {
        const m = r.method === req.method && r.re.exec(url.pathname)
        if (!m) continue
        const p = Object.fromEntries(Object.entries(m.groups ?? {}).map(([k, v]) => [k, safeDecode(v)]))
        const out = await r.handler({ req, p, q: url.searchParams })
        return out?.[REPLY] ? send(req, res, out.status, out.body) : send(req, res, 200, out)
      }
      if (url.pathname.startsWith('/api/')) throw new HttpError(404, 'Rota não encontrada')
      if (req.method === 'GET' && serveStatic(req, res, url)) return
      throw new HttpError(404, 'Não encontrado')
    } catch (err) {
      if (!err.status) console.error(err)
      send(req, res, err.status || 500, { error: err.status ? err.message : 'Erro interno ao processar a requisição', ...(err.extra ?? {}) })
    }
  })
}
