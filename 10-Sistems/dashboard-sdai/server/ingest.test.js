import { describe, it, expect, beforeAll } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { parseLog } from '../src/lib/parser.js'
import { openDb, integrity, listEvents, getClient, listSites } from './db.js'
import { ingestLog } from './ingest.js'
import { splitLog, chunk, toText, cutLines } from './logSplit.js'

const REAL = 'data/log.txt'

/** Representação canônica de um evento para comparar banco × arquivo. */
const key = (e) => JSON.stringify([e.vol, e.seq, e.ts, e.node, e.desc, e.type, e.state, e.detail])
const fromFile = (text) => parseLog(text).events.map((e) => key({ ...e, seq: e.id })).sort()
const rowsOf = (db, slug = 'bayer') => {
  const { columns, rows } = listEvents(db, getClient(db, slug).id)
  return rows.map((r) => Object.fromEntries(columns.map((c, i) => [c, r[i]])))
}
const fromDb = (db, slug) => rowsOf(db, slug).map(key).sort()
const check = (db, slug = 'bayer') => integrity(db, getClient(db, slug).id)
const freshDb = () => openDb(':memory:')
const ingest = (db, text, opts = {}) => ingestLog(db, text, { client: 'bayer', ...opts })

describe.skipIf(!existsSync(REAL))('ingestão incremental com o log real', () => {
  let text, header, blocks, truth

  beforeAll(() => {
    text = readFileSync(REAL, 'utf8')
    ;({ header, blocks } = splitLog(text))
    truth = fromFile(text)
  })

  it('importa tudo e reimportar o mesmo arquivo não muda nada', () => {
    const db = freshDb()
    const a = ingest(db, text)
    expect(a).toMatchObject({ parsed: 21193, inserted: 21193, duplicates: 0, completed: 0, siteName: 'MONSANTO' })
    const b = ingest(db, text)
    expect(b).toMatchObject({ inserted: 0, duplicates: 21193, completed: 0, alreadyImported: true })
    expect(fromDb(db)).toEqual(truth)
    expect(check(db).ok).toBe(true)
  })

  it('10 partes sem sobreposição, em ordem: só novos, nada faltando', () => {
    const db = freshDb()
    const parts = chunk(blocks, 10)
    let total = 0
    parts.forEach((p, i) => {
      // só a 1ª parte tem cabeçalho: as demais simulam um corte manual do arquivo
      const r = ingest(db, toText(p, i === 0 ? header : null))
      total += p.length
      expect(r).toMatchObject({ parsed: p.length, inserted: p.length, duplicates: 0, dbTotal: total })
    })
    expect(fromDb(db)).toEqual(truth) // inclui o volume herdado pelas partes sem cabeçalho
    expect(check(db).ok).toBe(true)
  })

  it('10 partes fora de ordem e repetidas: mesmo resultado', () => {
    const db = freshDb()
    const parts = chunk(blocks, 10).map((p) => toText(p, header))
    for (const i of [7, 2, 9, 0, 4, 4, 1, 8, 3, 6, 5, 2, 7]) ingest(db, parts[i])
    expect(fromDb(db)).toEqual(truth)
    expect(check(db).ok).toBe(true)
  })

  it('downloads acumulados (cada log contém o anterior): insere só a parte nova', () => {
    const db = freshDb()
    const parts = chunk(blocks, 10)
    let soFar = 0
    parts.forEach((p, i) => {
      const r = ingest(db, toText(parts.slice(0, i + 1).flat(), header))
      expect(r).toMatchObject({ inserted: p.length, duplicates: soFar })
      soFar += p.length
    })
    expect(fromDb(db)).toEqual(truth)
  })

  it('janelas sobrepostas (o log antigo saiu do início): sem duplicar', () => {
    const db = freshDb()
    const parts = chunk(blocks, 10)
    let inserted = 0
    for (let i = 0; i < 10; i += 2) inserted += ingest(db, toText(parts.slice(i, i + 3).flat(), header)).inserted
    expect(inserted).toBe(21193)
    expect(fromDb(db)).toEqual(truth)
  })

  it('cortes no meio de eventos: perdas são avisadas, detectadas e corrigidas pelo próximo log', () => {
    const db = freshDb()
    const reports = cutLines(text, 10).map((t) => ingest(db, t))
    const truthBySeq = new Map(parseLog(text).events.map((e) => [e.id, e]))

    // nunca duplica e tudo que entrou é um evento verdadeiro (mesma identidade)
    const got = rowsOf(db)
    expect(new Set(got.map((e) => e.seq)).size).toBe(got.length)
    for (const e of got) {
      const t = truthBySeq.get(e.seq)
      expect([e.ts, e.node, e.desc]).toEqual([t.ts, t.node, t.desc])
    }

    // o que faltou aparece como buraco na integridade e nos avisos da importação
    const missing = [...truthBySeq.keys()].filter((s) => !got.some((e) => e.seq === s))
    expect(missing.length).toBeGreaterThan(0)
    const gaps = check(db).sites[0].volumes.flatMap((v) => v.gaps.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, i) => a + i)))
    expect(gaps.sort((a, b) => a - b)).toEqual(missing)
    expect(reports.flatMap((r) => r.warnings).join(' ')).toMatch(/cortado|meio de um evento/)

    // o próximo log completo preenche os buracos e completa os eventos cortados
    const fix = ingest(db, text)
    expect(fix.inserted).toBe(missing.length)
    expect(fromDb(db)).toEqual(truth)
    expect(check(db).ok).toBe(true)
  })

  it('log renumerado pelo TSW: realinha pelo conteúdo, sem duplicar', () => {
    const db = freshDb()
    ingest(db, toText(blocks.slice(0, 10000), header))
    // simula buffer circular: os 5000 mais antigos saíram e a numeração recomeçou em 1
    const renumbered = blocks.slice(5000, 12000).map(([first, ...rest]) => [
      first.replace(/^(\d+)(\s+)/, (m, n) => String(n - 5000).padEnd(m.length)),
      ...rest,
    ])
    const r = ingest(db, toText(renumbered, header))
    expect(r).toMatchObject({ seqOffset: 5000, inserted: 2000, duplicates: 5000 })
    expect(fromDb(db)).toEqual(fromFile(toText(blocks.slice(0, 12000), header)))
    expect(check(db).ok).toBe(true)
  })

  it('novo volume do histórico (numeração recomeça em 1): entra como volume separado', () => {
    const db = freshDb()
    ingest(db, text)
    // mesmo conteúdo, dois anos depois, em outro volume
    const next = toText(blocks.slice(0, 500), header).replace(/(\d{2}-[A-Z]{3}-)2([56])/g, (_, d, y) => `${d}2${+y + 2}`)
    expect(ingest(db, next)).toMatchObject({ inserted: 500, duplicates: 0, seqOffset: 0 })
    const v = check(db)
    expect(v.sites[0].volumes.map((x) => [x.vol, x.events])).toEqual([
      ['2025-11-27', 21193],
      ['2027-11-27', 500],
    ])
    expect(v.ok).toBe(true)
  })
})

describe('clientes e sites', () => {
  const HEAD = (site, panel) => [
    'TSW                      Entire Historical Log Report',
    `${site}    ${panel}   Node  19    Rev  37  MON 28-SEP-26    10:16:25`,
    'VOLUME:  THU 27-NOV-25',
  ]
  const BODY = [
    '1      11:26:58        P83 HISTORICAL LOG VOLUME DELETED',
    '       THU 27-NOV-25   (NODE 19)',
    '                       TROUBLE POINT                           ABNORMAL',
    '2      11:27:10        13:M1-38-0 MANUTENCAO DETECTOR 38',
    '       FRI 28-NOV-25   (NODE 13)',
    '                       SMOKE DETECTOR                          FIRE ALARM',
  ]
  const log = (site, panel) => [...HEAD(site, panel), ...BODY].join('\n')

  it('os 5 clientes existem desde o início', () => {
    const db = freshDb()
    expect(['vinci-airports', 'vedacit', 'bridgestone', 'bayer', 'boulevard-shopping'].every((s) => getClient(db, s))).toBe(true)
  })

  it('1º log de um cliente cria o site a partir do cabeçalho do TSW', () => {
    const db = freshDb()
    const r = ingest(db, log('MONSANTO', '212TSW02'))
    expect(r).toMatchObject({ siteName: 'MONSANTO', inserted: 2 })
    expect(listSites(db, getClient(db, 'bayer').id).map((s) => s.source)).toEqual(['MONSANTO · 212TSW02'])
  })

  it('bloqueia o log de um painel que pertence a outro cliente', () => {
    const db = freshDb()
    ingest(db, log('MONSANTO', '212TSW02'))
    expect(() => ingestLog(db, log('MONSANTO', '212TSW02'), { client: 'vedacit' })).toThrow(/pertence ao cliente Bayer/)
    expect(rowsOf(db, 'vedacit')).toEqual([])
  })

  it('painel desconhecido num cliente que já tem site: pede confirmação para criar outro site', () => {
    const db = freshDb()
    ingestLog(db, log('GRU', 'TSW01'), { client: 'vinci-airports' })
    expect(() => ingestLog(db, log('BSB', 'TSW01'), { client: 'vinci-airports' })).toThrow(expect.objectContaining({ code: 'unknown-panel' }))
    const r = ingestLog(db, log('BSB', 'TSW01'), { client: 'vinci-airports', createSite: true })
    expect(r).toMatchObject({ siteName: 'BSB', inserted: 2 }) // mesmo conteúdo, outro site: não é duplicado
    expect(rowsOf(db, 'vinci-airports')).toHaveLength(4)
  })

  it('arquivo sem cabeçalho num cliente com vários sites: exige escolher o site', () => {
    const db = freshDb()
    ingestLog(db, log('GRU', 'TSW01'), { client: 'vinci-airports' })
    const bsb = ingestLog(db, log('BSB', 'TSW01'), { client: 'vinci-airports', createSite: true })
    const headless = BODY.join('\n')
    expect(() => ingestLog(db, headless, { client: 'vinci-airports' })).toThrow(expect.objectContaining({ code: 'site-required' }))
    expect(ingestLog(db, headless, { client: 'vinci-airports', siteId: bsb.siteId })).toMatchObject({ siteName: 'BSB', duplicates: 2 })
  })
})

describe('parser: linhas de relatório no meio do arquivo', () => {
  it('VOLUME/cabeçalho repetidos não viram detalhe do evento anterior', () => {
    const t = [
      'VOLUME:  THU 27-NOV-25',
      '1      11:26:58        A',
      '       THU 27-NOV-25   (NODE 19)',
      'TSW                      Entire Historical Log Report',
      'MONSANTO    212TSW02   Node  19    Rev  37  MON 28-SEP-26    10:16:25',
      '----------------------------------------------------------------------',
      'VOLUME:  FRI 28-NOV-25',
      '1      09:00:00        B',
      '       FRI 28-NOV-25   (NODE 3)',
    ].join('\n')
    const { events, warnings } = parseLog(t)
    expect(events.map((e) => [e.id, e.vol, e.detail])).toEqual([
      [1, '2025-11-27', ''],
      [1, '2025-11-28', ''],
    ])
    expect(warnings).toEqual([])
  })
})
