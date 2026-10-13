import { useSyncExternalStore } from 'react'

/**
 * Roteador mínimo sobre a History API (sem dependência).
 * A URL é a fonte da verdade da navegação: telas e filtros viram links que podem
 * ser favoritados, compartilhados e navegados com voltar/avançar.
 */
const listeners = new Set()

function subscribe(fn) {
  listeners.add(fn)
  window.addEventListener('popstate', fn)
  return () => {
    listeners.delete(fn)
    window.removeEventListener('popstate', fn)
  }
}

const snapshot = () => window.location.pathname + window.location.search

/** scroll: volta ao topo (troca de página); filtros passam scroll: false para não pular a tela. */
export function navigate(to, { replace = false, scroll = !replace } = {}) {
  if (to === snapshot()) return
  window.history[replace ? 'replaceState' : 'pushState'](null, '', to)
  listeners.forEach((fn) => fn())
  if (scroll) window.scrollTo(0, 0)
}

export function useLocation() {
  const href = useSyncExternalStore(subscribe, snapshot)
  const url = new URL(href, window.location.origin)
  return { path: url.pathname.replace(/\/+$/, '') || '/', query: url.searchParams, href }
}

/** "/banco/:slug" × "/banco/bayer" → { slug: 'bayer' } | null */
export function matchPath(pattern, path) {
  const keys = []
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => (keys.push(k), '([^/]+)')) + '$')
  const m = re.exec(path)
  return m ? Object.fromEntries(keys.map((k, i) => [k, decodeURIComponent(m[i + 1])])) : null
}

/** Monta "?a=1&b=2" ignorando valores vazios. */
export function qs(params) {
  const s = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length)).map(([k, v]) => [k, String(v)])).toString()
  return s ? `?${s}` : ''
}
