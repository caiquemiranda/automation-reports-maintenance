import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { CATEGORIES } from '../lib/classify.js'
import { delta } from '../lib/aggregate.js'
import { fmtInt } from '../lib/format.js'
import { CAT_UI } from './ui/categoryUi.js'

const KPI_CATS = ['fire', 'device', 'supervisory', 'trouble']
const SUBTITLE = {
  fire: 'dispositivos em alarme',
  device: 'dispositivos com falha',
  supervisory: 'pontos supervisionados',
  trouble: 'pontos / nós afetados',
}

function Trend({ cur, prev }) {
  const d = delta(cur, prev)
  if (d === null) return <span className="text-xs text-muted">{prev === null || prev === undefined ? 'sem período anterior' : 'novo no período'}</span>
  const Icon = d > 0.5 ? ArrowUpRight : d < -0.5 ? ArrowDownRight : ArrowRight
  const word = d > 0.5 ? 'aumento' : d < -0.5 ? 'redução' : 'estável'
  return (
    <span className="inline-flex items-center gap-1 text-xs text-ink-2" title="Comparado ao período anterior de mesmo tamanho">
      <Icon size={13} aria-hidden="true" />
      <span className="tnum font-medium">{Math.abs(Math.round(d))}%</span>
      <span className="text-muted">{word} vs. anterior</span>
    </span>
  )
}

export default function KpiRow({ kpi, prev, activeCats, onToggleCat }) {
  return (
    <section aria-label="Indicadores" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {KPI_CATS.map((cat) => {
        const { Icon, tint, bar } = CAT_UI[cat]
        const on = activeCats.includes(cat)
        const c = kpi.byCat[cat]
        const devices = c.devices.size
        return (
          <button
            key={cat}
            type="button"
            aria-pressed={on}
            onClick={() => onToggleCat(cat)}
            className={`print-break group relative overflow-hidden rounded-xl border bg-surface p-4 text-left transition-shadow hover:shadow-md ${
              on ? 'border-ink shadow-md' : 'border-line'
            }`}
          >
            <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-ink-2">{CATEGORIES[cat].label}</p>
                <p className="tnum mt-1.5 text-[32px] font-semibold leading-none tracking-tight">{fmtInt(c.count)}</p>
              </div>
              <span className={`grid size-9 place-items-center rounded-lg ${tint}`}>
                <Icon size={18} aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-xs text-muted">
              <span className="tnum font-semibold text-ink-2">{fmtInt(devices)}</span> {SUBTITLE[cat]}
            </p>
            <div className="mt-1">
              <Trend cur={c.count} prev={prev ? prev.byCat[cat].count : null} />
            </div>
            <p className="no-print mt-2 text-[11px] text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {on ? 'Clique para remover o filtro' : 'Clique para filtrar só esta categoria'}
            </p>
          </button>
        )
      })}
    </section>
  )
}
