import { useCallback } from 'react'
import { ArrowRight, CalendarRange, CircleCheck, Database, History, MapPin, TriangleAlert, Upload } from 'lucide-react'
import UploadDialog from '../components/UploadDialog.jsx'
import Link from '../components/ui/Link.jsx'
import { CategoryBadge } from '../components/ui/category.jsx'
import { EmptyState, ErrorState, PageHeader, PageSkeleton } from '../components/ui/states.jsx'
import { btn } from '../components/ui/styles.js'
import { useClients } from '../hooks/clients.js'
import { useAsync } from '../hooks/useAsync.js'
import { fetchClient, fetchEventsPage, fetchImports } from '../lib/api.js'
import { enrich } from '../lib/parser.js'
import { fmtAgo, fmtDate, fmtDateTime, fmtInt, fmtLocal } from '../lib/format.js'
import { navigate, useLocation } from '../lib/router.js'

const PREVIEW = 12

function Stat({ icon: Icon, label, children, tone }) {
  return (
    <div className={`rounded-xl border border-line p-4 ${tone ?? 'bg-surface'}`}>
      <p className="flex items-center gap-1.5 text-xs font-medium text-ink-2">
        <Icon size={14} aria-hidden="true" /> {label}
      </p>
      <div className="mt-1.5 text-[13px]">{children}</div>
    </div>
  )
}

/** Últimos registros estruturados: o que o banco guarda, sem análise. */
export function EventsPreviewTable({ rows, showSite }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-[13px]">
        <thead className="text-xs text-muted">
          <tr className="border-b border-line">
            <th scope="col" className="py-2 pl-5 pr-3 font-medium">Seq</th>
            <th scope="col" className="py-2 pr-3 font-medium">Data / hora</th>
            {showSite && <th scope="col" className="py-2 pr-3 font-medium">Site</th>}
            <th scope="col" className="py-2 pr-3 text-center font-medium">Nó</th>
            <th scope="col" className="py-2 pr-3 font-medium">Descrição</th>
            <th scope="col" className="py-2 pr-3 font-medium">Tipo · Estado</th>
            <th scope="col" className="py-2 pr-5 font-medium">Categoria</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => {
            const e = enrich(r)
            return (
              <tr key={r.id} className="hover:bg-surface-2">
                <td className="tnum py-1.5 pl-5 pr-3 text-xs text-muted">{r.seq}</td>
                <td className="tnum whitespace-nowrap py-1.5 pr-3 text-xs text-ink-2">{fmtDateTime(r.ts)}</td>
                {showSite && <td className="whitespace-nowrap py-1.5 pr-3 text-xs">{r.siteName}</td>}
                <td className="tnum py-1.5 pr-3 text-center text-xs font-semibold">{r.node ?? '—'}</td>
                <td className="max-w-md py-1.5 pr-3">
                  {e.dev && <span className="mr-1.5 font-mono text-xs text-ink-2">{e.dev}</span>}
                  <span title={r.desc}>{e.label}</span>
                </td>
                <td className="whitespace-nowrap py-1.5 pr-3 text-xs">
                  <span className="text-muted">{r.type || '—'}</span>
                  {r.state && <span className="ml-1.5 font-medium">{r.state}</span>}
                </td>
                <td className="py-1.5 pr-5">
                  <CategoryBadge cat={e.cat} compact />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function DatabasePage({ slug }) {
  const { reload: reloadClients } = useClients()
  const { path, query } = useLocation()
  const detail = useAsync(() => fetchClient(slug), [slug])
  const imports = useAsync(() => fetchImports(slug), [slug])
  const preview = useAsync(() => fetchEventsPage(slug, { size: PREVIEW }), [slug])
  const uploading = query.get('upload') === '1'

  const openUpload = () => navigate(`${path}?upload=1`)
  const closeUpload = useCallback(() => navigate(path, { replace: true }), [path])
  const onImported = () => {
    detail.reload()
    imports.reload()
    preview.reload()
    reloadClients()
  }

  if (detail.error) return <ErrorState error={detail.error} onRetry={detail.reload} />
  if (!detail.data) return <PageSkeleton label="Carregando banco de dados" />
  const c = detail.data
  const hasData = c.events > 0

  const dialog = uploading && <UploadDialog client={c} onClose={closeUpload} onImported={onImported} />
  const actions = (
    <>
      <button type="button" onClick={openUpload} className={btn.primary}>
        <Upload size={15} aria-hidden="true" /> Subir novo log
      </button>
      {hasData && (
        <Link to={`/banco/${slug}/eventos`} className={btn.secondary}>
          Ver todos os registros
        </Link>
      )}
    </>
  )

  // O diálogo fica sempre na mesma posição da árvore: na 1ª importação a página troca
  // de "vazia" para "com dados" e o diálogo não pode ser remontado (perderia o resultado).
  const page = (content) => (
    <>
      {content}
      {dialog}
    </>
  )

  if (!hasData) {
    return page(
      <div className="flex flex-col gap-5">
        <PageHeader title={`Banco de dados · ${c.name}`} subtitle="Nenhum log importado ainda." />
        <EmptyState
          icon={Database}
          title={`Comece pelo primeiro log de ${c.name}`}
          action={
            <button type="button" onClick={openUpload} className={btn.primary}>
              <Upload size={15} aria-hidden="true" /> Subir log do TSW
            </button>
          }
        >
          Exporte o <strong>Entire Historical Log Report</strong> no TSW e envie aqui. O painel (site) é cadastrado automaticamente pelo cabeçalho do arquivo; nos próximos envios só os registros novos
          entram.
        </EmptyState>
      </div>,
    )
  }

  const last = c.lastImport
  return page(
    <div className="flex flex-col gap-5">
      <PageHeader title={`Banco de dados · ${c.name}`} subtitle="Todos os registros dos logs importados, já estruturados. A análise acontece no Analytics." actions={actions} />

      <section aria-label="Resumo do banco" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Database} label="Registros armazenados">
          <p className="tnum text-2xl font-semibold leading-tight">{fmtInt(c.events)}</p>
          <p className="text-xs text-muted">
            em {c.sites.length} site{c.sites.length > 1 ? 's' : ''}
          </p>
        </Stat>
        <Stat icon={CalendarRange} label="Período coberto">
          <p className="tnum font-semibold">
            {fmtDate(c.firstTs)} → {fmtDate(c.lastTs)}
          </p>
          <p className="text-xs text-muted">último evento {fmtAgo(c.lastTs)}</p>
        </Stat>
        <Stat icon={History} label="Última importação">
          <p className="truncate font-semibold" title={last.fileName}>
            {last.fileName}
          </p>
          <p className="text-xs text-muted">
            {fmtLocal(last.importedAt)} · {fmtInt(last.inserted)} novos
          </p>
        </Stat>
        <Stat icon={c.integrity.ok ? CircleCheck : TriangleAlert} label="Integridade" tone={c.integrity.ok ? undefined : 'tint-device'}>
          <p className="font-semibold">{c.integrity.ok ? 'Sequência completa' : `${fmtInt(c.integrity.missing)} registro(s) faltando`}</p>
          <p className="text-xs text-muted">{c.integrity.ok ? 'nenhum buraco na numeração do TSW' : 'importe um log que cubra o trecho'}</p>
        </Stat>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="min-w-0 rounded-xl border border-line bg-surface xl:col-span-2">
          <header className="flex items-center justify-between gap-2 px-5 pt-4">
            <div>
              <h2 className="text-sm font-semibold">Registros mais recentes</h2>
              <p className="text-xs text-muted">Prévia dos {PREVIEW} últimos de {fmtInt(c.events)}</p>
            </div>
            <Link to={`/banco/${slug}/eventos`} className={btn.ghost}>
              Ver todos <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </header>
          <div className="mt-3 border-t border-line">
            {preview.data ? <EventsPreviewTable rows={preview.data.rows} showSite={c.sites.length > 1} /> : <div className="h-64 animate-pulse" />}
          </div>
        </section>

        <div className="flex min-w-0 flex-col gap-4">
          <section className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold">Sites / painéis</h2>
            <ul className="mt-3 divide-y divide-line text-[13px]">
              {c.sites.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-2 py-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <MapPin size={14} className="shrink-0 text-muted" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{s.name}</span>
                      <span className="block truncate text-xs text-muted">{s.source ?? 'painel não identificado'}</span>
                    </span>
                  </span>
                  <span className="tnum shrink-0 text-xs text-ink-2">{fmtInt(s.events)} eventos</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold">Histórico de importações</h2>
            <ol className="mt-3 space-y-3 text-[13px]">
              {(imports.data ?? []).slice(0, 8).map((i) => (
                <li key={i.id} className="flex items-start gap-2.5">
                  <span aria-hidden="true" className={`mt-1.5 size-2 shrink-0 rounded-full ${i.warnings.length ? 'bg-device' : 'bg-accent'}`} />
                  <div className="min-w-0">
                    <p className="truncate font-medium" title={i.fileName}>
                      {i.fileName}
                    </p>
                    <p className="text-xs text-muted">
                      {fmtLocal(i.importedAt)} · <span className="tnum">{fmtInt(i.inserted)}</span> novos · <span className="tnum">{fmtInt(i.duplicates)}</span> já existiam
                      {i.warnings.length > 0 && ` · ${i.warnings.length} aviso(s)`}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>,
  )
}
