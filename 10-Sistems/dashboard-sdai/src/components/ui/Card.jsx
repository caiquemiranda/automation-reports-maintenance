import { useState } from 'react'
import { Table2, BarChart3 } from 'lucide-react'

export function Card({ title, subtitle, actions, children, className = '' }) {
  return (
    <section className={`print-break min-w-0 rounded-xl border border-line bg-surface ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-2 px-5 pt-4">
          <div>
            <h2 className="text-sm font-semibold text-ink">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  )
}

/** Cartão de gráfico com alternância gráfico ⇄ tabela (equivalente acessível). */
export function ChartCard({ title, subtitle, legend, chart, table, toolbar, className = '' }) {
  const [view, setView] = useState('chart')
  return (
    <Card
      title={title}
      subtitle={subtitle}
      className={className}
      actions={
        (table || toolbar) && (
          <div className="flex flex-wrap items-center gap-2">
            {toolbar}
            {table && (
          <button
            type="button"
            onClick={() => setView((v) => (v === 'chart' ? 'table' : 'chart'))}
            className="no-print inline-flex h-7 items-center gap-1.5 rounded-md border border-line px-2 text-xs font-medium text-ink-2 hover:bg-surface-2"
          >
            {view === 'chart' ? <Table2 size={13} aria-hidden="true" /> : <BarChart3 size={13} aria-hidden="true" />}
            {view === 'chart' ? 'Ver tabela' : 'Ver gráfico'}
          </button>
            )}
          </div>
        )
      }
    >
      {legend && view === 'chart' && <div className="px-5 pt-3">{legend}</div>}
      <div className="px-3 pb-4 pt-2 sm:px-5">{view === 'chart' ? chart : table}</div>
    </Card>
  )
}

export function Legend({ items }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
      {items.map((i) => (
        <li key={i.key} className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block size-2.5 rounded-[3px]" style={{ background: i.color }} />
          {i.label}
        </li>
      ))}
    </ul>
  )
}
