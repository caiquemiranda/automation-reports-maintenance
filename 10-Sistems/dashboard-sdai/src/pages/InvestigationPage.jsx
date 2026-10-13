import { useMemo, useState } from 'react'
import { ArrowRight, Cable, Cpu, ExternalLink, Info, SearchCheck, Unplug, Zap } from 'lucide-react'
import AnalyticsTabs from '../components/AnalyticsTabs.jsx'
import { EventStrip } from '../components/charts/EventStrip.jsx'
import { Card, Legend } from '../components/ui/Card.jsx'
import Link from '../components/ui/Link.jsx'
import { CAT_UI, STACK_ORDER } from '../components/ui/categoryUi.js'
import { EmptyState, ErrorState, PageHeader, PageSkeleton } from '../components/ui/states.jsx'
import { btn } from '../components/ui/styles.js'
import { useClient } from '../hooks/clients.js'
import { useAsync } from '../hooks/useAsync.js'
import { ClientSubtitle } from './AnalyticsPage.jsx'
import { fetchClientEvents } from '../lib/api.js'
import { EMPTY_FILTERS, filtersForRange } from '../lib/aggregate.js'
import { CATEGORIES } from '../lib/classify.js'
import { filtersToQuery } from '../lib/filterParams.js'
import { fmtInt, fmtMonth, fmtNode } from '../lib/format.js'
import { EPISODE_KINDS, LOOKBACKS, detectEpisodes, precursors, suspects } from '../lib/investigate.js'
import { navigate, qs, useLocation } from '../lib/router.js'
import { ddmmyyyy, fmtDuration, hhmm } from '../lib/timefmt.js'

const KIND_ICON = { cascade: Cable, card: Cpu, ground: Zap, node: Unplug }
const DEFAULT_KINDS = ['cascade', 'card', 'ground'] // "nó fora da rede" é rede, não laço: fora por padrão
const AFTER = 30 * 60000 // quanto mostrar depois do início do episódio

const monthRange = (ym) => {
  const [y, m] = ym.split('-').map(Number)
  return { from: `${ym}-01`, to: `${ym}-${String(new Date(Date.UTC(y, m, 0)).getUTCDate()).padStart(2, '0')}` }
}
const dayTs = (d, end) => Date.parse(d + 'T00:00:00Z') + (end ? 86400000 - 1 : 0)

function KindBadge({ kind }) {
  const Icon = KIND_ICON[kind]
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] font-semibold text-ink-2" title={EPISODE_KINDS[kind].hint}>
      <Icon size={12} aria-hidden="true" /> {EPISODE_KINDS[kind].label}
    </span>
  )
}

/** Link para o painel do cliente já filtrado (dispositivos + janela de tempo). */
const dashboardLink = (slug, patch) => `/analytics/${slug}${qs(filtersToQuery({ ...EMPTY_FILTERS, ...patch }))}`

function EpisodeDetail({ slug, events, episode, lookback, labels }) {
  const pre = useMemo(() => precursors(events, episode, lookback.ms), [events, episode, lookback])
  // enquadra onde há sinal (não a janela inteira): com 24–72 h tudo ficaria espremido na borda
  const windowFrom = episode.start - lookback.ms
  const firstSignal = pre.length ? Math.min(...pre.map((p) => p.first)) : episode.start
  const lead = episode.start - firstSignal
  const from = Math.max(windowFrom, Math.min(episode.start - 15 * 60000, firstSignal - Math.max(5 * 60000, lead * 0.1)))
  const to = Math.max(episode.end, episode.start) + Math.max(10 * 60000, Math.min(AFTER, (episode.start - from) * 0.2))

  const { rows, strip } = useMemo(() => {
    const order = new Map(episode.devices.map((d, i) => [d.dev, i + 1]))
    const devs = [...new Set([...pre.slice(0, 12).map((p) => p.dev), ...episode.devices.map((d) => d.dev)])]
    const set = new Set(devs)
    return {
      rows: devs.map((d) => ({ key: d, label: d, sub: labels[d], tag: order.has(d) ? `${order.get(d)}º a cair` : undefined })),
      strip: events.filter((e) => set.has(e.dev) && e.cat !== 'info' && e.ts >= from && e.ts <= to).map((e) => ({ row: e.dev, ts: e.ts, cat: e.cat, state: e.state })),
    }
  }, [events, episode, pre, labels, from, to])


  const cats = STACK_ORDER.filter((c) => strip.some((e) => e.cat === c))
  const openTo = dashboardLink(slug, { ...filtersForRange(from - (from % 60000), to - (to % 60000) + 59999), devs: rows.slice(0, 8).map((r) => r.key) })


  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <KindBadge kind={episode.kind} />
            <span className="text-sm font-semibold">
              {episode.loop ? `Laço ${episode.loop}` : fmtNode(episode.node)}
            </span>
          </div>
          <p className="tnum mt-1 text-[13px] text-ink-2">
            {ddmmyyyy(episode.start)} às {hhmm(episode.start)} · duração {fmtDuration(episode.end - episode.start)} · {fmtInt(episode.count)} evento(s)
            {episode.devices.length > 0 && ` · ${episode.devices.length} dispositivos caíram`}
          </p>
          <p className="mt-0.5 text-xs text-muted">{EPISODE_KINDS[episode.kind].hint}</p>
        </div>
        {rows.length > 0 && (
          <Link to={openTo} className={btn.secondary}>
            <ExternalLink size={14} aria-hidden="true" /> Abrir no painel
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-lg bg-surface-2 px-4 py-8 text-center text-sm text-muted">
          Nenhum dispositivo de laço do {fmtNode(episode.node).toLowerCase()} deu sinal nas {lookback.label} anteriores.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Legend items={cats.map((c) => ({ key: c, label: CATEGORIES[c].label, color: CAT_UI[c].css }))} />
            <span className="flex items-center gap-1.5 text-[11px] text-muted">
              <span className="inline-block h-3 w-5 rounded-sm bg-accent/15" aria-hidden="true" /> janela de antecedência ({lookback.label})
              <span className="ml-2 inline-block h-3 border-l-2 border-dashed border-ink" aria-hidden="true" /> início do episódio
            </span>
          </div>
          <EventStrip rows={rows} events={strip} from={from} to={to} markers={[{ ts: episode.start, label: 'Início do episódio' }]} shade={{ from: windowFrom, to: episode.start }} onPickRow={(dev) => navigate(dashboardLink(slug, { devs: [dev] }))} />

          {pre.length > 0 && (
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-[13px]">
                <caption className="mb-2 text-left text-xs font-semibold text-ink-2">Deram sinal antes ({lookback.label})</caption>
                <thead className="text-xs text-muted">
                  <tr className="border-b border-line">
                    <th scope="col" className="py-1.5 pr-3 font-medium">Dispositivo</th>
                    <th scope="col" className="py-1.5 pr-3 font-medium">Descrição</th>
                    <th scope="col" className="py-1.5 pr-3 text-right font-medium">Sinais</th>
                    <th scope="col" className="py-1.5 pr-3 font-medium">Último sinal</th>
                    <th scope="col" className="py-1.5 font-medium">Estados</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {pre.slice(0, 10).map((p) => (
                    <tr key={p.dev}>
                      <td className="py-1.5 pr-3">
                        <Link to={dashboardLink(slug, { devs: [p.dev] })} className="font-mono text-xs font-semibold text-accent hover:underline">
                          {p.dev}
                        </Link>
                      </td>
                      <td className="max-w-[220px] truncate py-1.5 pr-3 text-xs" title={p.label}>
                        {p.label}
                      </td>
                      <td className="tnum py-1.5 pr-3 text-right font-semibold">{fmtInt(p.count)}</td>
                      <td className="tnum whitespace-nowrap py-1.5 pr-3 text-xs text-ink-2">{fmtDuration(p.leadMin * 60000)} antes</td>
                      <td className="py-1.5 text-xs text-muted">
                        {Object.entries(p.states)
                          .sort((a, b) => b[1] - a[1])
                          .map(([s, n]) => `${s} ×${n}`)
                          .join(' · ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/**
 * Investigação de falhas de laço: episódios (laço/placa/terra) e quem deu sinal
 * antes deles. Parâmetros na URL: de, ate, tipo, ant, no, ep.
 */
export default function InvestigationPage({ slug }) {
  const { client, loading: clientsLoading } = useClient(slug)
  const { path, query } = useLocation()
  const { data: events, error, loading, reload } = useAsync(() => fetchClientEvents(slug), [slug])
  const [showAll, setShowAll] = useState(false)

  const de = query.get('de') ?? ''
  const ate = query.get('ate') ?? ''
  const kinds = (query.get('tipo') ?? DEFAULT_KINDS.join(',')).split(',').filter((k) => k in EPISODE_KINDS)
  const lookback = LOOKBACKS.find((l) => l.key === query.get('ant')) ?? LOOKBACKS[2]
  const node = query.get('no') ? Number(query.get('no')) : null
  const set = (patch) => {
    const cur = { de, ate, tipo: kinds.join(','), ant: lookback.key, no: node ?? '', ep: query.get('ep') ?? '' }
    const next = { ...cur, ...patch }
    // trocar de episódio não enche o histórico; mudar período/tipo/nó/janela sim ("voltar" desfaz)
    const onlyEpisode = Object.keys(patch).length === 1 && 'ep' in patch
    navigate(path + qs({ ...next, tipo: next.tipo === DEFAULT_KINDS.join(',') ? '' : next.tipo, ant: next.ant === '24h' ? '' : next.ant }), { replace: onlyEpisode, scroll: false })
  }

  // nome do dispositivo: o do evento com tipo (o de "[INSTALL] … ADDED TO INSTALL MODE" não serve)
  const labels = useMemo(() => {
    const m = {}
    for (const e of events ?? []) if (e.dev && (e.type || !(e.dev in m))) m[e.dev] = e.label
    return m
  }, [events])
  const months = useMemo(() => [...new Set((events ?? []).map((e) => e.day.slice(0, 7)))].sort(), [events])

  const allEpisodes = useMemo(() => {
    if (!events?.length) return []
    const inPeriod = events.filter((e) => (!de || e.ts >= dayTs(de)) && (!ate || e.ts <= dayTs(ate, true)))
    return detectEpisodes(inPeriod)
  }, [events, de, ate])
  const kindCounts = useMemo(() => allEpisodes.reduce((a, e) => ((a[e.kind] = (a[e.kind] || 0) + 1), a), {}), [allEpisodes])
  const nodes = useMemo(() => [...new Set(allEpisodes.map((e) => e.node))].sort((a, b) => a - b), [allEpisodes])
  const episodes = useMemo(() => allEpisodes.filter((e) => kinds.includes(e.kind) && (node === null || e.node === node)), [allEpisodes, kinds, node])
  const ranking = useMemo(() => (events ? suspects(events, episodes, lookback.ms) : []), [events, episodes, lookback])
  const selected = episodes.find((e) => e.id === query.get('ep')) ?? episodes[0] ?? null

  if (!client && !clientsLoading) return <ErrorState error={new Error(`Cliente "${slug}" não encontrado.`)} />
  if (error) return <ErrorState error={error} onRetry={reload} />
  if (loading || !client) return <PageSkeleton label="Carregando eventos do cliente" />

  const header = (
    <>
      <PageHeader title={client.name} subtitle={<ClientSubtitle client={client} />} />
      <AnalyticsTabs slug={slug} current="investigacao" />
    </>
  )
  if (!events.length) {
    return (
      <div className="flex flex-col gap-4">
        {header}
        <EmptyState icon={SearchCheck} title="Sem histórico para investigar">
          Importe um log deste cliente no Banco de dados.
        </EmptyState>
      </div>
    )
  }

  const month = months.find((ym) => monthRange(ym).from === de && monthRange(ym).to === ate) ?? ''
  const topShare = ranking[0]
  const maxCascade = episodes.filter((e) => e.kind === 'cascade').reduce((m, e) => Math.max(m, e.devices.length), 0)
  const shown = showAll ? ranking : ranking.slice(0, 10)

  return (
    <div className="flex flex-col gap-4">
      {header}

      <p className="flex items-start gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-[13px] text-ink-2">
        <Info size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
        <span>
          Um curto num equipamento pode derrubar o laço e deixar vários dispositivos <strong>sem resposta</strong> ao mesmo tempo: esses são consequência. Aqui cada{' '}
          <strong>episódio</strong> (laço caiu, placa ou terra em falha) é cruzado com quem já dava sinal <strong>antes</strong> no mesmo nó. Quem aparece antes de muitos
          episódios é o primeiro a inspecionar.
        </span>
      </p>

      {/* Controles */}
      <section aria-label="Parâmetros da investigação" className="no-print flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-line bg-surface px-4 py-3">
        <label className="flex items-center gap-2 text-[13px]">
          <span className="text-muted">Período</span>
          <select
            value={month}
            onChange={(e) => set(e.target.value ? { de: monthRange(e.target.value).from, ate: monthRange(e.target.value).to, ep: '' } : { de: '', ate: '', ep: '' })}
            className="h-9 rounded-lg border border-line bg-surface px-2.5 text-[13px]"
          >
            <option value="">{de || ate ? 'Período personalizado' : 'Todo o histórico'}</option>
            {months.map((ym) => (
              <option key={ym} value={ym}>
                {fmtMonth(ym)}
              </option>
            ))}
          </select>
        </label>

        <div role="group" aria-label="Tipos de episódio" className="flex flex-wrap gap-1.5">
          {Object.entries(EPISODE_KINDS).map(([k, meta]) => {
            const on = kinds.includes(k)
            const Icon = KIND_ICON[k]
            return (
              <button
                key={k}
                type="button"
                aria-pressed={on}
                title={meta.hint}
                onClick={() => set({ tipo: (on ? kinds.filter((x) => x !== k) : [...kinds, k]).join(','), ep: '' })}
                className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium ${on ? 'border-accent bg-accent/10 text-ink' : 'border-line text-muted hover:text-ink'}`}
              >
                <Icon size={13} aria-hidden="true" /> {meta.label}
                <span className="tnum rounded-full bg-surface-2 px-1.5 text-[11px]">{fmtInt(kindCounts[k] ?? 0)}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 text-[13px]">
          <span className="text-muted" id="ant-label">
            Olhar para trás
          </span>
          <div role="radiogroup" aria-labelledby="ant-label" className="flex overflow-hidden rounded-lg border border-line text-xs">
            {LOOKBACKS.map((l) => (
              <button
                key={l.key}
                type="button"
                role="radio"
                aria-checked={l.key === lookback.key}
                onClick={() => set({ ant: l.key })}
                className={`h-8 border-r border-line px-2.5 last:border-r-0 ${l.key === lookback.key ? 'bg-accent font-semibold text-accent-ink' : 'hover:bg-surface-2'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-[13px]">
          <span className="text-muted">Nó</span>
          <select value={node ?? ''} onChange={(e) => set({ no: e.target.value, ep: '' })} className="h-9 rounded-lg border border-line bg-surface px-2.5 text-[13px]">
            <option value="">Todos</option>
            {nodes.map((n) => (
              <option key={n} value={n}>
                {fmtNode(n)}
              </option>
            ))}
          </select>
        </label>
      </section>

      {episodes.length === 0 ? (
        <EmptyState icon={SearchCheck} title="Nenhum episódio com esses parâmetros">
          Inclua outros tipos de episódio, outro nó ou amplie o período.
        </EmptyState>
      ) : (
        <>
          {/* Resumo */}
          <section aria-label="Resumo" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              ['Episódios', fmtInt(episodes.length), de || ate ? 'no período escolhido' : 'em todo o histórico'],
              ['Nós afetados', fmtInt(new Set(episodes.map((e) => e.node)).size), node === null ? 'no recorte' : fmtNode(node)],
              ['Principal suspeito', topShare ? topShare.dev : '—', topShare ? `antes de ${topShare.episodes} de ${topShare.nodeEpisodes} episódios do nó` : 'ninguém deu sinal antes'],
              ['Maior cascata', maxCascade ? `${maxCascade} dispositivos` : '—', maxCascade ? 'caíram juntos no mesmo laço' : 'nenhuma no recorte'],
            ].map(([label, value, hint]) => (
              <div key={label} className="rounded-xl border border-line bg-surface px-4 py-3">
                <p className="text-xs font-medium text-muted">{label}</p>
                <p className="tnum mt-1 truncate text-xl font-semibold" title={value}>
                  {value}
                </p>
                <p className="truncate text-xs text-muted">{hint}</p>
              </div>
            ))}
          </section>

          {/* Suspeitos */}
          <Card title="Quem dá sinal antes das falhas" subtitle={`Dispositivos com ocorrência nas ${lookback.label} anteriores a cada episódio do seu nó. A barra mostra em que fração dos episódios do nó ele apareceu antes.`}>
            {ranking.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted">Nenhum dispositivo deu sinal antes dos episódios selecionados.</p>
            ) : (
              <div className="relative mt-3 overflow-x-auto border-t border-line">
                <table className="w-full min-w-[820px] text-left text-[13px]">
                  <thead className="text-xs text-muted">
                    <tr className="border-b border-line">
                      <th scope="col" className="w-8 py-2 pl-5 font-medium">#</th>
                      <th scope="col" className="py-2 pr-3 font-medium">Dispositivo</th>
                      <th scope="col" className="py-2 pr-3 font-medium">Descrição</th>
                      <th scope="col" className="w-64 py-2 pr-3 font-medium">Antes de quantos episódios do nó</th>
                      <th scope="col" className="py-2 pr-3 text-right font-medium">Sinais</th>
                      <th scope="col" className="py-2 pr-5 font-medium">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {shown.map((s, i) => (
                      <tr key={s.dev} className="hover:bg-surface-2">
                        <td className="tnum py-2 pl-5 text-muted">{i + 1}</td>
                        <td className="whitespace-nowrap py-2 pr-3">
                          <span className="font-mono text-xs font-semibold">{s.dev}</span>
                          <span className="block text-[11px] text-muted">{fmtNode(s.node)}</span>
                        </td>
                        <td className="max-w-xs py-2 pr-3">
                          <span className="block truncate" title={s.label}>
                            {s.label}
                          </span>
                          <span className="block truncate text-[11px] text-muted">
                            {Object.entries(s.states)
                              .sort((a, b) => b[1] - a[1])
                              .slice(0, 2)
                              .map(([st, n]) => `${st} ×${fmtInt(n)}`)
                              .join(' · ')}
                          </span>
                        </td>
                        <td className="py-2 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="h-2 flex-1 rounded-full bg-surface-2" aria-hidden="true">
                              <span className="block h-full rounded-full bg-accent" style={{ width: `${Math.max(3, s.share * 100)}%` }} />
                            </span>
                            <span className="tnum w-24 text-right text-xs">
                              <strong>{s.episodes}</strong> de {s.nodeEpisodes} ({Math.round(s.share * 100)}%)
                            </span>
                          </div>
                        </td>
                        <td className="tnum py-2 pr-3 text-right font-semibold">{fmtInt(s.signals)}</td>
                        <td className="py-2 pr-5 text-right">
                          <Link to={dashboardLink(slug, { devs: [s.dev] })} className={btn.ghost}>
                            Analisar <ArrowRight size={13} aria-hidden="true" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {ranking.length > 10 && (
                  <div className="no-print flex justify-center border-t border-line py-2">
                    <button type="button" onClick={() => setShowAll((v) => !v)} className={btn.ghost}>
                      {showAll ? 'Mostrar só os 10 primeiros' : `Mostrar todos (${ranking.length})`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Episódios */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(280px,360px)_1fr]">
            <Card title="Episódios" subtitle={`${fmtInt(episodes.length)} no recorte, do mais recente ao mais antigo`}>
              <ul className="thin-scroll mt-3 max-h-[560px] divide-y divide-line overflow-y-auto border-t border-line">
                {episodes.map((ep) => {
                  const on = selected?.id === ep.id
                  return (
                    <li key={ep.id}>
                      <button
                        type="button"
                        aria-current={on ? 'true' : undefined}
                        onClick={() => set({ ep: ep.id })}
                        className={`flex w-full flex-col gap-1 px-5 py-2.5 text-left ${on ? 'bg-accent/10' : 'hover:bg-surface-2'}`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <KindBadge kind={ep.kind} />
                          <span className="tnum text-xs text-muted">{fmtNode(ep.node)}</span>
                        </span>
                        <span className="tnum text-[13px] font-medium">
                          {ddmmyyyy(ep.start)} · {hhmm(ep.start)}
                        </span>
                        <span className="text-[11px] text-muted">
                          {ep.devices.length ? `${ep.devices.length} dispositivos · ` : ''}
                          {fmtInt(ep.count)} evento(s) · {fmtDuration(ep.end - ep.start)}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </Card>

            <Card title="Detalhe do episódio" subtitle="Cada faixa é um dispositivo; cada traço, uma ocorrência. Clique no nome para analisar o dispositivo.">
              <div className="px-5 pb-5 pt-4">{selected && <EpisodeDetail slug={slug} events={events} episode={selected} lookback={lookback} labels={labels} />}</div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
