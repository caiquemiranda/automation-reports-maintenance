import { parseAddress } from './device.js'

/**
 * Investigação de falhas de laço: detecta "episódios" (o laço/placa caiu) e
 * procura quem deu sinais ANTES deles. Um curto num equipamento costuma derrubar
 * o laço inteiro — os vários "sem resposta" no momento da queda são consequência;
 * o suspeito é quem já falhava de forma intermitente nas horas anteriores.
 */

const MIN = 60000
const HOUR = 60 * MIN

export const EPISODE_KINDS = {
  cascade: { label: 'Cascata no laço', hint: '3 ou mais dispositivos do mesmo laço sem resposta em até 2 min' },
  card: { label: 'Falha de placa', hint: 'Trouble de placa (CARD TROUBLE) no nó — pode ser a placa do laço' },
  ground: { label: 'Falha de terra', hint: 'Fuga para a terra no nó — típica de fiação danificada ou curto' },
  node: { label: 'Nó fora da rede', hint: 'O nó deixou de responder na rede (NODE MISSING)' },
}

export const LOOKBACKS = [
  { key: '1h', label: '1 h', ms: HOUR },
  { key: '6h', label: '6 h', ms: 6 * HOUR },
  { key: '24h', label: '24 h', ms: 24 * HOUR },
  { key: '72h', label: '72 h', ms: 72 * HOUR },
]

const DEVICE_FAIL = new Set(['NO ANSWER', 'BAD ANSWER', 'HEAD MISSING', 'WRONG DEVICE'])
const NODE_KIND = { 'CARD TROUBLE STATUS': 'card', 'EARTH GROUND': 'ground', 'NODE MISSING': 'node' }

const CASCADE_GAP = 2 * MIN
const CASCADE_MIN_DEVICES = 3
const NODE_GAP = 30 * MIN

/** Nó do evento: pelo endereço ("13:M1-38-0", "13:1") ou pelo nó que registrou. */
const nodeOf = (e) => {
  const m = /^(\d+):/.exec(e.dev ?? '')
  return m ? +m[1] : e.node
}

/** Primeiro índice com ts >= t (eventos ordenados por ts). */
function lowerBound(events, t) {
  let lo = 0
  let hi = events.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (events[mid].ts < t) lo = mid + 1
    else hi = mid
  }
  return lo
}

/** Agrupa eventos ordenados em rajadas: um novo grupo começa após `gap` ms sem evento. */
function bursts(list, gap) {
  const out = []
  for (const e of list) {
    const cur = out.at(-1)
    if (cur && e.ts - cur.end <= gap) {
      cur.events.push(e)
      cur.end = e.ts
    } else out.push({ start: e.ts, end: e.ts, events: [e] })
  }
  return out
}

/** Episódios de falha no período (eventos já filtrados por data/site). */
export function detectEpisodes(events) {
  const sorted = [...events].sort((a, b) => a.ts - b.ts)
  const episodes = []

  // 1) Cascata: vários dispositivos do mesmo laço sem resposta quase ao mesmo tempo
  const byLoop = new Map()
  for (const e of sorted) {
    const a = DEVICE_FAIL.has(e.state) && parseAddress(e.dev)
    if (!a) continue
    if (!byLoop.has(a.loopKey)) byLoop.set(a.loopKey, [])
    byLoop.get(a.loopKey).push(e)
  }
  for (const [loopKey, list] of byLoop) {
    for (const b of bursts(list, CASCADE_GAP)) {
      const devices = [...new Set(b.events.map((e) => e.dev))]
      if (devices.length < CASCADE_MIN_DEVICES) continue
      // ordem de queda: quem falhou primeiro costuma estar mais perto do problema
      const order = devices.map((dev) => ({ dev, at: b.events.find((e) => e.dev === dev).ts, label: b.events.find((e) => e.dev === dev).label }))
      episodes.push({ kind: 'cascade', node: +loopKey.split(':')[0], loop: loopKey, start: b.start, end: b.end, count: b.events.length, devices: order, site: b.events[0].site })
    }
  }

  // 2) Troubles do nó (placa, terra, nó fora da rede), agrupados em 30 min
  const byNodeKind = new Map()
  for (const e of sorted) {
    const kind = NODE_KIND[e.type]
    if (!kind) continue
    const key = `${kind}|${nodeOf(e)}`
    if (!byNodeKind.has(key)) byNodeKind.set(key, [])
    byNodeKind.get(key).push(e)
  }
  for (const [key, list] of byNodeKind) {
    const [kind, node] = key.split('|')
    for (const b of bursts(list, NODE_GAP)) {
      episodes.push({ kind, node: +node, loop: null, start: b.start, end: b.end, count: b.events.length, devices: [], site: b.events[0].site })
    }
  }

  return episodes.sort((a, b) => b.start - a.start).map((ep, i) => ({ ...ep, id: `${ep.kind}-${ep.node}-${ep.start}-${i}` }))
}

/**
 * Quem deu sinal antes do episódio: dispositivos de laço do mesmo nó (e do mesmo
 * laço, numa cascata) com evento relevante na janela [início − lookback, início).
 * `events` precisa estar em ordem de data/hora (como vem da API).
 */
export function precursors(events, episode, lookback) {
  const from = episode.start - lookback
  const per = new Map()
  for (let i = lowerBound(events, from); i < events.length && events[i].ts < episode.start; i++) {
    const e = events[i]
    if (e.cat === 'info') continue
    const a = parseAddress(e.dev)
    if (!a || a.node !== episode.node || (episode.loop && a.loopKey !== episode.loop)) continue
    let p = per.get(e.dev)
    if (!p) per.set(e.dev, (p = { dev: e.dev, label: e.label, type: e.type, count: 0, first: e.ts, last: e.ts, states: {} }))
    p.count++
    if (e.ts < p.first) p.first = e.ts
    if (e.ts > p.last) p.last = e.ts
    p.states[e.state] = (p.states[e.state] || 0) + 1
  }
  return [...per.values()].map((p) => ({ ...p, leadMin: Math.round((episode.start - p.last) / MIN) })).sort((a, b) => b.count - a.count || b.last - a.last)
}

/**
 * Suspeitos recorrentes: em quantos episódios de cada nó o dispositivo aparece
 * como precursor. Quem "avisa" antes de muitas quedas é o primeiro a inspecionar.
 */
export function suspects(events, episodes, lookback) {
  const perNodeEpisodes = new Map()
  for (const ep of episodes) perNodeEpisodes.set(ep.node, (perNodeEpisodes.get(ep.node) || 0) + 1)
  const per = new Map()
  for (const ep of episodes) {
    for (const p of precursors(events, ep, lookback)) {
      let s = per.get(p.dev)
      if (!s) per.set(p.dev, (s = { dev: p.dev, label: p.label, type: p.type, node: ep.node, episodes: 0, signals: 0, states: {}, kinds: {} }))
      s.episodes++
      s.signals += p.count
      s.kinds[ep.kind] = (s.kinds[ep.kind] || 0) + 1
      for (const [k, v] of Object.entries(p.states)) s.states[k] = (s.states[k] || 0) + v
    }
  }
  return [...per.values()]
    .map((s) => ({ ...s, nodeEpisodes: perNodeEpisodes.get(s.node), share: s.episodes / perNodeEpisodes.get(s.node) }))
    .sort((a, b) => b.episodes - a.episodes || b.signals - a.signals)
}
