import { useEffect, useMemo, useState } from 'react'
import { Compass } from 'lucide-react'
import Sidebar from './components/layout/Sidebar.jsx'
import Topbar from './components/layout/Topbar.jsx'
import Link from './components/ui/Link.jsx'
import { EmptyState } from './components/ui/states.jsx'
import { btn } from './components/ui/styles.js'
import ClientsGrid from './pages/ClientsGrid.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import DatabasePage from './pages/DatabasePage.jsx'
import DbEventsPage from './pages/DbEventsPage.jsx'
import InvestigationPage from './pages/InvestigationPage.jsx'
import { ClientsContext } from './hooks/clients.js'
import { useAsync } from './hooks/useAsync.js'
import { useTheme } from './hooks/useTheme.js'
import { fetchClients } from './lib/api.js'
import { matchPath, navigate, useLocation } from './lib/router.js'
import { sectionByKey } from './lib/sections.js'

const readCollapsed = () => {
  try {
    return localStorage.getItem('sdai-sidebar') === 'collapsed'
  } catch {
    return false
  }
}

/** Resolve a rota em página + trilha de navegação. */
function resolve(path, clients) {
  const name = (slug) => clients.find((c) => c.slug === slug)?.name ?? slug
  const section = (key) => sectionByKey[key]
  let m
  if ((m = matchPath('/:section', path)) && section(m.section)) {
    const s = section(m.section)
    return { key: path, page: <ClientsGrid section={s} />, crumbs: [{ label: s.label }] }
  }
  if ((m = matchPath('/analytics/:slug/investigacao', path))) {
    return {
      key: `/analytics/${m.slug}/investigacao`,
      page: <InvestigationPage slug={m.slug} />,
      crumbs: [{ label: 'SDAI Analytics', to: '/analytics' }, { label: name(m.slug), to: `/analytics/${m.slug}` }, { label: 'Investigação de falhas' }],
    }
  }
  if ((m = matchPath('/banco/:slug/eventos', path))) {
    return {
      key: path,
      page: <DbEventsPage slug={m.slug} />,
      crumbs: [{ label: 'Banco de dados', to: '/banco' }, { label: name(m.slug), to: `/banco/${m.slug}` }, { label: 'Registros' }],
    }
  }
  if ((m = matchPath('/:section/:slug', path)) && section(m.section)) {
    const s = section(m.section)
    const Page = { analytics: AnalyticsPage, relatorios: ReportsPage, banco: DatabasePage }[s.key]
    return { key: path, page: <Page slug={m.slug} />, crumbs: [{ label: s.label, to: `/${s.key}` }, { label: name(m.slug) }] }
  }
  return {
    key: 'not-found',
    page: (
      <EmptyState
        icon={Compass}
        title="Página não encontrada"
        action={
          <Link to="/analytics" className={btn.primary}>
            Ir para o SDAI Analytics
          </Link>
        }
      >
        O endereço <code className="font-mono">{path}</code> não existe.
      </EmptyState>
    ),
    crumbs: [{ label: 'Página não encontrada' }],
  }
}

export default function App() {
  const { path } = useLocation()
  const { isDark, toggle } = useTheme()
  const clientsReq = useAsync(fetchClients, [])
  const clients = useMemo(
    () => ({ clients: clientsReq.data ?? [], loading: clientsReq.loading, error: clientsReq.error, reload: clientsReq.reload }),
    [clientsReq.data, clientsReq.loading, clientsReq.error, clientsReq.reload],
  )
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    if (path === '/') navigate('/analytics', { replace: true })
  }, [path])

  useEffect(() => {
    if (!drawer) return
    const onKey = (e) => e.key === 'Escape' && setDrawer(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawer])

  const route = resolve(path === '/' ? '/analytics' : path, clients.clients)
  useEffect(() => {
    document.title = [...route.crumbs].reverse().map((c) => c.label).join(' · ') + ' — IBSystems SDAI'
  }, [route.crumbs])

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem('sdai-sidebar', c ? 'expanded' : 'collapsed')
      } catch {
        /* preferência vale só nesta sessão */
      }
      return !c
    })
  }

  return (
    <ClientsContext.Provider value={clients}>
      <a href="#conteudo" className="sr-only z-50 rounded-md bg-accent px-3 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Pular para o conteúdo
      </a>
      <div className="flex min-h-screen">
        <aside className="no-print sticky top-0 hidden h-screen shrink-0 lg:block">
          <Sidebar path={path} collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
        </aside>

        {drawer && (
          <div className="no-print fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} aria-hidden="true" />
            <div className="animate-fade-in absolute inset-y-0 left-0 shadow-2xl">
              <Sidebar path={path} drawer onClose={() => setDrawer(false)} />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar crumbs={route.crumbs} onMenu={() => setDrawer(true)} isDark={isDark} onToggleTheme={toggle} />
          <main id="conteudo" tabIndex={-1} className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-5 outline-none sm:px-6">
            <div key={route.key} className="animate-fade-in">
              {route.page}
            </div>
          </main>
        </div>
      </div>
    </ClientsContext.Provider>
  )
}
