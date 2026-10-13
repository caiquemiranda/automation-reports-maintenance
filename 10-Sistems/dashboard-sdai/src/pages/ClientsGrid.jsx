import { ArrowRight, Clock, Inbox, MapPin } from 'lucide-react'
import Link from '../components/ui/Link.jsx'
import { ErrorState, PageHeader, Skeleton } from '../components/ui/states.jsx'
import { useClients } from '../hooks/clients.js'
import { daysSince, fmtAgo, fmtDate, fmtInt } from '../lib/format.js'

const STALE_DAYS = 35 // sem log novo há mais de ~1 mês: o dado já não representa o mês corrente

// "Vinci Airports" → VA; nome de uma palavra usa 2 letras (Bayer → BA, Bridgestone → BR), para não repetir
const initials = (name) => {
  const words = name.split(/\s+/)
  return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase()
}

function ClientCard({ client: c, section }) {
  const hasData = c.events > 0
  const stale = hasData && daysSince(c.lastTs) > STALE_DAYS
  // sem dados, o próximo passo útil é importar o primeiro log, em qualquer área
  const to = hasData || section.key === 'banco' ? `/${section.key}/${c.slug}` : `/banco/${c.slug}?upload=1`
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-xl border border-line bg-surface p-4 transition-shadow hover:border-accent/50 hover:shadow-md focus-visible:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-[15px] font-bold tracking-tight text-accent">
          {initials(c.name)}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-[15px] font-semibold">{c.name}</h2>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
            <MapPin size={12} aria-hidden="true" />
            {c.sites.length === 0 ? 'Nenhum painel cadastrado' : c.sites.length === 1 ? c.sites[0].name : `${c.sites.length} sites`}
          </p>
        </div>
      </div>

      <div className="mt-4 flex-1 text-[13px]">
        {hasData ? (
          <>
            <p>
              <span className="tnum text-lg font-semibold">{fmtInt(c.events)}</span> <span className="text-muted">eventos</span>
            </p>
            <p className="tnum text-xs text-muted">
              {fmtDate(c.firstTs)} → {fmtDate(c.lastTs)}
            </p>
            <p className={`mt-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs ${stale ? 'tint-device font-medium' : 'text-ink-2'}`}>
              <Clock size={12} aria-hidden="true" />
              {stale ? `Sem log novo ${fmtAgo(c.lastTs)}` : `Último evento ${fmtAgo(c.lastTs)}`}
            </p>
          </>
        ) : (
          <p className="flex items-center gap-1.5 text-muted">
            <Inbox size={15} aria-hidden="true" /> Nenhum log importado
          </p>
        )}
      </div>

      <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-accent">
        {hasData || section.key === 'banco' ? section.cta : 'Importar primeiro log'}
        <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

/** Primeiro nível de cada área: um card por cliente. */
export default function ClientsGrid({ section }) {
  const { clients, loading, error, reload } = useClients()
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={section.label} subtitle={section.intro} />
      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {loading && !clients.length
            ? [0, 1, 2, 3, 4].map((i) => (
                <li key={i}>
                  <Skeleton className="h-52" />
                </li>
              ))
            : clients.map((c) => (
                <li key={c.slug} className="grid">
                  <ClientCard client={c} section={section} />
                </li>
              ))}
        </ul>
      )}
    </div>
  )
}
