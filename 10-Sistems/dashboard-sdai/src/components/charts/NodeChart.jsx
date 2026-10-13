import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CATEGORIES } from '../../lib/classify.js'
import { fmtInt, fmtNode } from '../../lib/format.js'
import { CAT_UI, STACK_ORDER, activeCats } from '../ui/categoryUi.js'

const axis = { fontSize: 11, fill: 'var(--muted)' }

function TipBox({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold">
        {fmtNode(d.node)} · <span className="tnum">{fmtInt(d.total)}</span> eventos
      </p>
      {STACK_ORDER.filter((c) => d[c] > 0).map((c) => (
        <p key={c} className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-sm" style={{ background: CAT_UI[c].css }} />
            {CATEGORIES[c].short}
          </span>
          <span className="tnum font-semibold">{fmtInt(d[c])}</span>
        </p>
      ))}
      <p className="mt-1 text-muted">Clique para filtrar este nó</p>
    </div>
  )
}

export function NodeChart({ nodes, onPickNode }) {
  const cats = activeCats(nodes)
  const data = nodes.map((n) => ({ ...n, name: fmtNode(n.node) }))
  return (
    <div role="img" aria-label="Eventos por nó, empilhados por categoria" style={{ height: Math.max(180, data.length * 26 + 24) }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }} barCategoryGap="22%">
          <CartesianGrid horizontal={false} stroke="var(--line)" />
          <XAxis type="number" tick={axis} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={{ ...axis, fill: 'var(--ink-2)' }} tickLine={false} axisLine={false} width={58} interval={0} />
          <Tooltip content={<TipBox />} cursor={{ fill: 'var(--surface-2)' }} isAnimationActive={false} />
          {cats.map((c, i) => (
            <Bar
              key={c}
              dataKey={c}
              stackId="n"
              fill={CAT_UI[c].css}
              stroke="var(--surface)"
              strokeWidth={1}
              radius={i === cats.length - 1 ? [0, 3, 3, 0] : 0}
              cursor="pointer"
              isAnimationActive={false}
              onClick={(d) => onPickNode(d.node)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function NodeTable({ nodes, onPickNode }) {
  const cats = activeCats(nodes)
  return (
    <div className="max-h-80 overflow-auto">
      <table className="w-full text-left text-xs">
        <thead className="sticky top-0 bg-surface text-muted">
          <tr>
            <th className="py-1.5 pr-3 font-medium">Nó</th>
            {cats.map((c) => (
              <th key={c} className="py-1.5 pr-3 text-right font-medium">{CATEGORIES[c].short}</th>
            ))}
            <th className="py-1.5 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {nodes.map((n) => (
            <tr key={n.node}>
              <td className="py-1 pr-3">
                <button type="button" onClick={() => onPickNode(n.node)} className="font-medium text-accent hover:underline">{fmtNode(n.node)}</button>
              </td>
              {cats.map((c) => (
                <td key={c} className="tnum py-1 pr-3 text-right">{n[c]}</td>
              ))}
              <td className="tnum py-1 text-right font-semibold">{n.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
