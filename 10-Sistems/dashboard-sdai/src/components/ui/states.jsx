import { RefreshCw, TriangleAlert } from 'lucide-react'

/** Esqueleto com a forma do conteúdo que vai chegar (evita salto de layout). */
export function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl border border-line bg-surface ${className}`} />
}

export function PageSkeleton({ label = 'Carregando' }) {
  return (
    <div role="status" aria-label={label} className="flex flex-col gap-4">
      <Skeleton className="h-16" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
      <Skeleton className="h-80" />
    </div>
  )
}

/** Estado vazio: explica o porquê e oferece o próximo passo. */
export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      {Icon && (
        <span className="mb-4 grid size-12 place-items-center rounded-xl bg-accent/10 text-accent">
          <Icon size={24} aria-hidden="true" />
        </span>
      )}
      <h2 className="text-base font-semibold">{title}</h2>
      {children && <div className="mt-1.5 max-w-md text-sm text-ink-2">{children}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({ error, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-xl border border-line bg-surface px-6 py-12 text-center">
      <span className="mb-3 grid size-12 place-items-center rounded-xl tint-fire">
        <TriangleAlert size={22} aria-hidden="true" />
      </span>
      <h2 className="text-base font-semibold">Não foi possível carregar</h2>
      <p className="mt-1 max-w-md text-sm text-ink-2">{error?.message ?? String(error)}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] font-medium hover:bg-surface-2">
          <RefreshCw size={14} aria-hidden="true" /> Tentar de novo
        </button>
      )}
    </div>
  )
}

/** Cabeçalho de página: título, contexto e ações principais à direita. */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {subtitle && <div className="mt-1 text-[13px] text-muted">{subtitle}</div>}
      </div>
      {actions && <div className="no-print flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
