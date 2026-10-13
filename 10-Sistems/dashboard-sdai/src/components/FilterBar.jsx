import { useMemo, useState } from 'react'
import { CalendarDays, ChevronDown, EyeOff, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react'
import MultiSelect from './ui/MultiSelect.jsx'
import { CATEGORIES, CATEGORY_ORDER } from '../lib/classify.js'
import { EMPTY_FILTERS } from '../lib/aggregate.js'
import { fmtMonth, fmtNode } from '../lib/format.js'

const DAY = 86400000
const iso = (ts) => new Date(ts).toISOString().slice(0, 10)
const monthRange = (ym) => {
  const start = Date.parse(ym + '-01T00:00:00Z')
  const d = new Date(start)
  const end = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)
  return { from: iso(start), to: iso(end) }
}

const dateInput =
  'h-9 rounded-lg border border-line bg-surface px-2.5 text-[13px] tnum text-ink outline-none focus:border-accent'

export default function FilterBar({ filters, bounds, onChange, matched, siteNames = {} }) {
  const set = (patch) => onChange({ ...filters, ...patch })
  const [open, setOpen] = useState(false) // só afeta telas pequenas

  const month = useMemo(() => {
    const m = bounds.months.find((ym) => {
      const r = monthRange(ym)
      return r.from === filters.from && r.to === filters.to
    })
    return m ?? ''
  }, [bounds.months, filters.from, filters.to])

  const NO_TIME = { tFrom: '', tTo: '' }
  const lastDays = (n) => set({ from: iso(Date.parse(bounds.max + 'T00:00:00Z') - (n - 1) * DAY), to: bounds.max, ...NO_TIME })
  const allPeriod = !filters.from && !filters.to

  const nodeOptions = useMemo(() => bounds.nodes.map((n) => ({ value: n, label: fmtNode(n) })), [bounds.nodes])
  const stateOptions = useMemo(() => bounds.states.map((s) => ({ value: s, label: s })), [bounds.states])
  const catOptions = CATEGORY_ORDER.map((c) => ({ value: c, label: CATEGORIES[c].label }))
  const deviceOptions = useMemo(
    () =>
      bounds.devices
        .filter((d) => d.relevant > 0 || filters.devs.includes(d.dev))
        .map((d) => ({ value: d.dev, label: `${d.dev} · ${d.label}`, count: d.relevant })),
    [bounds.devices, filters.devs],
  )
  const siteOptions = useMemo(() => bounds.sites.map((id) => ({ value: id, label: siteNames[id] ?? `Site ${id}` })), [bounds.sites, siteNames])

  const dirty = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS)
  const activeCount = [filters.from || filters.to, filters.devs.length, filters.nodes.length, filters.sites.length, filters.cats.length, filters.states.length, filters.search].filter(Boolean).length

  return (
    <section aria-label="Filtros" className="no-print rounded-xl border border-line bg-surface px-4 py-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="filter-fields"
        onClick={() => setOpen((o) => !o)}
        className="mb-1 flex h-9 w-full items-center gap-2 rounded-lg border border-line px-3 text-[13px] font-medium sm:hidden"
      >
        <SlidersHorizontal size={15} aria-hidden="true" /> Filtros
        {activeCount > 0 && <span className="tnum rounded-full bg-accent px-1.5 text-[11px] text-accent-ink">{activeCount}</span>}
        <ChevronDown size={15} aria-hidden="true" className={`ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <div id="filter-fields" className={`${open ? 'flex' : 'hidden'} flex-wrap items-center gap-2 sm:flex`}>
        <CalendarDays size={16} className="text-muted" aria-hidden="true" />

        <label className="sr-only" htmlFor="f-month">Mês</label>
        <select
          id="f-month"
          value={month}
          onChange={(e) => (e.target.value ? set({ ...monthRange(e.target.value), ...NO_TIME }) : set({ from: '', to: '', ...NO_TIME }))}
          className="h-9 rounded-lg border border-line bg-surface px-2.5 text-[13px] outline-none focus:border-accent"
        >
          <option value="">{month || allPeriod ? 'Todo o período' : 'Período personalizado'}</option>
          {bounds.months.map((ym) => (
            <option key={ym} value={ym}>
              {fmtMonth(ym)}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="f-from">De</label>
        <input id="f-from" type="date" min={bounds.min} max={filters.to || bounds.max} value={filters.from} onChange={(e) => set({ from: e.target.value, ...(e.target.value ? {} : { tFrom: '' }) })} className={dateInput} />
        <input
          type="time"
          aria-label="Hora inicial"
          title={filters.from ? 'Hora inicial (vazio = 00:00)' : 'Escolha a data inicial para usar hora'}
          disabled={!filters.from}
          value={filters.tFrom}
          onChange={(e) => set({ tFrom: e.target.value })}
          className={`${dateInput} w-[92px] disabled:opacity-40`}
        />
        <span className="text-xs text-muted" aria-hidden="true">até</span>
        <label className="sr-only" htmlFor="f-to">Até</label>
        <input id="f-to" type="date" min={filters.from || bounds.min} max={bounds.max} value={filters.to} onChange={(e) => set({ to: e.target.value, ...(e.target.value ? {} : { tTo: '' }) })} className={dateInput} />
        <input
          type="time"
          aria-label="Hora final"
          title={filters.to ? 'Hora final (vazio = 23:59)' : 'Escolha a data final para usar hora'}
          disabled={!filters.to}
          value={filters.tTo}
          onChange={(e) => set({ tTo: e.target.value })}
          className={`${dateInput} w-[92px] disabled:opacity-40`}
        />

        <div role="group" aria-label="Atalhos de período" className="flex overflow-hidden rounded-lg border border-line text-xs font-medium">
          {[
            ['7 dias', () => lastDays(7)],
            ['30 dias', () => lastDays(30)],
            ['Tudo', () => set({ from: '', to: '', ...NO_TIME })],
          ].map(([label, fn]) => (
            <button key={label} type="button" onClick={fn} className="h-9 border-r border-line px-2.5 last:border-r-0 hover:bg-surface-2">
              {label}
            </button>
          ))}
        </div>

        <span className="mx-1 hidden h-6 w-px bg-line lg:block" aria-hidden="true" />

        {siteOptions.length > 1 && (
          <MultiSelect label="Site" options={siteOptions} value={filters.sites} onChange={(sites) => set({ sites })} width="w-56" />
        )}
        <MultiSelect label="Dispositivo" options={deviceOptions} value={filters.devs} onChange={(devs) => set({ devs })} searchable width="w-[26rem]" />
        <MultiSelect label="Nó" options={nodeOptions} value={filters.nodes} onChange={(nodes) => set({ nodes })} searchable width="w-56" />
        <MultiSelect label="Categoria" options={catOptions} value={filters.cats} onChange={(cats) => set({ cats })} width="w-60" />
        <MultiSelect label="Estado" options={stateOptions} value={filters.states} onChange={(states) => set({ states })} searchable width="w-64" />

        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Buscar descrição, endereço…"
            aria-label="Buscar nos eventos"
            className="h-9 w-56 rounded-lg border border-line bg-surface pl-8 pr-2 text-[13px] outline-none focus:border-accent"
          />
        </div>

        <button
          type="button"
          aria-pressed={filters.hideInfo}
          onClick={() => set({ hideInfo: !filters.hideInfo })}
          title="Reconhecimentos, resets, sirenes ON/OFF e pontos de utilidade"
          className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium ${
            filters.hideInfo ? 'border-accent bg-accent/10' : 'border-line hover:bg-surface-2'
          }`}
        >
          <EyeOff size={14} aria-hidden="true" /> Ocultar operacional
        </button>

        {dirty && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-accent hover:bg-accent/10"
          >
            <RotateCcw size={14} aria-hidden="true" /> Limpar filtros
          </button>
        )}
      </div>

      <p className="mt-2 flex items-center gap-2 text-xs text-muted" aria-live="polite">
        <strong className="tnum text-ink">{matched}</strong> eventos no recorte atual
        {filters.search && (
          <button type="button" onClick={() => set({ search: '' })} className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-ink-2 hover:bg-line">
            “{filters.search}” <X size={11} aria-label="remover busca" />
          </button>
        )}
      </p>
    </section>
  )
}
