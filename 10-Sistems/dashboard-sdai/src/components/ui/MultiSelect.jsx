import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

/**
 * Seleção múltipla em popover. `value` vazio significa "todos" (sem restrição),
 * então o estado inicial não precisa listar tudo e novos itens entram sozinhos.
 */
export default function MultiSelect({ label, options, value, onChange, searchable = false, width = 'w-64' }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const rootRef = useRef(null)
  const btnRef = useRef(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selected = useMemo(() => new Set(value), [value])
  const visible = useMemo(() => {
    const t = q.trim().toLowerCase()
    return t ? options.filter((o) => o.label.toLowerCase().includes(t)) : options
  }, [options, q])

  const toggle = (v) => onChange(selected.has(v) ? value.filter((x) => x !== v) : [...value, v])
  const summary = value.length === 0 ? 'Todos' : value.length === 1 ? options.find((o) => o.value === value[0])?.label : `${value.length} selecionados`

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] transition-colors hover:bg-surface-2 ${
          value.length ? 'border-accent bg-accent/10 text-ink' : 'border-line bg-surface text-ink-2'
        }`}
      >
        <span className="text-muted">{label}</span>
        <span className="max-w-32 truncate font-semibold text-ink">{summary}</span>
        <ChevronDown size={14} aria-hidden="true" className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div id={id} className={`absolute left-0 top-full z-40 mt-1.5 ${width} max-w-[calc(100vw-2rem)] rounded-xl border border-line bg-surface p-2 shadow-xl`}>
          {searchable && (
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Buscar ${label.toLowerCase()}…`}
              aria-label={`Buscar em ${label}`}
              className="mb-2 h-8 w-full rounded-md border border-line bg-surface-2 px-2.5 text-[13px] outline-none focus:border-accent"
            />
          )}
          <div className="mb-1 flex items-center justify-between px-1 text-xs">
            <button type="button" onClick={() => onChange([])} className="font-semibold text-accent hover:underline">
              Todos
            </button>
            <span className="text-muted">{value.length ? `${value.length} filtrando` : 'sem restrição'}</span>
          </div>
          <ul role="listbox" aria-multiselectable="true" aria-label={label} className="max-h-64 overflow-y-auto">
            {visible.map((o) => {
              const on = selected.has(o.value)
              return (
                <li key={o.value} role="option" aria-selected={on}>
                  <button
                    type="button"
                    onClick={() => toggle(o.value)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-surface-2"
                  >
                    <span
                      aria-hidden="true"
                      className={`grid size-4 shrink-0 place-items-center rounded border ${on ? 'border-accent bg-accent text-accent-ink' : 'border-line'}`}
                    >
                      {on && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{o.label}</span>
                    {o.count !== undefined && <span className="tnum text-xs text-muted">{o.count}</span>}
                  </button>
                </li>
              )
            })}
            {visible.length === 0 && <li className="px-2 py-3 text-center text-xs text-muted">Nada encontrado</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
