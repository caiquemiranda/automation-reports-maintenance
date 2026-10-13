import { createContext, useContext } from 'react'

/** Lista de clientes (com totais do banco), compartilhada por sidebar e páginas. */
export const ClientsContext = createContext({ clients: [], loading: true, error: null, reload: () => {} })

export const useClients = () => useContext(ClientsContext)

export const useClient = (slug) => {
  const ctx = useClients()
  return { ...ctx, client: ctx.clients.find((c) => c.slug === slug) ?? null }
}
