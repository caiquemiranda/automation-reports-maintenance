import { describe, it, expect } from 'vitest'
import { EMPTY_FILTERS, summarize, buildSeries, filterEvents, filtersForRange, pickGranularity, previousRange, rangeOf } from './aggregate.js'
import { filtersFromQuery, filtersToQuery } from './filterParams.js'
import { deviceProfile, neighbors, parseAddress } from './device.js'
import { detectEpisodes, precursors, suspects } from './investigate.js'
import { enrich } from './parser.js'

const MIN = 60000
const HOUR = 60 * MIN
const T = (iso) => Date.parse(iso + 'Z')
let id = 0
/** Evento sintético já enriquecido (categoria calculada pela regra real). */
const ev = (iso, dev, state, type = 'SMOKE DETECTOR', extra = {}) =>
  enrich({ id: ++id, ts: T(iso), node: +(/^(\d+)/.exec(dev)?.[1] ?? 0), desc: `${dev} DISPOSITIVO ${dev}`, type, state, detail: '', ...extra })

describe('período com hora', () => {
  it('rangeOf usa a hora quando há data e o dia inteiro quando não há', () => {
    expect(rangeOf({ ...EMPTY_FILTERS, from: '2026-09-17', to: '2026-09-17' })).toEqual({ from: T('2026-09-17T00:00:00'), to: T('2026-09-17T23:59:59.999') })
    expect(rangeOf({ ...EMPTY_FILTERS, from: '2026-09-17', tFrom: '07:30', to: '2026-09-17', tTo: '12:15' })).toEqual({
      from: T('2026-09-17T07:30:00'),
      to: T('2026-09-17T12:15:59.999'),
    })
  })
  it('filtersForRange devolve só datas para dias inteiros e hora para trechos', () => {
    expect(filtersForRange(T('2026-09-17T00:00:00'), T('2026-09-17T23:59:59.999'))).toEqual({ from: '2026-09-17', to: '2026-09-17', tFrom: '', tTo: '' })
    expect(filtersForRange(T('2026-09-17T07:30:00'), T('2026-09-17T07:44:59.999'))).toEqual({ from: '2026-09-17', to: '2026-09-17', tFrom: '07:30', tTo: '07:44' })
  })
  it('filtra por janela de horas que atravessa a meia-noite', () => {
    const list = [ev('2026-09-16T22:59:00', '13:M1-38-0', 'BAD ANSWER'), ev('2026-09-16T23:30:00', '13:M1-38-0', 'BAD ANSWER'), ev('2026-09-17T01:00:00', '13:M1-38-0', 'BAD ANSWER')]
    const f = { ...EMPTY_FILTERS, from: '2026-09-16', tFrom: '23:00', to: '2026-09-17', tTo: '00:59' }
    expect(filterEvents(list, f).map((e) => e.ts)).toEqual([T('2026-09-16T23:30:00')])
  })
  it('período anterior respeita a janela de horas', () => {
    const f = { ...EMPTY_FILTERS, from: '2026-09-17', tFrom: '10:00', to: '2026-09-17', tTo: '10:59' }
    expect(previousRange(f, { min: '2026-01-01', max: '2026-09-30' })).toEqual({ from: T('2026-09-17T09:00:00'), to: T('2026-09-17T09:59:59.999') })
  })
  it('URL ida e volta, incluindo hora e dispositivo', () => {
    const f = { ...EMPTY_FILTERS, from: '2026-09-17', tFrom: '07:30', to: '2026-09-17', tTo: '12:15', devs: ['13:M1-38-0', '13:M1-36-0'] }
    const q = new URLSearchParams(Object.entries(filtersToQuery(f)).filter(([, v]) => v))
    expect(filtersFromQuery(q)).toEqual(f)
    expect(filtersFromQuery(new URLSearchParams('hde=07:30&de=lixo')).tFrom).toBe('') // hora sem data válida é ignorada
  })
})

describe('linha do tempo em escalas finas', () => {
  it('escolhe a escala automática pela duração e recusa escalas com barras demais', () => {
    expect(pickGranularity(HOUR, 'auto').key).toBe('min')
    expect(pickGranularity(24 * HOUR, 'auto').key).toBe('15min')
    expect(pickGranularity(5 * 24 * HOUR, 'auto').key).toBe('hora')
    expect(pickGranularity(300 * 24 * HOUR, 'auto').key).toBe('semana')
    expect(pickGranularity(300 * 24 * HOUR, 'min').key).toBe('semana') // 1 min em 300 dias: barras demais
    expect(pickGranularity(24 * HOUR, '5min').key).toBe('5min')
  })
  it('eventos fora do período do filtro (comparação com o anterior) não quebram a série', () => {
    const f = { ...EMPTY_FILTERS, from: '2026-09-17', to: '2026-09-17' }
    const prevDay = [ev('2026-09-16T10:00:00', '13:M1-38-0', 'BAD ANSWER')]
    expect(() => buildSeries(prevDay, f)).not.toThrow()
    expect(buildSeries(prevDay, f).reduce((a, b) => a + b.device, 0)).toBe(1)
    expect(summarize(prevDay, f, {}, 'auto', { withSeries: false }).series).toEqual([])
  })
  it('um dia em 15 min: 96 baldes contínuos, contagem preservada', () => {
    const list = [ev('2026-09-17T07:33:53', '13:M1-38-0', 'BAD ANSWER'), ev('2026-09-17T07:40:00', '13:M1-38-0', 'BAD ANSWER'), ev('2026-09-17T12:11:12', '13:M1-6-0', 'BAD ANSWER')]
    const s = buildSeries(list, { ...EMPTY_FILTERS, from: '2026-09-17', to: '2026-09-17' })
    expect(s.gran.key).toBe('15min')
    expect(s).toHaveLength(96)
    expect(s.find((b) => b.key === T('2026-09-17T07:30:00')).device).toBe(2)
    expect(s.reduce((a, b) => a + b.device, 0)).toBe(3)
  })
})

describe('dispositivo', () => {
  it('lê o endereço do Simplex', () => {
    expect(parseAddress('13:M1-38-0')).toMatchObject({ node: 13, loop: 'M1', device: 38, loopKey: '13:M1' })
    expect(parseAddress('8:P212')).toBeNull()
  })
  it('filtro de dispositivo e perfil: intervalos curtos, rajada e calendário', () => {
    const list = [
      ev('2026-09-17T07:00:00', '13:M1-38-0', 'BAD ANSWER'),
      ev('2026-09-17T07:00:40', '13:M1-38-0', 'BAD ANSWER'),
      ev('2026-09-17T07:01:30', '13:M1-38-0', 'BAD ANSWER'),
      ev('2026-09-18T09:00:00', '13:M1-38-0', 'BAD ANSWER'),
      ev('2026-09-17T07:00:30', '13:M1-36-0', 'BAD ANSWER'),
    ]
    const mine = filterEvents(list, { ...EMPTY_FILTERS, devs: ['13:M1-38-0'] })
    expect(mine).toHaveLength(4)
    const p = deviceProfile(list, mine, '13:M1-38-0')
    expect(p).toMatchObject({ count: 4, days: 2, label: 'DISPOSITIVO 13:M1-38-0', type: 'SMOKE DETECTOR' })
    expect(p.burst1h.count).toBe(3)
    expect(p.intervals.find((b) => b.label === '< 1 min').count).toBe(2)
    expect(p.history.perDay.get('2026-09-17')).toBe(3)
    expect(p.neighbors[0]).toMatchObject({ dev: '13:M1-36-0', together: 3 })
  })
  it('vizinhos só do mesmo nó e dentro da janela', () => {
    const list = [ev('2026-09-17T07:00:00', '13:M1-38-0', 'BAD ANSWER'), ev('2026-09-17T07:00:30', '11:M1-5-0', 'NO ANSWER'), ev('2026-09-17T07:10:00', '13:M1-6-0', 'NO ANSWER')]
    expect(neighbors(list, [list[0]], '13:M1-38-0')).toEqual([])
  })
})

describe('investigação de falhas de laço', () => {
  const base = [
    // sinais antes: 38-0 intermitente horas antes da queda
    ev('2026-09-17T05:00:00', '13:M1-38-0', 'BAD ANSWER'),
    ev('2026-09-17T05:00:45', '13:M1-38-0', 'BAD ANSWER'),
    ev('2026-09-17T06:30:00', '13:M1-38-0', 'BAD ANSWER'),
    // ruído de outro nó não pode contar
    ev('2026-09-17T06:40:00', '11:M1-5-0', 'NO ANSWER'),
    // a queda: 4 dispositivos do laço 13:M1 sem resposta em 1 min
    ev('2026-09-17T07:33:00', '13:M1-10-0', 'NO ANSWER'),
    ev('2026-09-17T07:33:20', '13:M1-11-0', 'NO ANSWER'),
    ev('2026-09-17T07:33:40', '13:M1-12-0', 'NO ANSWER'),
    ev('2026-09-17T07:34:00', '13:M1-13-0', 'NO ANSWER'),
    // trouble de placa no mesmo nó, depois
    ev('2026-09-17T07:35:00', '13:1', 'TROUBLE', 'CARD TROUBLE STATUS', { desc: '13:1 COMMON TROUBLE POINT FOR NODE: 13' }),
  ].sort((a, b) => a.ts - b.ts)

  it('detecta cascata (com a ordem de queda) e falha de placa', () => {
    const eps = detectEpisodes(base)
    const cascade = eps.find((e) => e.kind === 'cascade')
    expect(cascade).toMatchObject({ node: 13, loop: '13:M1', start: T('2026-09-17T07:33:00'), count: 4 })
    expect(cascade.devices.map((d) => d.dev)).toEqual(['13:M1-10-0', '13:M1-11-0', '13:M1-12-0', '13:M1-13-0'])
    expect(eps.find((e) => e.kind === 'card')).toMatchObject({ node: 13, count: 1 })
  })
  it('2 dispositivos não formam cascata', () => {
    expect(detectEpisodes(base.filter((e) => !['13:M1-12-0', '13:M1-13-0'].includes(e.dev))).some((e) => e.kind === 'cascade')).toBe(false)
  })
  it('precursores: só o mesmo nó/laço, só dentro da janela, ordenados por sinais', () => {
    const cascade = detectEpisodes(base).find((e) => e.kind === 'cascade')
    expect(precursors(base, cascade, 24 * HOUR).map((p) => [p.dev, p.count, p.leadMin])).toEqual([['13:M1-38-0', 3, 63]])
    expect(precursors(base, cascade, HOUR)).toEqual([]) // o último sinal foi 63 min antes: fora de 1 h
    expect(precursors(base, cascade, 2 * HOUR).map((p) => [p.dev, p.count])).toEqual([['13:M1-38-0', 1]]) // só o das 06:30 entra em 2 h
  })
  it('suspeitos: aparece antes dos 2 episódios do nó 13', () => {
    const s = suspects(base, detectEpisodes(base), 24 * HOUR)
    expect(s[0]).toMatchObject({ dev: '13:M1-38-0', episodes: 2, nodeEpisodes: 2, share: 1 })
  })
})
