import { useState } from 'react'
import { ChevronRight, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import Link from '../ui/Link.jsx'
import { SECTIONS } from '../../lib/sections.js'
import { useClients } from '../../hooks/clients.js'
import logoUrl from '../../assets/brand/ibsystems-logo.svg'
import iconUrl from '../../assets/brand/ibsystems-icon.svg'

/**
 * Navegação principal: áreas → clientes. Em telas grandes é fixa (recolhível em
 * trilho de ícones); em telas pequenas abre como gaveta sobre o conteúdo.
 */
export default function Sidebar({ path, collapsed = false, onToggleCollapse, drawer = false, onClose }) {
  const { clients } = useClients()
  const [, section, slug] = path.split('/')
  const [open, setOpen] = useState(() => ({ [section]: true }))
  const isOpen = (key) => open[key] ?? key === section
  const narrow = collapsed && !drawer

  return (
    <nav
      aria-label="Navegação principal"
      className={`flex h-full flex-col border-r border-line bg-surface ${narrow ? 'w-16' : 'w-64'} transition-[width] duration-200`}
    >
      <div className={`flex h-14 shrink-0 items-center border-b border-line ${narrow ? 'justify-center px-2' : 'justify-between pl-4 pr-2'}`}>
        <Link to="/analytics" onClick={onClose} className="flex items-center rounded-md" aria-label="IBSystems — início">
          {narrow ? <img src={iconUrl} alt="" className="size-8" /> : <img src={logoUrl} alt="IBSystems Intelligent Building" className="h-7 w-auto" />}
        </Link>
        {drawer && (
          <button type="button" onClick={onClose} aria-label="Fechar menu" className="grid size-9 place-items-center rounded-lg hover:bg-surface-2">
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <ul className="thin-scroll flex-1 space-y-0.5 overflow-y-auto p-2">
        {SECTIONS.map(({ key, label, Icon }) => {
          const active = section === key
          const expanded = isOpen(key)
          return (
            <li key={key}>
              <div className={`group flex items-center rounded-lg ${active && !slug ? 'bg-accent/10' : 'hover:bg-surface-2'}`}>
                {!narrow && (
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`nav-${key}`}
                    aria-label={`${expanded ? 'Recolher' : 'Expandir'} clientes de ${label}`}
                    onClick={() => setOpen((o) => ({ ...o, [key]: !expanded }))}
                    className="grid size-8 shrink-0 place-items-center rounded-md text-muted hover:text-ink"
                  >
                    <ChevronRight size={15} aria-hidden="true" className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
                  </button>
                )}
                <Link
                  to={`/${key}`}
                  onClick={onClose}
                  title={narrow ? label : undefined}
                  aria-current={active && !slug ? 'page' : undefined}
                  className={`flex min-w-0 flex-1 items-center gap-2.5 py-2 text-[14px] ${narrow ? 'justify-center px-0' : 'pr-2'} ${
                    active ? 'font-semibold text-ink' : 'text-ink-2'
                  }`}
                >
                  <Icon size={18} aria-hidden="true" className={active ? 'text-accent' : 'text-muted'} />
                  {narrow ? <span className="sr-only">{label}</span> : <span className="truncate">{label}</span>}
                </Link>
              </div>

              {!narrow && expanded && (
                <ul id={`nav-${key}`} className="mb-1 ml-[15px] mt-0.5 space-y-px border-l border-line pl-3">
                  {clients.map((c) => {
                    const current = active && slug === c.slug
                    return (
                      <li key={c.slug}>
                        <Link
                          to={`/${key}/${c.slug}`}
                          onClick={onClose}
                          aria-current={current ? 'page' : undefined}
                          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] ${
                            current ? 'bg-accent/10 font-semibold text-ink' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`size-1.5 shrink-0 rounded-full ${c.events ? 'bg-accent' : 'border border-muted'}`}
                          />
                          <span className="truncate">{c.name}</span>
                          {!c.events && <span className="sr-only">(sem dados)</span>}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>

      {!drawer && (
        <div className={`border-t border-line p-2 ${narrow ? 'flex justify-center' : ''}`}>
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
            className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-[13px] text-muted hover:bg-surface-2 hover:text-ink"
          >
            {collapsed ? <PanelLeftOpen size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />}
            {!collapsed && 'Recolher'}
          </button>
        </div>
      )}
    </nav>
  )
}
