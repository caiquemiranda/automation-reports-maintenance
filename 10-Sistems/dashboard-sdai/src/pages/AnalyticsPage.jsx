import { useMemo } from 'react'
import { ChartNoAxesColumn, Printer, Upload } from 'lucide-react'
import Dashboard from '../components/Dashboard.jsx'
import Link from '../components/ui/Link.jsx'
import { EmptyState, ErrorState, PageHeader, PageSkeleton } from '../components/ui/states.jsx'
import { btn } from '../components/ui/styles.js'
import { useClient } from '../hooks/clients.js'
import { useAsync } from '../hooks/useAsync.js'
import { fetchClientEvents } from '../lib/api.js'
import { GRANULARITIES, describeEvents } from '../lib/aggregate.js'
import AnalyticsTabs from '../components/AnalyticsTabs.jsx'
import { filtersFromQuery, filtersToQuery } from '../lib/filterParams.js'
import { fmtAgo, fmtDate, fmtInt } from '../lib/format.js'
import { navigate, qs, useLocation } from '../lib/router.js'

export function ClientSubtitle({ client, children }) {
  if (!client) return null
  const sites = client.sites.map((s) => s.source ?? s.name).join(' · ')
  return (
    <span className="flex flex-wrap gap-x-1.5">
      {sites && <span>{sites}</span>}
      {client.events > 0 && (
        <>
          <span aria-hidden="true">·</span>
          <span className="tnum">{fmtInt(client.events)} eventos</span>
          <span aria-hidden="true">·</span>
          <span className="tnum">
            {fmtDate(client.firstTs)} → {fmtDate(client.lastTs)} ({fmtAgo(client.lastTs)})
          </span>
        </>
      )}
      {children}
    </span>
  )
}

export default function AnalyticsPage({ slug }) {
  const { client, loading: clientsLoading } = useClient(slug)
  const { path, query } = useLocation()
  const { data: events, error, loading, reload } = useAsync(() => fetchClientEvents(slug), [slug])

  const queryKey = query.toString()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filters = useMemo(() => filtersFromQuery(query), [queryKey])
  const bounds = useMemo(() => (events?.length ? describeEvents(events) : null), [events])
  const siteNames = useMemo(() => Object.fromEntries((client?.sites ?? []).map((s) => [s.id, s.name])), [client])

  const escala = query.get('escala')
  const gran = GRANULARITIES.some((g) => g.key === escala) ? escala : 'auto'

  // Drill-down (KPI, mês, nó, barra do gráfico…) vira entrada no histórico: "voltar" desfaz.
  // Digitar na busca só substitui a entrada atual, para não encher o histórico.
  const setFilters = (f, { gran: nextGran = gran } = {}) => {
    const onlySearch = nextGran === gran && Object.keys(f).every((k) => k === 'search' || JSON.stringify(f[k]) === JSON.stringify(filters[k]))
    navigate(path + qs({ ...filtersToQuery(f), escala: nextGran === 'auto' ? '' : nextGran }), { replace: onlySearch, scroll: false })
  }

  const header = (
    <PageHeader
      title={client?.name ?? 'Cliente'}
      subtitle={<ClientSubtitle client={client} />}
      actions={
        events?.length > 0 && (
          <>
            <button type="button" onClick={() => window.print()} className={btn.secondary}>
              <Printer size={15} aria-hidden="true" /> Imprimir / PDF
            </button>
            <Link to={`/banco/${slug}?upload=1`} className={btn.secondary}>
              <Upload size={15} aria-hidden="true" /> Subir log
            </Link>
          </>
        )
      }
    />
  )

  if (!client && !clientsLoading) return <ErrorState error={new Error(`Cliente "${slug}" não encontrado.`)} />
  if (error) return <ErrorState error={error} onRetry={reload} />
  if (loading || !client) return <PageSkeleton label="Carregando eventos do cliente" />

  if (!events.length) {
    return (
      <div className="flex flex-col gap-5">
        {header}
        <EmptyState
          icon={ChartNoAxesColumn}
          title={`Ainda não há dados de ${client.name}`}
          action={
            <Link to={`/banco/${slug}?upload=1`} className={btn.primary}>
              <Upload size={15} aria-hidden="true" /> Importar o primeiro log
            </Link>
          }
        >
          O painel é montado a partir do histórico do TSW. Importe o <strong>Entire Historical Log Report</strong> do painel deste cliente.
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {header}
      <AnalyticsTabs slug={slug} current="geral" />
      <Dashboard events={events} bounds={bounds} filters={filters} onFiltersChange={setFilters} siteNames={siteNames} exportName={`sdai-${slug}`} gran={gran} />
    </div>
  )
}
