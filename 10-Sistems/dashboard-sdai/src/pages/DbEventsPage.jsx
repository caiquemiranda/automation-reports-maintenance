import { Fragment, useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Inbox, Search } from 'lucide-react'
import { CategoryBadge } from '../components/ui/category.jsx'
import { EmptyState, ErrorState, PageHeader } from '../components/ui/states.jsx'
import { useClient } from '../hooks/clients.js'
import { useAsync } from '../hooks/useAsync.js'
import { fetchEventsPage } from '../lib/api.js'
import { enrich } from '../lib/parser.js'
import { fmtDateTime, fmtInt } from '../lib/format.js'
import { navigate, qs, useLocation } from '../lib/router.js'

const SIZES = [50, 100, 200]

/**
 * Navegador do banco: todos os registros de um cliente, paginados no servidor.
 * Busca, página e ordem ficam na URL. Cada linha abre o bloco original do log.
 */
export default function DbEventsPage({ slug }) {
  const { client } = useClient(slug)
  const { path, query } = useLocation()
  const params = {
    q: query.get('q') ?? '',
    page: Math.max(0, Number(query.get('pagina') ?? 1) - 1) || 0,
    size: SIZES.includes(Number(query.get('n'))) ? Number(query.get('n')) : 50,
    order: query.get('ordem') === 'asc' ? 'asc' : 'desc',
    site: query.get('site') ?? '',
  }
  const set = (patch) => {
    const p = { ...params, ...patch }
    navigate(path + qs({ q: p.q, pagina: p.page ? p.page + 1 : '', n: p.size === 50 ? '' : p.size, ordem: p.order === 'asc' ? 'asc' : '', site: p.site }), { replace: true })
  }

  // busca com atraso curto: não dispara uma consulta por tecla
  const [text, setText] = useState(params.q)
  useEffect(() => {
    if (text === params.q) return
    const t = setTimeout(() => set({ q: text, page: 0 }), 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const { data, error, loading, reload } = useAsync(() => fetchEventsPage(slug, params), [slug, params.q, params.page, params.size, params.order, params.site])
  const [open, setOpen] = useState(null)
  const multiSite = (client?.sites.length ?? 0) > 1

  const total = data?.total ?? 0
  const pages = Math.max(1, Math.ceil(total / params.size))
  const from = total ? params.page * params.size + 1 : 0
  const to = Math.min(total, (params.page + 1) * params.size)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={`Registros · ${client?.name ?? slug}`} subtitle="Todos os eventos armazenados, como vieram do TSW (sem filtro de análise). Clique em uma linha para ver o bloco original." />

      <section className="rounded-xl border border-line bg-surface">
        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Buscar descrição, tipo, estado ou seq…"
              aria-label="Buscar registros"
              className="h-9 w-full rounded-lg border border-line bg-surface pl-8 pr-2 text-[13px] outline-none focus:border-accent"
            />
          </div>
          {multiSite && (
            <select value={params.site} onChange={(e) => set({ site: e.target.value, page: 0 })} aria-label="Site" className="h-9 rounded-lg border border-line bg-surface px-2 text-[13px]">
              <option value="">Todos os sites</option>
              {client.sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
          <p className="ml-auto text-xs text-muted" aria-live="polite">
            {loading && !data ? 'Carregando…' : `${fmtInt(total)} registro${total === 1 ? '' : 's'}`}
          </p>
        </div>

        {error ? (
          <div className="p-4">
            <ErrorState error={error} onRetry={reload} />
          </div>
        ) : data && !data.rows.length ? (
          <div className="p-4">
            <EmptyState icon={Inbox} title="Nenhum registro encontrado">
              {params.q ? `Nada corresponde a “${params.q}”.` : 'Este cliente ainda não tem registros.'}
            </EmptyState>
          </div>
        ) : (
          <div className={`overflow-x-auto border-t border-line transition-opacity ${loading ? 'opacity-60' : ''}`}>
            <table className="w-full min-w-[860px] text-left text-[13px]">
              <thead className="bg-surface-2 text-xs text-muted">
                <tr>
                  <th scope="col" className="py-2 pl-4 pr-3 font-medium">Seq</th>
                  <th scope="col" aria-sort={params.order === 'asc' ? 'ascending' : 'descending'} className="py-2 pr-3 font-medium">
                    <button type="button" onClick={() => set({ order: params.order === 'asc' ? 'desc' : 'asc', page: 0 })} className="inline-flex items-center gap-1 hover:text-ink">
                      Data / hora {params.order === 'asc' ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />}
                    </button>
                  </th>
                  {multiSite && <th scope="col" className="py-2 pr-3 font-medium">Site</th>}
                  <th scope="col" className="py-2 pr-3 text-center font-medium">Nó</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Ponto</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Descrição</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Tipo</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Estado</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Categoria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {(data?.rows ?? []).map((r) => {
                  const e = enrich(r)
                  const expanded = open === r.id
                  return (
                    <Fragment key={r.id}>
                      <tr className={`cursor-pointer hover:bg-surface-2 ${expanded ? 'bg-surface-2' : ''}`} onClick={() => setOpen(expanded ? null : r.id)}>
                        <td className="py-1.5 pl-4 pr-3">
                          <button
                            type="button"
                            aria-expanded={expanded}
                            aria-label={`Bloco original do evento ${r.seq}`}
                            onClick={(ev) => {
                              ev.stopPropagation()
                              setOpen(expanded ? null : r.id)
                            }}
                            className="tnum inline-flex items-center gap-1 text-xs text-muted hover:text-ink"
                          >
                            <ChevronRight size={12} aria-hidden="true" className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
                            {r.seq}
                          </button>
                        </td>
                        <td className="tnum whitespace-nowrap py-1.5 pr-3 text-xs text-ink-2">{fmtDateTime(r.ts)}</td>
                        {multiSite && <td className="whitespace-nowrap py-1.5 pr-3 text-xs">{r.siteName}</td>}
                        <td className="tnum py-1.5 pr-3 text-center text-xs font-semibold">{r.node ?? '—'}</td>
                        <td className="whitespace-nowrap py-1.5 pr-3 font-mono text-xs text-ink-2">{e.dev || '—'}</td>
                        <td className="max-w-sm py-1.5 pr-3">
                          <span className="line-clamp-1" title={r.desc}>
                            {e.label}
                          </span>
                        </td>
                        <td className="whitespace-nowrap py-1.5 pr-3 text-xs text-muted">{r.type || '—'}</td>
                        <td className="whitespace-nowrap py-1.5 pr-3 text-xs font-medium">{r.state || '—'}</td>
                        <td className="py-1.5 pr-4">
                          <CategoryBadge cat={e.cat} compact />
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="bg-surface-2">
                          <td colSpan={multiSite ? 9 : 8} className="px-4 pb-3">
                            <pre className="overflow-x-auto rounded-lg border border-line bg-surface p-3 font-mono text-xs leading-relaxed">{r.raw}</pre>
                            <p className="mt-1.5 text-[11px] text-muted">
                              Volume {r.vol ?? 'desconhecido'} · importação #{r.importId}
                              {r.detail && ` · detalhe: ${r.detail}`}
                            </p>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-xs text-ink-2">
          <label className="flex items-center gap-2">
            Por página
            <select value={params.size} onChange={(e) => set({ size: Number(e.target.value), page: 0 })} className="h-7 rounded-md border border-line bg-surface px-1.5">
              {SIZES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-2">
            <span className="tnum">
              {fmtInt(from)}–{fmtInt(to)} de {fmtInt(total)}
            </span>
            <button type="button" aria-label="Página anterior" disabled={params.page === 0} onClick={() => set({ page: params.page - 1 })} className="grid size-7 place-items-center rounded-md border border-line hover:bg-surface-2 disabled:opacity-40">
              <ChevronLeft size={15} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Próxima página" disabled={params.page >= pages - 1} onClick={() => set({ page: params.page + 1 })} className="grid size-7 place-items-center rounded-md border border-line hover:bg-surface-2 disabled:opacity-40">
              <ChevronRight size={15} aria-hidden="true" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  )
}
