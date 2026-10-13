import { useMemo, useState } from 'react'
import { useElementWidth } from '../../hooks/useElementWidth.js'
import { CATEGORIES } from '../../lib/classify.js'
import { ddmmyyyy, hhmmss, timeTicks } from '../../lib/timefmt.js'
import { CAT_UI } from '../ui/categoryUi.js'

const ROW = 30
const AXIS = 22
const TOP_MARKERS = 18 // espaço para o rótulo dos marcos

/**
 * Linha do tempo por dispositivo: uma faixa por linha, cada ocorrência é um traço
 * colorido pela categoria. Mostra intermitência (traços em rajada), ordem de queda
 * e o que aconteceu antes de um marco (ex.: início de um episódio).
 *
 * rows:    [{ key, label, sub, tag }]
 * events:  [{ row, ts, cat, state }]
 * markers: [{ ts, label }]          linhas verticais (ex.: "queda")
 * shade:   { from, to, label }       faixa de fundo (ex.: janela de antecedência)
 */
export function EventStrip({ rows, events, from, to, markers = [], shade, onPickRow, labelWidth: wantedLabel = 200 }) {
  const [ref, width] = useElementWidth()
  const [hover, setHover] = useState(null)
  const labelWidth = width && width < 640 ? Math.min(wantedLabel, 112) : wantedLabel // celular: mais espaço para o tempo
  const plotW = Math.max(120, width - labelWidth)
  const x = (ts) => ((ts - from) / Math.max(1, to - from)) * plotW
  const { ticks, fmt } = useMemo(() => timeTicks(from, to, Math.max(3, Math.floor(plotW / 110))), [from, to, plotW])

  const byRow = useMemo(() => {
    const m = new Map(rows.map((r) => [r.key, []]))
    for (const e of events) if (e.ts >= from && e.ts <= to) m.get(e.row)?.push(e)
    for (const l of m.values()) l.sort((a, b) => a.ts - b.ts)
    return m
  }, [rows, events, from, to])

  // tooltip: evento mais próximo do cursor na faixa
  const onMove = (rowKey, ev) => {
    const list = byRow.get(rowKey)
    if (!list?.length) return setHover(null)
    const rect = ev.currentTarget.getBoundingClientRect()
    const px = ev.clientX - rect.left
    let best = null
    for (const e of list) {
      const d = Math.abs(x(e.ts) - px)
      if (!best || d < best.d) best = { d, e }
    }
    setHover(best.d <= 8 ? { e: best.e, left: labelWidth + x(best.e.ts), row: rowKey, n: list.filter((o) => Math.abs(x(o.ts) - x(best.e.ts)) < 2).length } : null)
  }

  const top = markers.length ? TOP_MARKERS : 0
  const plotH = rows.length * ROW
  const height = top + plotH + AXIS
  return (
    <div ref={ref} className="relative w-full" onMouseLeave={() => setHover(null)}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={`Linha do tempo de ${rows.length} dispositivo(s)`} className="block select-none">
          {shade && <rect x={labelWidth + x(Math.max(from, shade.from))} y={top} width={Math.max(0, x(Math.min(to, shade.to)) - x(Math.max(from, shade.from)))} height={plotH} fill="var(--accent)" opacity={0.08} />}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={labelWidth + x(t)} x2={labelWidth + x(t)} y1={top} y2={top + plotH} stroke="var(--line)" />
              <text x={labelWidth + x(t)} y={top + plotH + 15} textAnchor="middle" fontSize="10.5" fill="var(--muted)" className="tnum">
                {fmt(t)}
              </text>
            </g>
          ))}
          {rows.map((r, i) => (
            <g key={r.key} transform={`translate(0 ${top + i * ROW})`}>
              {i % 2 === 1 && <rect x={labelWidth} y={0} width={plotW} height={ROW} fill="var(--surface-2)" opacity={0.6} />}
              <rect x={labelWidth} y={0} width={plotW} height={ROW} fill="transparent" onMouseMove={(ev) => onMove(r.key, ev)} />
              {(byRow.get(r.key) ?? []).map((e, k) => (
                <rect key={k} x={labelWidth + x(e.ts) - 1.25} y={7} width={2.5} height={ROW - 14} rx={1.25} fill={CAT_UI[e.cat]?.css ?? 'var(--muted)'} pointerEvents="none" />
              ))}
            </g>
          ))}
          {markers.map((m) => (
            <g key={m.ts} pointerEvents="none">
              <line x1={labelWidth + x(m.ts)} x2={labelWidth + x(m.ts)} y1={top - 2} y2={top + plotH} stroke="var(--ink)" strokeWidth={1.5} strokeDasharray="4 3" />
              <text x={labelWidth + x(m.ts)} y={12} textAnchor={x(m.ts) > plotW - 60 ? 'end' : x(m.ts) < 60 ? 'start' : 'middle'} fontSize="10.5" fontWeight="600" fill="var(--ink)" stroke="var(--surface)" strokeWidth={3} paintOrder="stroke">
                {m.label}
              </text>
            </g>
          ))}
        </svg>
      )}

      {/* rótulos em HTML (truncamento e clique acessíveis) */}
      <ul className="absolute left-0" style={{ width: labelWidth - 8, top }}>
        {rows.map((r) => (
          <li key={r.key} style={{ height: ROW }} className="flex items-center">
            <button
              type="button"
              disabled={!onPickRow}
              onClick={() => onPickRow?.(r.key)}
              title={`${r.label}${r.sub ? ' — ' + r.sub : ''}`}
              className="flex min-w-0 items-center gap-1.5 text-left text-xs enabled:hover:text-accent"
            >
              {r.tag && <span className="tnum shrink-0 rounded bg-surface-2 px-1 text-[10px] text-muted">{r.tag}</span>}
              <span className="shrink-0 font-mono font-semibold">{r.label}</span>
              {r.sub && <span className="truncate text-muted">{r.sub}</span>}
            </button>
          </li>
        ))}
      </ul>

      {hover && (
        <div
          role="status"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs shadow-lg"
          style={{ left: hover.left, top: top + rows.findIndex((r) => r.key === hover.row) * ROW + 4 }}
        >
          <p className="font-semibold">
            {ddmmyyyy(hover.e.ts)} {hhmmss(hover.e.ts)}
          </p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-sm" style={{ background: CAT_UI[hover.e.cat]?.css }} />
            {hover.e.state || CATEGORIES[hover.e.cat]?.short}
            {hover.n > 1 && <span className="text-muted">· +{hover.n - 1} no mesmo ponto</span>}
          </p>
        </div>
      )}
    </div>
  )
}
