import { useState } from 'react'
import { Card } from './ui/Card.jsx'
import { CAT_UI } from './ui/categoryUi.js'
import { CATEGORIES } from '../lib/classify.js'
import { fmtDateTime, fmtInt, fmtNode } from '../lib/format.js'

const TABS = ['fire', 'device', 'supervisory', 'trouble']
const PAGE = 10

/** Ranking de reincidência: quais pontos mais geraram eventos em cada categoria. */
export default function OffendersPanel({ offenders, onPickDevice }) {
  const [tab, setTab] = useState('fire')
  const [shown, setShown] = useState(PAGE)
  const rows = offenders[tab]
  const max = rows[0]?.count || 1
  const { bar } = CAT_UI[tab]

  const pick = (t) => {
    setTab(t)
    setShown(PAGE)
  }

  return (
    <Card title="Reincidência por ponto" subtitle="Dispositivos e pontos que mais geraram eventos no recorte atual">
      <div role="tablist" aria-label="Categoria" className="no-print mt-3 flex gap-1 overflow-x-auto px-5">
        {TABS.map((t) => {
          const { Icon } = CAT_UI[t]
          const on = t === tab
          return (
            <button
              key={t}
              role="tab"
              type="button"
              id={`tab-${t}`}
              aria-selected={on}
              aria-controls="offenders-panel"
              onClick={() => pick(t)}
              className={`inline-flex h-9 shrink-0 items-center gap-1.5 border-b-2 px-3 text-[13px] font-medium ${
                on ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              <Icon size={14} aria-hidden="true" />
              {CATEGORIES[t].short}
              <span className="tnum rounded-full bg-surface-2 px-1.5 text-[11px]">{fmtInt(offenders[t].length)}</span>
            </button>
          )
        })}
      </div>

      <div id="offenders-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="border-t border-line">
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted">Nenhum registro de “{CATEGORIES[tab].label.toLowerCase()}” neste recorte.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-[13px]">
              <thead className="text-xs text-muted">
                <tr className="border-b border-line">
                  <th className="w-10 py-2 pl-5 font-medium">#</th>
                  <th className="py-2 pr-3 font-medium">Ponto</th>
                  <th className="py-2 pr-3 font-medium">Descrição</th>
                  <th className="py-2 pr-3 font-medium">Estado</th>
                  <th className="w-44 py-2 pr-3 font-medium">Ocorrências</th>
                  <th className="py-2 pr-3 font-medium">Primeira</th>
                  <th className="py-2 pr-5 font-medium">Última</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.slice(0, shown).map((r, i) => {
                  const topState = Object.entries(r.states).sort((a, b) => b[1] - a[1])[0]?.[0]
                  const nStates = Object.keys(r.states).length
                  return (
                    <tr key={r.key} className="hover:bg-surface-2">
                      <td className="tnum py-2 pl-5 text-muted">{i + 1}</td>
                      <td className="py-2 pr-3">
                        <button
                          type="button"
                          onClick={() => onPickDevice(r.dev || r.label)}
                          title={r.dev ? 'Analisar este dispositivo' : 'Filtrar o log por este ponto'}
                          className="whitespace-nowrap text-left font-mono text-xs font-semibold text-accent hover:underline"
                        >
                          {r.dev || '—'}
                        </button>
                        <div className="text-[11px] text-muted">{fmtNode(r.node)}</div>
                      </td>
                      <td className="max-w-md py-2 pr-3">
                        <div className="truncate" title={r.label}>{r.label}</div>
                        <div className="text-[11px] text-muted">{r.type || 'Sistema'}</div>
                      </td>
                      <td className="py-2 pr-3">
                        <span className="whitespace-nowrap text-xs font-medium">{topState || '—'}</span>
                        {nStates > 1 && <span className="ml-1 text-[11px] text-muted">+{nStates - 1}</span>}
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="tnum w-10 text-right font-semibold">{fmtInt(r.count)}</span>
                          <span className="h-2 flex-1 rounded-full bg-surface-2" aria-hidden="true">
                            <span className={`block h-full rounded-full ${bar}`} style={{ width: `${Math.max(3, (r.count / max) * 100)}%` }} />
                          </span>
                        </div>
                      </td>
                      <td className="tnum whitespace-nowrap py-2 pr-3 text-xs text-ink-2">{fmtDateTime(r.first)}</td>
                      <td className="tnum whitespace-nowrap py-2 pr-5 text-xs text-ink-2">{fmtDateTime(r.last)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {rows.length > shown && (
          <div className="no-print flex justify-center border-t border-line py-2.5">
            <button type="button" onClick={() => setShown((s) => s + 20)} className="h-8 rounded-md px-3 text-[13px] font-medium text-accent hover:bg-accent/10">
              Mostrar mais ({fmtInt(rows.length - shown)} restantes)
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
