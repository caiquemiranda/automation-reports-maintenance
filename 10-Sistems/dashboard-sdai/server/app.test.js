import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { openDb } from './db.js'
import { createApp } from './app.js'

const LOG = [
  'TSW                      Entire Historical Log Report',
  'MONSANTO    212TSW02   Node  19    Rev  37  MON 28-SEP-26    10:16:25',
  '----------------------------------------------------------------------',
  'VOLUME:  THU 27-NOV-25',
  '1      11:26:58        P83 HISTORICAL LOG VOLUME DELETED',
  '       THU 27-NOV-25   (NODE 19)',
  '                       TROUBLE POINT                           ABNORMAL',
  '2      11:27:10        13:M1-38-0 MANUTENCAO DETECTOR 38',
  '       FRI 28-NOV-25   (NODE 13)',
  '                       SMOKE DETECTOR                          FIRE ALARM',
].join('\r\n')

describe('API HTTP', () => {
  let server, base, dir

  beforeAll(async () => {
    dir = mkdtempSync(join(tmpdir(), 'sdai-api-'))
    const dist = join(dir, 'dist')
    mkdirSync(dist)
    writeFileSync(join(dist, 'index.html'), '<!doctype html><title>SDAI</title>')
    writeFileSync(join(dir, 'segredo.txt'), 'não pode vazar')
    server = createApp({ db: openDb(':memory:'), dist, log: () => {} })
    await new Promise((ok) => server.listen(0, '127.0.0.1', ok))
    base = `http://127.0.0.1:${server.address().port}`
  })
  afterAll(() => {
    server.close()
    rmSync(dir, { recursive: true, force: true })
  })

  const get = async (path) => (await fetch(base + path)).json()
  const post = (slug, body, headers = {}) =>
    fetch(`${base}/api/clients/${slug}/imports`, { method: 'POST', body, headers: { 'X-File-Name': encodeURIComponent('log de teste.txt'), ...headers } })

  it('lista os 5 clientes, sem dados ainda', async () => {
    const clients = await get('/api/clients')
    expect(clients.map((c) => c.name)).toEqual(['Vinci Airports', 'Vedacit', 'Bridgestone', 'Bayer', 'Boulevard Shopping'])
    expect(clients.every((c) => c.events === 0 && c.sites.length === 0)).toBe(true)
    expect((await fetch(`${base}/api/clients/acme`)).status).toBe(404)
  })

  it('importa para a Bayer, ignora duplicados e registra o histórico', async () => {
    const a = await post('bayer', LOG)
    expect(a.status).toBe(201)
    expect(await a.json()).toMatchObject({ fileName: 'log de teste.txt', siteName: 'MONSANTO', inserted: 2, duplicates: 0 })
    expect(await (await post('bayer', LOG)).json()).toMatchObject({ inserted: 0, duplicates: 2, alreadyImported: true })

    const imports = await get('/api/clients/bayer/imports')
    expect(imports.map((i) => [i.fileName, i.inserted, i.siteName])).toEqual([
      ['log de teste.txt', 0, 'MONSANTO'],
      ['log de teste.txt', 2, 'MONSANTO'],
    ])
    expect(await get('/api/clients/bayer')).toMatchObject({ events: 2, integrity: { ok: true, missing: 0 } })
  })

  it('recusa o log da Bayer em outro cliente, com código para a interface', async () => {
    const r = await post('vedacit', LOG)
    expect(r.status).toBe(409)
    expect(await r.json()).toMatchObject({ code: 'other-client' })
    expect((await get('/api/clients/vedacit')).events).toBe(0)
  })

  it('eventos: completo (colunar) e paginado com busca', async () => {
    const all = await get('/api/clients/bayer/events')
    expect(all.columns).toEqual(expect.arrayContaining(['site', 'desc', 'seq']))
    expect(all.rows).toHaveLength(2)
    const day = await get('/api/clients/bayer/events?from=2025-11-28&to=2025-11-28')
    expect(day.rows.map((r) => r[all.columns.indexOf('seq')])).toEqual([2])

    const page = await get('/api/clients/bayer/events/page?size=1&q=detector')
    expect(page).toMatchObject({ total: 1, size: 1 })
    expect(page.rows[0]).toMatchObject({ seq: 2, desc: '13:M1-38-0 MANUTENCAO DETECTOR 38', state: 'FIRE ALARM', siteName: 'MONSANTO' })
    expect(page.rows[0].raw).toContain('SMOKE DETECTOR')
    expect((await get('/api/clients/bayer/events/page?q=100%25')).total).toBe(0) // % é literal, não curinga
  })

  it('erros de entrada e rotas desconhecidas', async () => {
    expect((await fetch(`${base}/api/clients/bayer/events?from=2026-13-01`)).status).toBe(400)
    expect((await fetch(`${base}/api/clients/bayer/events/page?size=9999`)).status).toBe(400)
    expect((await post('bayer', '   ')).status).toBe(400)
    expect((await post('bayer', 'isto não é um log do TSW')).status).toBe(422)
    expect((await fetch(`${base}/api/nada`)).status).toBe(404)
  })

  it('serve o dashboard e não deixa sair de dist/', async () => {
    expect(await (await fetch(`${base}/analytics/bayer`)).text()).toContain('<title>SDAI')
    for (const p of ['/../segredo.txt', '/%2e%2e/segredo.txt', '/..%5csegredo.txt', '/%E0%A4%A']) {
      expect(await (await fetch(base + p)).text()).not.toContain('não pode vazar')
    }
  })
})
