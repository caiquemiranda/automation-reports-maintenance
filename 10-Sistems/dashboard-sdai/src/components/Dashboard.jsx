import { lazy, Suspense, useMemo } from 'react'
import FilterBar from './FilterBar.jsx'
import KpiRow from './KpiRow.jsx'
import OffendersPanel from './OffendersPanel.jsx'
import EventTable from './EventTable.jsx'
import DevicePanel from './DevicePanel.jsx'
import DeviceCompare from './DeviceCompare.jsx'
import { filterEvents, filtersForRange, previousRange, summarize } from '../lib/aggregate.js'

const ChartsSection = lazy(() => import('./ChartsSection.jsx'))

function ChartsFallback() {
  return <div role="status" aria-label="Carregando gráficos" className="h-80 animate-pulse rounded-xl border border-line bg-surface" />
}

const monthOf = (day) => {
  const [y, m] = day.split('-').map(Number)
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return { from: `${day.slice(0, 7)}-01`, to: `${day.slice(0, 7)}-${String(last).padStart(2, '0')}` }
}

/**
 * Painel analítico de um cliente. Os filtros são controlados de fora (a página
 * os guarda na URL), então todo recorte pode ser compartilhado como link.
 * `onFiltersChange(filtros, { gran })`: gran opcional troca a escala da linha do tempo junto.
 */
export default function Dashboard({ events, bounds, filters, onFiltersChange, siteNames, exportName, gran = 'auto' }) {
  const setFilters = (fn, opts) => onFiltersChange(typeof fn === 'function' ? fn(filters) : fn, opts)

  const list = useMemo(() => filterEvents(events, filters), [events, filters])
  const summary = useMemo(() => summarize(list, filters, bounds, gran), [list, filters, bounds, gran])

  // Os cartões de KPI funcionam como seletor de categoria, então ignoram o filtro de categoria.
  const kpiFilters = useMemo(() => ({ ...filters, cats: [] }), [filters])
  const kpi = useMemo(() => summarize(filterEvents(events, kpiFilters), kpiFilters, bounds, 'auto', { withSeries: false }), [events, kpiFilters, bounds])
  const prev = useMemo(() => {
    const range = previousRange(filters, bounds)
    return range ? summarize(filterEvents(events, kpiFilters, range), kpiFilters, bounds, 'auto', { withSeries: false }) : null
  }, [events, filters, kpiFilters, bounds])

  const labels = useMemo(() => Object.fromEntries(bounds.devices.map((d) => [d.dev, d.label])), [bounds.devices])
  const isDevice = (v) => v in labels

  const toggleCat = (cat) => setFilters((f) => ({ ...f, cats: f.cats.length === 1 && f.cats[0] === cat ? [] : [cat] }))
  const pickNode = (node) => setFilters((f) => ({ ...f, nodes: [node] }))
  const pickDevice = (value) => {
    if (isDevice(value)) {
      setFilters((f) => ({ ...f, devs: [value] }))
      document.getElementById('dashboard-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      // pontos de sistema (sem endereço de dispositivo): continua filtrando o log pelo texto
      setFilters((f) => ({ ...f, search: value }))
      document.getElementById('log')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  const pickDay = (day) => setFilters((f) => ({ ...f, from: day, to: day, tFrom: '', tTo: '' }), { gran: 'auto' })
  const pickRange = (fromTs, toTs) => setFilters((f) => ({ ...f, ...filtersForRange(fromTs, toTs) }), { gran: 'auto' })

  // Afastar: janela de horas → dia inteiro → mês → todo o período
  const hasPeriod = filters.from || filters.to
  const zoomOut = () =>
    setFilters(
      (f) => {
        if (f.tFrom || f.tTo) return { ...f, tFrom: '', tTo: '' }
        if (f.from && f.from === f.to) return { ...f, ...monthOf(f.from) }
        return { ...f, from: '', to: '' }
      },
      { gran: 'auto' },
    )

  const single = filters.devs.length === 1 ? filters.devs[0] : null

  return (
    <div id="dashboard-top" className="flex scroll-mt-20 flex-col gap-4">
      <FilterBar filters={filters} bounds={bounds} onChange={setFilters} matched={list.length} siteNames={siteNames} />

      {single && (
        <DevicePanel
          all={events}
          inRange={list}
          dev={single}
          selectedDay={filters.from && filters.from === filters.to ? filters.from : null}
          onClear={() => setFilters((f) => ({ ...f, devs: [] }))}
          onPickDay={pickDay}
          onAddDevice={(d) => setFilters((f) => ({ ...f, devs: [...f.devs, d] }))}
        />
      )}
      {filters.devs.length > 1 && (
        <DeviceCompare list={list} devs={filters.devs} filters={filters} labels={labels} onRemove={(d) => setFilters((f) => ({ ...f, devs: f.devs.filter((x) => x !== d) }))} />
      )}

      <KpiRow kpi={kpi} prev={prev} activeCats={filters.cats} onToggleCat={toggleCat} />

      <Suspense fallback={<ChartsFallback />}>
        <ChartsSection
          summary={summary}
          onPickNode={pickNode}
          gran={gran}
          onGranChange={(g) => setFilters(filters, { gran: g })}
          onPickRange={pickRange}
          onZoomOut={hasPeriod ? zoomOut : null}
        />
      </Suspense>

      <OffendersPanel offenders={summary.offenders} onPickDevice={pickDevice} />
      <div id="log" className="scroll-mt-20">
        <EventTable events={list} fileName={exportName} onPickDevice={pickDevice} />
      </div>
    </div>
  )
}
