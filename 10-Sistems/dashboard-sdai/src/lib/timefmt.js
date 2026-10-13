// Formatação de instantes e eixos de tempo (relógio de parede do painel, sempre UTC).

const MIN = 60000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

const p2 = (n) => String(n).padStart(2, '0')
const parts = (ts) => {
  const d = new Date(ts)
  return { y: d.getUTCFullYear(), mo: d.getUTCMonth() + 1, d: d.getUTCDate(), h: d.getUTCHours(), mi: d.getUTCMinutes(), s: d.getUTCSeconds() }
}
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export const hhmm = (ts) => {
  const t = parts(ts)
  return `${p2(t.h)}:${p2(t.mi)}`
}
export const hhmmss = (ts) => {
  const t = parts(ts)
  return `${p2(t.h)}:${p2(t.mi)}:${p2(t.s)}`
}
export const ddmm = (ts) => {
  const t = parts(ts)
  return `${p2(t.d)}/${p2(t.mo)}`
}
export const ddmmyyyy = (ts) => {
  const t = parts(ts)
  return `${p2(t.d)}/${p2(t.mo)}/${t.y}`
}
export const dShortMonth = (ts) => {
  const t = parts(ts)
  return `${p2(t.d)} ${MONTHS[t.mo - 1]}`
}

/** Duração legível: "45 s", "12 min", "3 h 20 min", "2 dias". */
export function fmtDuration(ms) {
  if (ms === null || ms === undefined) return '—'
  if (ms < MIN) return `${Math.round(ms / 1000)} s`
  if (ms < HOUR) return `${Math.round(ms / MIN)} min`
  if (ms < DAY) {
    const h = Math.floor(ms / HOUR)
    const m = Math.round((ms % HOUR) / MIN)
    return m ? `${h} h ${m} min` : `${h} h`
  }
  const d = Math.round(ms / DAY)
  return `${d} dia${d > 1 ? 's' : ''}`
}

/** Rótulo do eixo para um balde da linha do tempo, conforme a escala e a extensão total. */
export function bucketTick(ts, gran, spanMs) {
  if (gran.size >= DAY) return dShortMonth(ts)
  return spanMs > DAY ? `${ddmm(ts)} ${hhmm(ts)}` : hhmm(ts)
}

/** Rótulo completo de um balde (tooltip/tabela). */
export function bucketLabel(ts, gran) {
  const end = ts + gran.size - 1
  if (gran.key === 'semana') return `Semana de ${ddmmyyyy(ts)}`
  if (gran.key === 'dia') return ddmmyyyy(ts)
  return `${ddmmyyyy(ts)} · ${hhmm(ts)}–${hhmm(end)}`
}

/** Marcas "redondas" para um eixo de tempo contínuo entre from e to (~6–8 marcas). */
const STEPS = [MIN, 5 * MIN, 15 * MIN, 30 * MIN, HOUR, 3 * HOUR, 6 * HOUR, 12 * HOUR, DAY, 2 * DAY, 7 * DAY, 14 * DAY, 30 * DAY]
export function timeTicks(from, to, target = 7) {
  const span = to - from
  const step = STEPS.find((s) => span / s <= target) ?? STEPS.at(-1)
  const ticks = []
  for (let t = Math.ceil(from / step) * step; t <= to; t += step) ticks.push(t)
  const fmt = step >= DAY ? ddmm : span > DAY ? (t) => `${ddmm(t)} ${hhmm(t)}` : hhmm
  return { ticks, fmt }
}
