import { useRef, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ZoomOut } from 'lucide-react'
import { CATEGORIES } from '../../lib/classify.js'
import { GRANULARITIES, MAX_BUCKETS } from '../../lib/aggregate.js'
import { fmtInt } from '../../lib/format.js'
import { bucketLabel, bucketTick } from '../../lib/timefmt.js'
import { CAT_UI, STACK_ORDER, activeCats } from '../ui/categoryUi.js'
import { Legend } from '../ui/Card.jsx'

const axis = { fontSize: 11, fill: 'var(--muted)' }

export function TimelineLegend({ series }) {
  return <Legend items={activeCats(series).map((c) => ({ key: c, label: CATEGORIES[c].label, color: CAT_UI[c].css }))} />
}

const spanOf = (series) => (series.length ? series.at(-1).key + series.gran.size - series[0].key : 0)

function TipBox({ active, payload, series }) {
  if (!active || !payload?.length) return null
  const b = payload[0].payload
  const rows = STACK_ORDER.map((c) => [c, b[c]]).filter(([, v]) => v > 0)
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold">{bucketLabel(b.key, series.gran)}</p>
      {rows.map(([c, v]) => (
        <p key={c} className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-sm" style={{ background: CAT_UI[c].css }} />
            {CATEGORIES[c].short}
          </span>
          <span className="tnum font-semibold">{fmtInt(v)}</span>
        </p>
      ))}
      {!rows.length && <p className="text-muted">Sem eventos</p>}
      {series.gran.key !== 'min' && <p className="mt-1 text-[11px] text-muted">Clique para aproximar</p>}
    </div>
  )
}

/** Escolha da escala (Auto, Semana … 1 min); escalas que gerariam barras demais ficam desabilitadas. */
export function GranularityPicker({ series, wanted, onChange, onZoomOut }) {
  const span = spanOf(series)
  const options = [{ key: 'auto', label: `Auto${wanted === 'auto' ? ` · ${series.gran.label}` : ''}` }, ...[...GRANULARITIES].reverse()].map((g) => ({
    ...g,
    fits: g.key === 'auto' || span / g.size <= MAX_BUCKETS,
  }))
  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      {onZoomOut && (
        <button type="button" onClick={onZoomOut} className="inline-flex h-7 items-center gap-1 rounded-md border border-line px-2 text-xs font-medium text-ink-2 hover:bg-surface-2">
          <ZoomOut size={13} aria-hidden="true" /> Afastar
        </button>
      )}
      {/* celular: lista; telas maiores: botões segmentados */}
      <select
        aria-label="Escala da linha do tempo"
        value={wanted || 'auto'}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 rounded-md border border-line bg-surface px-1.5 text-xs sm:hidden"
      >
        {options.map((g) => (
          <option key={g.key} value={g.key} disabled={!g.fits}>
            {g.label}
          </option>
        ))}
      </select>
      <div role="radiogroup" aria-label="Escala da linha do tempo" className="hidden overflow-hidden rounded-md border border-line text-xs sm:flex">
        {options.map((g) => {
          const fits = g.fits
          const on = (wanted || 'auto') === g.key
          return (
            <button
              key={g.key}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={!fits}
              title={fits ? undefined : 'Período longo demais para esta escala: aproxime antes'}
              onClick={() => onChange(g.key)}
              className={`h-7 whitespace-nowrap border-r border-line px-2 last:border-r-0 disabled:cursor-not-allowed disabled:opacity-35 ${on ? 'bg-accent font-semibold text-accent-ink' : 'hover:bg-surface-2'}`}
            >
              {g.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Barras empilhadas por categoria na escala escolhida.
 * Clique numa barra para aproximar naquele intervalo; arraste para selecionar vários.
 */
export function TimelineChart({ series, onPickRange }) {
  const cats = activeCats(series)
  const span = spanOf(series)
  const [drag, setDrag] = useState(null) // { a, b } índices
  const dragged = useRef(false)
  const idx = (state) => (state?.activeTooltipIndex === null || state?.activeTooltipIndex === undefined ? null : Number(state.activeTooltipIndex))

  // clique/toque direto na barra: traz o próprio dado, funciona sem hover (tablet/celular)
  const pickBar = (d) => {
    const i = series.findIndex((b) => b.key === d?.payload?.key)
    if (i >= 0 && series.gran.key !== 'min' && !dragged.current) pick(i, i)
  }

  const pick = (i, j) => {
    const lo = series[Math.min(i, j)]
    const hi = series[Math.max(i, j)]
    if (lo && hi) onPickRange?.(lo.key, hi.key + series.gran.size - 1)
  }

  return (
    <div role="img" aria-label={`Eventos por ${series.gran.label.toLowerCase()}, empilhados por categoria`} className="h-80 w-full cursor-crosshair select-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={series}
          margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
          barCategoryGap={series.length > 200 ? '0%' : '15%'}
          onMouseDown={(s) => {
            const i = idx(s)
            if (i !== null) setDrag({ a: i, b: i })
          }}
          onMouseMove={(s) => {
            const i = idx(s)
            if (drag && i !== null && i !== drag.b) setDrag({ ...drag, b: i })
          }}
          onMouseUp={() => {
            if (drag && drag.a !== drag.b) {
              dragged.current = true
              pick(drag.a, drag.b)
            }
            setDrag(null)
          }}
          onMouseLeave={() => setDrag(null)}
          onClick={(s) => {
            if (dragged.current) return void (dragged.current = false)
            const i = idx(s)
            if (i !== null && series.gran.key !== 'min') pick(i, i)
          }}
        >
          <CartesianGrid vertical={false} stroke="var(--line)" />
          <XAxis dataKey="key" tickFormatter={(k) => bucketTick(k, series.gran, span)} tick={axis} tickLine={false} axisLine={{ stroke: 'var(--line)' }} minTickGap={36} />
          <YAxis tick={axis} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip content={<TipBox series={series} />} cursor={{ fill: 'var(--surface-2)' }} isAnimationActive={false} />
          {cats.map((c, i) => (
            <Bar
              key={c}
              dataKey={c}
              stackId="s"
              fill={CAT_UI[c].css}
              stroke={series.length > 200 ? 'none' : 'var(--surface)'}
              strokeWidth={1}
              radius={i === cats.length - 1 && series.length <= 200 ? [3, 3, 0, 0] : 0}
              isAnimationActive={false}
              cursor={series.gran.key === 'min' ? 'default' : 'zoom-in'}
              onClick={pickBar}
            />
          ))}
          {drag && drag.a !== drag.b && (
            <ReferenceArea x1={series[Math.min(drag.a, drag.b)].key} x2={series[Math.max(drag.a, drag.b)].key} fill="var(--accent)" fillOpacity={0.12} stroke="var(--accent)" strokeOpacity={0.5} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TimelineTable({ series }) {
  const cats = activeCats(series)
  const rows = series.filter((b) => cats.some((c) => b[c] > 0))
  return (
    <div className="max-h-80 overflow-auto">
      <table className="w-full text-left text-xs">
        <thead className="sticky top-0 bg-surface text-muted">
          <tr>
            <th className="py-1.5 pr-3 font-medium">{series.gran.label}</th>
            {cats.map((c) => (
              <th key={c} className="py-1.5 pr-3 text-right font-medium">{CATEGORIES[c].short}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((b) => (
            <tr key={b.key}>
              <td className="tnum py-1 pr-3">{bucketLabel(b.key, series.gran)}</td>
              {cats.map((c) => (
                <td key={c} className="tnum py-1 pr-3 text-right">{b[c]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length < series.length && <p className="mt-2 text-[11px] text-muted">Intervalos sem eventos omitidos da tabela.</p>}
    </div>
  )
}
