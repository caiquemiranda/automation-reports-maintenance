import { enrich } from './parser.js'

export class ApiError extends Error {
  constructor(status, body) {
    super(body.error || `Erro ${status} no servidor`)
    Object.assign(this, { status, code: body.code, body })
  }
}

async function request(path, init) {
  let res
  try {
    res = await fetch(path, init)
  } catch {
    throw new ApiError(0, { error: 'Servidor do SDAI indisponível. Verifique se o backend está rodando (npm run server).' })
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, body)
  return body
}

const enc = encodeURIComponent

export const fetchClients = () => request('/api/clients')
export const fetchClient = (slug) => request(`/api/clients/${enc(slug)}`)
export const fetchImports = (slug) => request(`/api/clients/${enc(slug)}/imports`)
export const fetchEventsPage = (slug, { page = 0, size = 50, q = '', site = '', order = 'desc' } = {}) =>
  request(`/api/clients/${enc(slug)}/events/page?${new URLSearchParams({ page, size, q, site, order })}`)

// Eventos completos do cliente (para o Analytics): cacheados até a próxima importação.
const eventsCache = new Map()

export function fetchClientEvents(slug) {
  if (!eventsCache.has(slug)) {
    const p = request(`/api/clients/${enc(slug)}/events`).then(({ columns, rows }) =>
      rows.map((r) => {
        const e = {}
        for (let i = 0; i < columns.length; i++) e[columns[i]] = r[i]
        return enrich(e)
      }),
    )
    p.catch(() => eventsCache.delete(slug))
    eventsCache.set(slug, p)
  }
  return eventsCache.get(slug)
}

/** Envia o log; o backend grava só o que é novo. */
export async function uploadLog(slug, file, { siteId, createSite } = {}) {
  const headers = { 'Content-Type': 'text/plain; charset=utf-8', 'X-File-Name': enc(file.name) }
  if (siteId) headers['X-Site-Id'] = String(siteId)
  if (createSite) headers['X-Create-Site'] = '1'
  const report = await request(`/api/clients/${enc(slug)}/imports`, { method: 'POST', headers, body: await file.text() })
  eventsCache.delete(slug)
  return report
}
