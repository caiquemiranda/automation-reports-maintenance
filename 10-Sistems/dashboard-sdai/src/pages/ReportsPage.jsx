import { useMemo } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, FileBarChart, Upload } from 'lucide-react'
import Link from '../components/ui/Link.jsx'
import { CAT_UI } from '../components/ui/categoryUi.js'
import { EmptyState, ErrorState, PageHeader, PageSkeleton } from '../components/ui/states.jsx'
import { btn } from '../components/ui/styles.js'
import { useClient } from '../hooks/clients.js'
import { useAsync } from '../hooks/useAsync.js'
import { ClientSubtitle } from './AnalyticsPage.jsx'
import { fetchClientEvents } from '../lib/api.js'
import { EMPTY_FILTERS, delta, describeEvents, filterEvents } from '../lib/aggregate.js'
import { CATEGORIES } from '../lib/classify.js'
import { fmtInt, fmtMonth } from '../lib/format.js'
import { qs } from '../lib/router.js'

const CATS = ['fire', 'device', 'supervisory', 'trouble']

const monthBounds = (ym) => {
  const [y, m] = ym.split('-').map(Number)
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return { from: `${ym}-01`, to: `${ym}-${String(last).padStart(2, '0')}` }
}

/** Uma linha por mês: o que o relatório gerencial mensal precisa comparar. */
function monthlyRows(events) {
  const b = describeEvents(events)
  const rows = b.months.map((ym) => {
    const r = monthBounds(ym)
    const list = filterEvents(events, { ...EMPTY_FILTERS, ...r })
    const counts = Object.fromEntries(CATS.map((c) => [c, 0]))
    for (const e of list) if (e.cat in counts) counts[e.cat]++
    return { ym, ...r, counts, total: CATS.reduce((a, c) => a + counts[c], 0), partial: r.from < b.min || r.to > b.max }
  })
  rows.forEach((row, i) => (row.prev = rows[i - 1] ?? null))
  return rows.reverse()
}

function Delta({ cur, prev }) {
  const d = delta(cur, prev)
  if (d === null || Math.abs(d) < 0.5) return null
  const Icon = d > 0 ? ArrowUpRight : ArrowDownRight
  return (
    <span className="ml-1 inline-flex items-center text-[11px] text-muted" title="Variação em relação ao mês anterior">
      <Icon size={11} aria-hidden="true" />
      {Math.abs(Math.round(d))}%
    </span>
  )
}

export default function ReportsPage({ slug }) {
  const { client, loading: clientsLoading } = useClient(slug)
  const { data: events, error, loading, reload } = useAsync(() => fetchClientEvents(slug), [slug])
  const rows = useMemo(() => (events?.length ? monthlyRows(events) : []), [events])
  const max = useMemo(() => Object.fromEntries(CATS.map((c) => [c, Math.max(1, ...rows.map((r) => r.counts[c]))])), [rows])

  if (!client && !clientsLoading) return <ErrorState error={new Error(`Cliente "${slug}" não encontrado.`)} />
  if (error) return <ErrorState error={error} onRetry={reload} />
  if (loading || !client) return <PageSkeleton label="Carregando relatórios" />

  const header = <PageHeader title={`Relatórios · ${client.name}`} subtitle={<ClientSubtitle client={client} />} />
  if (!rows.length) {
    return (
      <div className="flex flex-col gap-5">
        {header}
        <EmptyState
          icon={FileBarChart}
          title="Sem meses para resumir"
          action={
            <Link to={`/banco/${slug}?upload=1`} className={btn.primary}>
              <Upload size={15} aria-hidden="true" /> Importar log
            </Link>
          }
        >
          Os relatórios mensais aparecem assim que houver histórico deste cliente no banco.
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {header}
      <section className="rounded-xl border border-line bg-surface">
        <header className="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-4">
          <div>
            <h2 className="text-sm font-semibold">Resumo mensal</h2>
            <p className="mt-0.5 text-xs text-muted">
              Eventos relevantes por mês (operacionais excluídos). Variação contra o mês anterior. Meses <em>parciais</em> não cobrem o mês inteiro e não devem ser comparados.
            </p>
          </div>
        </header>
        <div className="relative mt-3 overflow-x-auto border-t border-line">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead className="text-xs text-muted">
              <tr className="border-b border-line">
                <th scope="col" className="py-2 pl-5 pr-3 font-medium">Mês</th>
                {CATS.map((c) => {
                  const { Icon } = CAT_UI[c]
                  return (
                    <th key={c} scope="col" className="py-2 pr-3 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Icon size={12} aria-hidden="true" /> {CATEGORIES[c].short}
                      </span>
                    </th>
                  )
                })}
                <th scope="col" className="py-2 pr-3 text-right font-medium">Total</th>
                <th scope="col" className="py-2 pr-5"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.ym} className="hover:bg-surface-2">
                  <th scope="row" className="whitespace-nowrap py-2.5 pl-5 pr-3 font-medium">
                    {fmtMonth(r.ym)}
                    {r.partial && <span className="ml-2 rounded bg-surface-2 px-1.5 py-px text-[11px] font-normal text-muted">parcial</span>}
                  </th>
                  {CATS.map((c) => (
                    <td key={c} className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="tnum w-12 text-right font-semibold">{fmtInt(r.counts[c])}</span>
                        <span className="h-1.5 w-20 rounded-full bg-surface-2" aria-hidden="true">
                          <span className={`block h-full rounded-full ${CAT_UI[c].bar}`} style={{ width: `${(r.counts[c] / max[c]) * 100}%` }} />
                        </span>
                        {!r.partial && r.prev && !r.prev.partial && <Delta cur={r.counts[c]} prev={r.prev.counts[c]} />}
                      </div>
                    </td>
                  ))}
                  <td className="tnum py-2.5 pr-3 text-right font-semibold">{fmtInt(r.total)}</td>
                  <td className="py-2.5 pr-5 text-right">
                    <Link to={`/analytics/${slug}${qs({ de: r.from, ate: r.to })}`} className={btn.ghost}>
                      Abrir no Analytics <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
