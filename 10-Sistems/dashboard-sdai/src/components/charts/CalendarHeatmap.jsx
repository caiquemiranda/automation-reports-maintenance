import { useMemo } from 'react'
import { fmtInt } from '../../lib/format.js'
import { ddmmyyyy } from '../../lib/timefmt.js'

const DAY = 86400000
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const DOW = ['Seg', '', 'Qua', '', 'Sex', '', '']
const toTs = (day) => Date.parse(day + 'T00:00:00Z')
const dayOf = (ts) => new Date(ts).toISOString().slice(0, 10)

/**
 * Calendário de ocorrências (uma célula por dia, colunas = semanas). Mostra de
 * relance se a falha é pontual, recorrente ou se piorou com o tempo.
 * Clique num dia para abrir a linha do tempo minuto a minuto.
 */
export function CalendarHeatmap({ perDay, from, to, selected, onPick }) {
  const { weeks, months, max } = useMemo(() => {
    const first = toTs(from)
    const end = toTs(to)
    const start = first - ((new Date(first).getUTCDay() + 6) % 7) * DAY // segunda da 1ª semana
    const weeks = []
    const months = new Map() // coluna → mês (rótulo onde o mês começa)
    let max = 1
    for (let w = start; w <= end; w += 7 * DAY) {
      const col = []
      for (let d = 0; d < 7; d++) {
        const ts = w + d * DAY
        const inside = ts >= first && ts <= end
        const n = inside ? perDay.get(dayOf(ts)) ?? 0 : null
        if (n > max) max = n
        if (inside && (new Date(ts).getUTCDate() === 1 || weeks.length === 0) && !months.has(weeks.length)) months.set(weeks.length, new Date(ts).getUTCMonth())
        col.push({ day: dayOf(ts), ts, n })
      }
      weeks.push(col)
    }
    return { weeks, months, max }
  }, [perDay, from, to])

  const color = (n) => (n ? `color-mix(in oklab, var(--c-trouble) ${12 + Math.sqrt(n / max) * 88}%, var(--surface))` : 'var(--surface-2)')

  return (
    <div className="relative overflow-x-auto pb-1">
      <div className="inline-grid gap-[3px]" style={{ gridTemplateColumns: `28px repeat(${weeks.length}, 13px)`, gridTemplateRows: '14px repeat(7, 13px)' }}>
        <span />
        {weeks.map((_, i) => (
          <span key={i} className="relative text-[10px] text-muted">
            {months.has(i) && <span className="absolute left-0 top-0 whitespace-nowrap">{MONTHS[months.get(i)]}</span>}
          </span>
        ))}
        {DOW.map((label, d) => (
          <CalendarRow key={d} label={label} d={d} weeks={weeks} color={color} selected={selected} onPick={onPick} />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
        menos
        {[0, 0.15, 0.4, 0.7, 1].map((p) => (
          <span key={p} className="inline-block size-3 rounded-[3px]" style={{ background: p ? `color-mix(in oklab, var(--c-trouble) ${12 + Math.sqrt(p) * 88}%, var(--surface))` : 'var(--surface-2)' }} />
        ))}
        mais · pico de {fmtInt(max)} em um dia
      </div>
    </div>
  )
}

/** Uma linha do calendário (um dia da semana ao longo de todas as semanas). */
function CalendarRow({ label, d, weeks, color, selected, onPick }) {
  return (
    <>
      <span className="pr-1 text-right text-[10px] leading-[13px] text-muted">{label}</span>
      {weeks.map((col) => {
        const c = col[d]
        if (c.n === null) return <span key={c.day} />
        const title = `${ddmmyyyy(c.ts)} — ${fmtInt(c.n)} ocorrência${c.n === 1 ? '' : 's'}`
        const style = { background: color(c.n) }
        const ring = c.day === selected ? 'outline outline-2 outline-offset-1 outline-ink' : ''
        return c.n ? (
          <button key={c.day} type="button" title={title} aria-label={title} onClick={() => onPick(c.day)} className={`size-[13px] rounded-[3px] hover:outline hover:outline-1 hover:outline-ink ${ring}`} style={style} />
        ) : (
          <span key={c.day} title={title} className={`size-[13px] rounded-[3px] ${ring}`} style={style} />
        )
      })}
    </>
  )
}
