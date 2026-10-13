import { DOW_LABELS, fmtInt } from '../../lib/format.js'

const HOURS = Array.from({ length: 24 }, (_, h) => h)
const ORDER = [1, 2, 3, 4, 5, 6, 0] // segunda → domingo

/** Mapa de calor dia da semana × hora: mostra quando os eventos concentram. */
export function Heatmap({ heat, max }) {
  const total = heat.flat().reduce((a, b) => a + b, 0)
  return (
    <div className="relative overflow-x-auto">
      <div
        role="table"
        aria-label="Eventos por dia da semana e hora do dia"
        className="grid min-w-[560px] gap-[3px]"
        style={{ gridTemplateColumns: '34px repeat(24, minmax(0, 1fr))' }}
      >
        <div role="row" className="contents">
          <span role="columnheader"><span className="sr-only">Dia</span></span>
          {HOURS.map((h) => (
            <span key={h} role="columnheader" className="tnum text-center text-[10px] text-muted">
              {h % 3 === 0 ? String(h).padStart(2, '0') : ''}
            </span>
          ))}
        </div>
        {ORDER.map((d) => (
          <div key={d} role="row" className="contents">
            <span role="rowheader" className="self-center text-[11px] text-ink-2">{DOW_LABELS[d]}</span>
            {HOURS.map((h) => {
              const v = heat[d][h]
              const pct = v ? 12 + Math.sqrt(v / max) * 88 : 0
              return (
                <span
                  key={h}
                  role="cell"
                  title={`${DOW_LABELS[d]} ${String(h).padStart(2, '0')}h — ${fmtInt(v)} evento${v === 1 ? '' : 's'}`}
                  aria-label={`${DOW_LABELS[d]} ${h}h: ${v}`}
                  className="h-7 rounded-[3px] border border-line/60"
                  style={{ background: v ? `color-mix(in oklab, var(--c-trouble) ${pct}%, var(--surface))` : 'var(--surface-2)' }}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
        <span>Horário local do painel · {fmtInt(total)} eventos</span>
        <span className="flex items-center gap-1.5">
          menos
          {[0, 25, 50, 75, 100].map((p) => (
            <span key={p} className="inline-block h-3 w-5 rounded-[3px] border border-line/60" style={{ background: `color-mix(in oklab, var(--c-trouble) ${p || 8}%, var(--surface))` }} />
          ))}
          mais
        </span>
      </div>
    </div>
  )
}
