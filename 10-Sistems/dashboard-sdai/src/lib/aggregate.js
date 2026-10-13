import { CATEGORY_ORDER } from './classify.js'

const MIN = 60000
const HOUR = 60 * MIN
const DAY = 24 * HOUR
const toTs = (day) => Date.parse(day + 'T00:00:00Z')
const hm = (t) => (t ? (+t.slice(0, 2) * 60 + +t.slice(3, 5)) * MIN : 0)
export const dayOf = (ts) => new Date(ts).toISOString().slice(0, 10)
export const timeOf = (ts) => new Date(ts).toISOString().slice(11, 16)

export const EMPTY_FILTERS = {
  from: '',
  to: '',
  tFrom: '', // HH:MM no dia "from" (vazio = 00:00)
  tTo: '', // HH:MM no dia "to" (vazio = 23:59)
  devs: [], // endereços de dispositivo (ex.: 13:M1-38-0); vazio = todos
  nodes: [], // vazio = todos; -1 = eventos sem nó
  sites: [], // vazio = todos os sites do cliente
  cats: [], // vazio = todas
  states: [],
  search: '',
  hideInfo: true,
}

export const nodeKey = (e) => (e.node === null ? -1 : e.node)

/** Período absoluto do filtro (epoch ms, inclusivo). Hora sem data é ignorada. */
export function rangeOf(f) {
  return {
    from: f.from ? toTs(f.from) + hm(f.tFrom) : -Infinity,
    to: f.to ? toTs(f.to) + (f.tTo ? hm(f.tTo) + MIN - 1 : DAY - 1) : Infinity,
  }
}

/** Converte um intervalo absoluto (ex.: barra clicada, área arrastada) em filtros de data/hora. */
export function filtersForRange(fromTs, toTs) {
  const startOfDay = fromTs % DAY === 0
  const endOfDay = (toTs + 1) % DAY === 0
  return { from: dayOf(fromTs), to: dayOf(toTs), tFrom: startOfDay ? '' : timeOf(fromTs), tTo: endOfDay ? '' : timeOf(toTs) }
}

/** Aplica os filtros. `range` (epoch ms) substitui o período, para o cálculo do período anterior. */
export function filterEvents(events, f, range = null) {
  const { from, to } = range ?? rangeOf(f)
  const nodes = f.nodes.length ? new Set(f.nodes) : null
  const devs = f.devs?.length ? new Set(f.devs) : null
  const sites = f.sites?.length ? new Set(f.sites) : null
  const cats = f.cats.length ? new Set(f.cats) : null
  const states = f.states.length ? new Set(f.states) : null
  const q = f.search.trim().toLowerCase()
  const out = []
  for (const e of events) {
    if (e.ts < from || e.ts > to) continue
    if (f.hideInfo && e.cat === 'info' && !(cats && cats.has('info'))) continue
    if (cats && !cats.has(e.cat)) continue
    if (nodes && !nodes.has(nodeKey(e))) continue
    if (devs && !devs.has(e.dev)) continue
    if (sites && !sites.has(e.site)) continue
    if (states && !states.has(e.state)) continue
    if (q && !(e.desc.toLowerCase().includes(q) || e.type.toLowerCase().includes(q) || e.state.toLowerCase().includes(q))) continue
    out.push(e)
  }
  return out
}

/** Janela imediatamente anterior, com o mesmo tamanho, para comparação. */
export function previousRange(f, bounds) {
  if (!bounds.min || !bounds.max) return null
  const r = rangeOf(f)
  const start = Number.isFinite(r.from) ? r.from : toTs(bounds.min)
  const end = Number.isFinite(r.to) ? r.to : toTs(bounds.max) + DAY - 1
  const len = end - start + 1
  const prev = { from: start - len, to: start - 1 }
  return prev.to < toTs(bounds.min) ? null : prev
}

/**
 * Escalas da linha do tempo, da mais fina à mais grossa. `auto` escolhe pela
 * duração do período; uma escala só é oferecida se gerar no máximo MAX_BUCKETS barras.
 */
export const GRANULARITIES = [
  { key: 'min', label: '1 min', size: MIN, autoUpTo: 2 * HOUR },
  { key: '5min', label: '5 min', size: 5 * MIN, autoUpTo: 12 * HOUR },
  { key: '15min', label: '15 min', size: 15 * MIN, autoUpTo: 2 * DAY },
  { key: 'hora', label: 'Hora', size: HOUR, autoUpTo: 10 * DAY },
  { key: 'dia', label: 'Dia', size: DAY, autoUpTo: 92 * DAY },
  { key: 'semana', label: 'Semana', size: 7 * DAY, autoUpTo: Infinity },
]
export const MAX_BUCKETS = 1500

/** Início do balde que contém ts (semanas começam na segunda). */
function bucketStart(ts, g) {
  if (g.key !== 'semana') return ts - (ts % g.size)
  const day = ts - (ts % DAY)
  return day - ((new Date(day).getUTCDay() + 6) % 7) * DAY
}

/** Escala efetiva para um período: a pedida, se couber; senão a automática. */
export function pickGranularity(span, wanted) {
  const fits = (g) => span / g.size <= MAX_BUCKETS
  const asked = GRANULARITIES.find((g) => g.key === wanted)
  if (asked && fits(asked)) return asked
  return GRANULARITIES.find((g) => span <= g.autoUpTo && fits(g)) ?? GRANULARITIES.at(-1)
}

/** Série temporal contínua (baldes vazios aparecem zerados) sobre o período do filtro. */
export function buildSeries(list, f, wanted = 'auto') {
  if (!list.length) return Object.assign([], { gran: GRANULARITIES[4], weekly: false })
  let min = Infinity
  let max = -Infinity
  for (const e of list) {
    if (e.ts < min) min = e.ts
    if (e.ts > max) max = e.ts
  }
  // período do filtro, ampliado se vier evento de fora (ex.: comparação com o período anterior)
  const r = rangeOf(f)
  const start = Math.min(Number.isFinite(r.from) ? r.from : min, min)
  const end = Math.max(Number.isFinite(r.to) ? r.to : max, max)
  const g = pickGranularity(end - start + 1, wanted)
  const buckets = new Map()
  for (let t = bucketStart(start, g); t <= end; t += g.size) {
    buckets.set(t, { key: t, size: g.size, fire: 0, device: 0, supervisory: 0, trouble: 0, info: 0 })
  }
  for (const e of list) buckets.get(bucketStart(e.ts, g))[e.cat]++
  return Object.assign([...buckets.values()], { gran: g, weekly: g.key === 'semana' })
}

/** Uma passada: tudo que o painel precisa a partir do recorte filtrado. */
export function summarize(list, f, bounds, gran = 'auto', { withSeries = true } = {}) {
  const byCat = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, { count: 0, devices: new Set() }]))
  const byNode = new Map()
  const heat = Array.from({ length: 7 }, () => new Array(24).fill(0))
  const offenders = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, new Map()]))
  const stateCount = new Map()

  for (const e of list) {
    const c = byCat[e.cat]
    c.count++
    if (e.dev) c.devices.add(e.dev)

    const nk = nodeKey(e)
    let n = byNode.get(nk)
    if (!n) byNode.set(nk, (n = { node: nk, total: 0, fire: 0, device: 0, supervisory: 0, trouble: 0, info: 0 }))
    n.total++
    n[e.cat]++

    heat[e.dow][e.hour]++
    stateCount.set(e.state, (stateCount.get(e.state) || 0) + 1)

    const key = (e.dev || e.desc) + '|' + e.type
    const map = offenders[e.cat]
    let o = map.get(key)
    if (!o) {
      map.set(key, (o = { key, cat: e.cat, node: e.node, dev: e.dev, label: e.label, type: e.type, count: 0, first: e.ts, last: e.ts, states: {} }))
    }
    o.count++
    if (e.ts < o.first) o.first = e.ts
    if (e.ts > o.last) o.last = e.ts
    o.states[e.state] = (o.states[e.state] || 0) + 1
  }

  const rank = (map) => [...map.values()].sort((a, b) => b.count - a.count || b.last - a.last)

  return {
    total: list.length,
    byCat,
    nodes: [...byNode.values()].sort((a, b) => b.total - a.total),
    heat,
    heatMax: Math.max(1, ...heat.flat()),
    series: withSeries ? buildSeries(list, f, gran) : [],
    offenders: Object.fromEntries(CATEGORY_ORDER.map((c) => [c, rank(offenders[c])])),
    stateCount,
    bounds,
  }
}

/** Metadados do log carregado: limites de datas, nós, estados e meses disponíveis. */
export function describeEvents(events) {
  let min = Infinity
  let max = -Infinity
  const nodes = new Set()
  const states = new Set()
  const months = new Set()
  const sites = new Set()
  const devices = new Map()
  for (const e of events) {
    if (e.site !== undefined) sites.add(e.site)
    if (e.dev) {
      let d = devices.get(e.dev)
      if (!d) devices.set(e.dev, (d = { dev: e.dev, label: e.label, type: e.type, node: e.node, relevant: 0, total: 0 }))
      d.total++
      if (e.cat !== 'info') d.relevant++
      if (!d.type && e.type) {
        // nome/tipo do primeiro evento do próprio dispositivo (não o de modo instalação)
        d.type = e.type
        d.label = e.label
      }
    }
    if (e.ts < min) min = e.ts
    if (e.ts > max) max = e.ts
    nodes.add(nodeKey(e))
    if (e.state) states.add(e.state)
    months.add(e.day.slice(0, 7))
  }
  return {
    min: events.length ? dayOf(min) : '',
    max: events.length ? dayOf(max) : '',
    nodes: [...nodes].sort((a, b) => a - b),
    states: [...states].sort(),
    months: [...months].sort(),
    sites: [...sites].sort((a, b) => a - b),
    // dispositivos com mais ocorrências relevantes primeiro
    devices: [...devices.values()].sort((a, b) => b.relevant - a.relevant || a.dev.localeCompare(b.dev, 'pt-BR', { numeric: true })),
  }
}

/** Percentual de variação; null quando não há base de comparação. */
export const delta = (cur, prev) => (prev === null || prev === undefined ? null : prev === 0 ? (cur === 0 ? 0 : null) : ((cur - prev) / prev) * 100)
