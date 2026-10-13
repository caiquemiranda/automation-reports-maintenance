import { useMemo } from 'react'
import { X } from 'lucide-react'
import { Card, Legend } from './ui/Card.jsx'
import { EventStrip } from './charts/EventStrip.jsx'
import { CAT_UI, STACK_ORDER } from './ui/categoryUi.js'
import { CATEGORIES } from '../lib/classify.js'
import { rangeOf } from '../lib/aggregate.js'

/**
 * Vários dispositivos lado a lado na mesma linha do tempo: mostra quem começou a
 * falhar primeiro e se as falhas andam juntas (mesmo trecho de laço).
 */
export default function DeviceCompare({ list, devs, filters, labels, onRemove }) {
  const { from, to, rows, events } = useMemo(() => {
    const r = rangeOf(filters)
    let min = Infinity
    let max = -Infinity
    for (const e of list) {
      if (e.ts < min) min = e.ts
      if (e.ts > max) max = e.ts
    }
    const pad = Math.max(60000, (max - min) * 0.02)
    return {
      from: Number.isFinite(r.from) ? r.from : min - pad,
      to: Number.isFinite(r.to) ? r.to : max + pad,
      rows: devs.map((d) => ({ key: d, label: d, sub: labels[d] })),
      events: list.map((e) => ({ row: e.dev, ts: e.ts, cat: e.cat, state: e.state })),
    }
  }, [list, devs, filters, labels])

  const cats = STACK_ORDER.filter((c) => list.some((e) => e.cat === c))
  return (
    <Card title="Comparação de dispositivos" subtitle="Cada traço é uma ocorrência. Passe o mouse para ver data, hora e estado.">
      <div className="px-5 pb-4 pt-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Legend items={cats.map((c) => ({ key: c, label: CATEGORIES[c].label, color: CAT_UI[c].css }))} />
          <div className="no-print flex flex-wrap gap-1">
            {devs.map((d) => (
              <button key={d} type="button" onClick={() => onRemove(d)} className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[11px] hover:bg-line" aria-label={`Remover ${d} da comparação`}>
                {d} <X size={11} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        {list.length ? (
          <EventStrip rows={rows} events={events} from={from} to={to} />
        ) : (
          <p className="py-8 text-center text-sm text-muted">Nenhuma ocorrência destes dispositivos no recorte.</p>
        )}
      </div>
    </Card>
  )
}
