const nf = new Intl.NumberFormat('pt-BR')
export const fmtInt = (n) => nf.format(n)

const dtf = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' })
const df = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
const dfShort = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' })
const mf = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' })

export const fmtDateTime = (ts) => dtf.format(ts).replace(',', '')
export const fmtDate = (ts) => df.format(ts)
export const fmtDayShort = (day) => dfShort.format(Date.parse(day + 'T00:00:00Z')).replace('.', '')
export const fmtMonth = (ym) => {
  const s = mf.format(Date.parse(ym + '-01T00:00:00Z'))
  return s.charAt(0).toUpperCase() + s.slice(1)
}
export const fmtNode = (n) => (n === -1 || n === null ? 'Sem nó' : `Nó ${n}`)
export const DOW_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

/** Momento real (ex.: data da importação), no fuso de quem está vendo. */
const localDtf = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
export const fmtLocal = (iso) => localDtf.format(new Date(iso))

/** "hoje", "ontem", "há 4 dias", "há 3 meses" — usado para indicar dados desatualizados. */
export function fmtAgo(ts, now = Date.now()) {
  const days = Math.floor((now - ts) / 86400000)
  if (days <= 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 60) return `há ${days} dias`
  return `há ${Math.round(days / 30)} meses`
}
export const daysSince = (ts, now = Date.now()) => Math.floor((now - ts) / 86400000)
