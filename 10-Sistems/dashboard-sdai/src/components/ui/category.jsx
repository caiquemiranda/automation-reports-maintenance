import { CATEGORIES } from '../../lib/classify.js'
import { CAT_UI } from './categoryUi.js'

export function CategoryBadge({ cat, compact = false }) {
  const { Icon, tint } = CAT_UI[cat]
  const meta = CATEGORIES[cat]
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${tint}`}>
      <Icon size={12} aria-hidden="true" />
      {compact ? meta.short : meta.label}
    </span>
  )
}
