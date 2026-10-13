import { LayoutDashboard, SearchCheck } from 'lucide-react'
import Link from './ui/Link.jsx'

const TABS = [
  { key: 'geral', label: 'Visão geral', Icon: LayoutDashboard, path: '' },
  { key: 'investigacao', label: 'Investigação de falhas', Icon: SearchCheck, path: '/investigacao' },
]

/** Abas do Analytics de um cliente. */
export default function AnalyticsTabs({ slug, current }) {
  return (
    <nav aria-label="Visões do cliente" className="no-print -mt-1 flex gap-1 border-b border-line">
      {TABS.map(({ key, label, Icon, path }) => {
        const on = key === current
        return (
          <Link
            key={key}
            to={`/analytics/${slug}${path}`}
            aria-current={on ? 'page' : undefined}
            className={`-mb-px inline-flex h-10 items-center gap-1.5 border-b-2 px-3 text-[13px] font-medium ${on ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'}`}
          >
            <Icon size={15} aria-hidden="true" /> {label}
          </Link>
        )
      })}
    </nav>
  )
}
