/**
 * Análise individual de um dispositivo: histórico, recorrência e vizinhos que
 * falham junto. Endereço do Simplex: "<nó>:<laço>-<dispositivo>-<sub>", ex.: 13:M1-38-0.
 */

const MIN = 60000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

const ADDR_RE = /^(\d+):(M\d+)-(\d+)-(\d+)$/

/** { node: 13, loop: 'M1', device: 38, loopKey: '13:M1' } ou null (pontos que não são de laço). */
export function parseAddress(dev) {
  const m = ADDR_RE.exec(dev ?? '')
  return m ? { node: +m[1], loop: m[2], device: +m[3], sub: +m[4], loopKey: `${m[1]}:${m[2]}` } : null
}

/** Faixas de intervalo entre ocorrências seguidas: curtas e repetidas = comportamento intermitente. */
export const INTERVAL_BINS = [
  { label: '< 1 min', max: MIN },
  { label: '1–5 min', max: 5 * MIN },
  { label: '5–15 min', max: 15 * MIN },
  { label: '15–60 min', max: HOUR },
  { label: '1–6 h', max: 6 * HOUR },
  { label: '6–24 h', max: DAY },
  { label: '1–7 dias', max: 7 * DAY },
  { label: '> 7 dias', max: Infinity },
]

/** Maior quantidade de ocorrências dentro de qualquer janela de `win` ms (janela deslizante). */
function maxInWindow(times, win) {
  let best = { count: 0, start: null }
  for (let i = 0, j = 0; j < times.length; j++) {
    while (times[j] - times[i] >= win) i++
    if (j - i + 1 > best.count) best = { count: j - i + 1, start: times[i] }
  }
  return best
}

/**
 * Perfil de um dispositivo.
 * @param {object[]} all      todos os eventos do cliente (já enriquecidos)
 * @param {object[]} inRange  eventos do dispositivo no recorte atual do dashboard
 * @param {string}   dev      endereço
 */
export function deviceProfile(all, inRange, dev, { neighborWindow = 2 * MIN } = {}) {
  const history = all.filter((e) => e.dev === dev && e.cat !== 'info')
  const meta = all.find((e) => e.dev === dev && e.type) ?? all.find((e) => e.dev === dev) ?? null

  // calendário: ocorrências por dia em todo o histórico
  const perDay = new Map()
  for (const e of history) perDay.set(e.day, (perDay.get(e.day) || 0) + 1)

  const times = inRange.map((e) => e.ts).sort((a, b) => a - b)
  const gaps = times.slice(1).map((t, i) => t - times[i])
  const intervals = INTERVAL_BINS.map((b) => ({ ...b, count: 0 }))
  for (const g of gaps) intervals.find((b) => g < b.max).count++
  const median = gaps.length ? [...gaps].sort((a, b) => a - b)[Math.floor(gaps.length / 2)] : null

  const states = {}
  for (const e of inRange) states[e.state || '—'] = (states[e.state || '—'] || 0) + 1

  return {
    dev,
    address: parseAddress(dev),
    label: meta?.label ?? dev,
    type: meta?.type ?? '',
    node: meta?.node ?? null,
    site: meta?.site,
    history: { total: history.length, first: history[0]?.ts ?? null, last: history.at(-1)?.ts ?? null, days: perDay.size, perDay },
    count: inRange.length,
    days: new Set(inRange.map((e) => e.day)).size,
    states,
    intervals,
    medianGap: median,
    burst1h: maxInWindow(times, HOUR),
    neighbors: neighbors(all, inRange, dev, neighborWindow),
  }
}

/**
 * Outros dispositivos do mesmo nó com evento relevante a até `win` ms de cada
 * ocorrência deste. Num laço, quem sempre falha junto costuma estar no mesmo
 * trecho de fiação (ou é a causa de o trecho cair).
 */
export function neighbors(all, inRange, dev, win = 2 * MIN) {
  const node = parseAddress(dev)?.node ?? inRange[0]?.node
  if (node === undefined || node === null) return []
  const others = all.filter((e) => e.dev && e.dev !== dev && e.cat !== 'info' && (parseAddress(e.dev)?.node ?? e.node) === node).sort((a, b) => a.ts - b.ts)
  const mine = [...inRange].sort((a, b) => a.ts - b.ts)
  const hits = new Map() // dev → { together: ocorrências deste com o vizinho junto, events }
  let lo = 0
  for (const e of mine) {
    while (lo < others.length && others[lo].ts < e.ts - win) lo++
    const seen = new Set()
    for (let k = lo; k < others.length && others[k].ts <= e.ts + win; k++) {
      const o = others[k]
      let h = hits.get(o.dev)
      if (!h) hits.set(o.dev, (h = { dev: o.dev, label: o.label, type: o.type, together: 0, states: {} }))
      if (!h.type && o.type) Object.assign(h, { label: o.label, type: o.type })
      if (!seen.has(o.dev)) {
        h.together++
        seen.add(o.dev)
      }
      h.states[o.state] = (h.states[o.state] || 0) + 1
    }
  }
  return [...hits.values()].map((h) => ({ ...h, share: mine.length ? h.together / mine.length : 0 })).sort((a, b) => b.together - a.together).slice(0, 10)
}
