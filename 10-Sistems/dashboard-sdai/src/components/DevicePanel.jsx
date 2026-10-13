import { useMemo } from 'react'
import { Activity, CalendarDays, Cpu, Plus, Repeat, Timer, Users, X, Zap } from 'lucide-react'
import { CalendarHeatmap } from './charts/CalendarHeatmap.jsx'
import { deviceProfile } from '../lib/device.js'
import { fmtInt, fmtNode } from '../lib/format.js'
import { ddmmyyyy, fmtDuration, hhmm } from '../lib/timefmt.js'

/** Proporção de intervalos curtos (< 5 min) que caracteriza comportamento intermitente. */
const INTERMITTENT_SHARE = 0.5

function Stat({ icon: Icon, label, value, hint }) {
  return (
    <div className="min-w-0 rounded-lg border border-line px-3 py-2.5">
      <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
        <Icon size={12} aria-hidden="true" /> {label}
      </p>
      <p className="tnum mt-0.5 truncate text-lg font-semibold leading-tight">{value}</p>
      {hint && <p className="truncate text-[11px] text-muted">{hint}</p>}
    </div>
  )
}

/**
 * Raio-x de um dispositivo (filtro "Dispositivo" com um item): todo o histórico
 * no calendário, como as ocorrências se espaçam e quem falha junto com ele.
 */
export default function DevicePanel({ all, inRange, dev, selectedDay, onClear, onPickDay, onAddDevice }) {
  const p = useMemo(() => deviceProfile(all, inRange, dev), [all, inRange, dev])
  const short = p.intervals.slice(0, 2).reduce((a, b) => a + b.count, 0)
  const totalGaps = p.intervals.reduce((a, b) => a + b.count, 0)
  const intermittent = totalGaps >= 5 && short / totalGaps >= INTERMITTENT_SHARE
  const maxBin = Math.max(1, ...p.intervals.map((b) => b.count))
  const stateList = Object.entries(p.states).sort((a, b) => b[1] - a[1])

  return (
    <section aria-label={`Dispositivo ${dev}`} className="print-break rounded-xl border-2 border-accent/40 bg-surface">
      <header className="flex flex-wrap items-start gap-3 px-5 pt-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
          <Cpu size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted">Análise do dispositivo</p>
          <h2 className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-mono text-lg font-bold">{dev}</span>
            <span className="truncate text-sm font-medium text-ink-2">{p.label}</span>
          </h2>
          <p className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-muted">
            {p.type && <span>{p.type}</span>}
            {p.address && (
              <span>
                {fmtNode(p.address.node)} · laço {p.address.loop} · endereço {p.address.device}
              </span>
            )}
            {p.history.first && (
              <span>
                no histórico: {fmtInt(p.history.total)} ocorrências em {p.history.days} dia(s), de {ddmmyyyy(p.history.first)} a {ddmmyyyy(p.history.last)}
              </span>
            )}
          </p>
        </div>
        {intermittent && (
          <span className="tint-device inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold" title="Mais da metade das ocorrências vêm a menos de 5 min da anterior">
            <Repeat size={13} aria-hidden="true" /> Comportamento intermitente
          </span>
        )}
        <button type="button" onClick={onClear} className="no-print inline-flex h-8 items-center gap-1 rounded-md px-2 text-[13px] text-muted hover:bg-surface-2 hover:text-ink">
          <X size={14} aria-hidden="true" /> Sair da análise
        </button>
      </header>

      <div className="grid grid-cols-2 gap-2 px-5 pt-4 lg:grid-cols-4">
        <Stat icon={Activity} label="Ocorrências no recorte" value={fmtInt(p.count)} hint={stateList.slice(0, 2).map(([s, n]) => `${s} ${fmtInt(n)}`).join(' · ')} />
        <Stat icon={CalendarDays} label="Dias com ocorrência" value={fmtInt(p.days)} hint={`de ${fmtInt(p.history.days)} no histórico`} />
        <Stat
          icon={Zap}
          label="Maior rajada em 1 hora"
          value={fmtInt(p.burst1h.count)}
          hint={p.burst1h.start ? `${ddmmyyyy(p.burst1h.start)} a partir de ${hhmm(p.burst1h.start)}` : '—'}
        />
        <Stat icon={Timer} label="Intervalo típico" value={fmtDuration(p.medianGap)} hint="mediana entre ocorrências seguidas" />
      </div>

      <div className="px-5 pt-5">
        <h3 className="text-[13px] font-semibold">Histórico completo</h3>
        <p className="mb-2 text-xs text-muted">Cada quadrado é um dia. Clique num dia para ver a linha do tempo minuto a minuto.</p>
        {p.history.first ? (
          <CalendarHeatmap perDay={p.history.perDay} from={new Date(p.history.first).toISOString().slice(0, 10)} to={new Date(p.history.last).toISOString().slice(0, 10)} selected={selectedDay} onPick={onPickDay} />
        ) : (
          <p className="text-sm text-muted">Sem ocorrências relevantes no histórico.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 px-5 pb-5 pt-5 lg:grid-cols-2">
        <div>
          <h3 className="text-[13px] font-semibold">Tempo entre ocorrências seguidas</h3>
          <p className="mb-2 text-xs text-muted">Muitos intervalos curtos indicam falha intermitente (mau contato, base, umidade, fiação).</p>
          <ul className="space-y-1">
            {p.intervals.map((b) => (
              <li key={b.label} className="grid grid-cols-[72px_1fr_44px] items-center gap-2 text-xs">
                <span className="text-ink-2">{b.label}</span>
                <span className="h-3 rounded-sm bg-surface-2" aria-hidden="true">
                  <span className="block h-full rounded-sm bg-device" style={{ width: `${(b.count / maxBin) * 100}%` }} />
                </span>
                <span className="tnum text-right font-semibold">{fmtInt(b.count)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="flex items-center gap-1.5 text-[13px] font-semibold">
            <Users size={14} aria-hidden="true" /> Falham junto (até 2 min de diferença)
          </h3>
          <p className="mb-2 text-xs text-muted">Dispositivos do mesmo nó com ocorrência colada às deste. Adicione para comparar na linha do tempo.</p>
          {p.neighbors.length === 0 ? (
            <p className="rounded-lg bg-surface-2 px-3 py-4 text-center text-xs text-muted">Nenhum outro dispositivo falhou junto no recorte.</p>
          ) : (
            <ul className="divide-y divide-line rounded-lg border border-line">
              {p.neighbors.slice(0, 6).map((n) => (
                <li key={n.dev} className="flex items-center gap-2 px-3 py-1.5 text-xs">
                  <span className="font-mono font-semibold">{n.dev}</span>
                  <span className="min-w-0 flex-1 truncate text-muted" title={n.label}>
                    {n.label}
                  </span>
                  <span className="tnum shrink-0 text-ink-2" title={`Em ${n.together} das ${p.count} ocorrências deste dispositivo`}>
                    {fmtInt(n.together)}× ({Math.round(n.share * 100)}%)
                  </span>
                  <button type="button" onClick={() => onAddDevice(n.dev)} aria-label={`Comparar com ${n.dev}`} title="Comparar na linha do tempo" className="no-print grid size-6 shrink-0 place-items-center rounded-md text-accent hover:bg-accent/10">
                    <Plus size={14} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
