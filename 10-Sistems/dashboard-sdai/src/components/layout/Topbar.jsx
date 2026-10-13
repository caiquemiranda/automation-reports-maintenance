import { ChevronRight, Menu, Moon, Sun } from 'lucide-react'
import Link from '../ui/Link.jsx'
import iconUrl from '../../assets/brand/ibsystems-icon.svg'

/** Barra superior: onde estou (breadcrumbs), menu no celular e tema. */
export default function Topbar({ crumbs, onMenu, isDark, onToggleTheme }) {
  return (
    <header className="no-print sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-line bg-surface/90 px-3 backdrop-blur sm:px-5">
      <button type="button" onClick={onMenu} aria-label="Abrir menu" className="grid size-9 place-items-center rounded-lg hover:bg-surface-2 lg:hidden">
        <Menu size={20} aria-hidden="true" />
      </button>
      <img src={iconUrl} alt="" className="size-7 lg:hidden" />

      <nav aria-label="Você está em" className="min-w-0 flex-1">
        <ol className="flex min-w-0 items-center gap-1 text-[13px]">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1
            return (
              <li key={c.label} className={`flex min-w-0 items-center gap-1 ${!last && crumbs.length > 2 ? 'max-sm:hidden' : ''}`}>
                {i > 0 && <ChevronRight size={14} aria-hidden="true" className="shrink-0 text-muted" />}
                {last || !c.to ? (
                  <span aria-current={last ? 'page' : undefined} className={`truncate ${last ? 'font-semibold text-ink' : 'text-muted'}`}>
                    {c.label}
                  </span>
                ) : (
                  <Link to={c.to} className="truncate text-muted hover:text-ink hover:underline">
                    {c.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
        className="grid size-9 place-items-center rounded-lg text-ink-2 hover:bg-surface-2"
      >
        {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
      </button>
    </header>
  )
}
