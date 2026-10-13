import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { Card } from './ui/Card.jsx'
import { CategoryBadge } from './ui/category.jsx'
import { eventsToCsv } from '../lib/csv.js'
import { fmtDateTime, fmtInt } from '../lib/format.js'

const SIZES = [50, 100, 250]

const COLS = [
  { key: 'ts', label: 'Data / hora', cls: 'pl-5 w-36' },
  { key: 'node', label: 'Nó', cls: 'w-14 text-center' },
  { key: 'cat', label: 'Categoria', cls: 'w-40' },
  { key: 'state', label: 'Estado', cls: 'w-44' },
  { key: 'dev', label: 'Ponto', cls: 'w-32' },
  { key: 'desc', label: 'Descrição', cls: 'pr-5' },
]

const cmp = (key) => (a, b) => {
  const x = a[key] ?? -1
  const y = b[key] ?? -1
  return x < y ? -1 : x > y ? 1 : a.id - b.id
}

export default function EventTable({ events, fileName, onPickDevice }) {
  const [sort, setSort] = useState({ key: 'ts', dir: 'desc' })
  const [size, setSize] = useState(100)
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    const out = [...events].sort(cmp(sort.key))
    return sort.dir === 'desc' ? out.reverse() : out
  }, [events, sort])

  const pages = Math.max(1, Math.ceil(sorted.length / size))
  const cur = Math.min(page, pages - 1)
  const slice = sorted.slice(cur * size, cur * size + size)

  const toggleSort = (key) => {
    setPage(0)
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'ts' ? 'desc' : 'asc' }))
  }

  const download = () => {
    const url = URL.createObjectURL(new Blob([eventsToCsv(sorted)], { type: 'text/csv;charset=utf-8' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `${fileName.replace(/\.\w+$/, '').replace(/\s+/g, '-')}-filtrado.csv` })
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card
      title="Log de eventos"
      subtitle={`${fmtInt(sorted.length)} eventos no recorte`}
      actions={
        <button type="button" onClick={download} disabled={!sorted.length} className="no-print inline-flex h-8 items-center gap-1.5 rounded-md border border-line px-2.5 text-[13px] font-medium hover:bg-surface-2 disabled:opacity-40">
          <Download size={14} aria-hidden="true" /> Exportar CSV
        </button>
      }
    >
      <div className="mt-3 max-h-[560px] overflow-auto border-t border-line print:max-h-none">
        <table className="w-full min-w-[900px] text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-surface-2 text-xs text-muted shadow-[0_1px_0_var(--line)]">
            <tr>
              {COLS.map((c) => {
                const on = sort.key === c.key
                return (
                  <th key={c.key} scope="col" aria-sort={on ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={`py-2 pr-3 font-medium ${c.cls}`}>
                    <button type="button" onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-ink">
                      {c.label}
                      {on && (sort.dir === 'asc' ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />)}
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {slice.map((e) => (
              <tr key={e.id} className="hover:bg-surface-2">
                <td className="tnum whitespace-nowrap py-1.5 pl-5 pr-3 text-xs text-ink-2">{fmtDateTime(e.ts)}</td>
                <td className="tnum py-1.5 pr-3 text-center text-xs font-semibold">{e.node ?? '—'}</td>
                <td className="py-1.5 pr-3"><CategoryBadge cat={e.cat} compact /></td>
                <td className="whitespace-nowrap py-1.5 pr-3 text-xs font-medium">{e.state || <span className="text-muted">—</span>}</td>
                <td className="whitespace-nowrap py-1.5 pr-3 font-mono text-xs text-ink-2">
                  {e.dev && onPickDevice ? (
                    <button type="button" onClick={() => onPickDevice(e.dev)} title="Analisar este dispositivo" className="hover:text-accent hover:underline">
                      {e.dev}
                    </button>
                  ) : (
                    e.dev || '—'
                  )}
                </td>
                <td className="py-1.5 pr-5">
                  <span title={e.detail || e.desc}>{e.label}</span>
                  {e.type && <span className="ml-2 text-[11px] text-muted">{e.type}</span>}
                  {e.detail && <span className="ml-2 text-[11px] text-muted">· {e.detail}</span>}
                </td>
              </tr>
            ))}
            {!slice.length && (
              <tr>
                <td colSpan={COLS.length} className="py-12 text-center text-sm text-muted">
                  Nenhum evento corresponde aos filtros. Tente ampliar o período ou limpar os filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="no-print flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-2.5 text-xs text-ink-2">
        <label className="flex items-center gap-2">
          Linhas por página
          <select value={size} onChange={(e) => { setSize(+e.target.value); setPage(0) }} className="h-7 rounded-md border border-line bg-surface px-1.5">
            {SIZES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <div className="flex items-center gap-2">
          <span className="tnum">
            {fmtInt(sorted.length ? cur * size + 1 : 0)}–{fmtInt(Math.min(sorted.length, cur * size + size))} de {fmtInt(sorted.length)}
          </span>
          <button type="button" aria-label="Página anterior" disabled={cur === 0} onClick={() => setPage(cur - 1)} className="grid size-7 place-items-center rounded-md border border-line hover:bg-surface-2 disabled:opacity-40">
            <ChevronLeft size={15} />
          </button>
          <button type="button" aria-label="Próxima página" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)} className="grid size-7 place-items-center rounded-md border border-line hover:bg-surface-2 disabled:opacity-40">
            <ChevronRight size={15} />
          </button>
        </div>
      </footer>
    </Card>
  )
}
