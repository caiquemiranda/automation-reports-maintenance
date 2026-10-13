import { useCallback, useEffect, useState } from 'react'

/**
 * Executa uma busca assíncrona e expõe { data, error, loading, reload }.
 * `loading` é derivado: a resposta guardada é de outra chave (deps) que não a atual.
 * Enquanto carrega, mantém os dados anteriores (a tela não "pisca" ao paginar/filtrar).
 * Respostas antigas que chegam depois são descartadas.
 */
export function useAsync(fn, deps) {
  const [tick, setTick] = useState(0)
  const key = JSON.stringify([...deps, tick])
  const [state, setState] = useState({ key: null, data: undefined, error: null })

  useEffect(() => {
    let alive = true
    fn().then(
      (data) => alive && setState({ key, data, error: null }),
      (error) => alive && setState({ key, data: undefined, error }),
    )
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  const loading = state.key !== key
  return { data: state.data, error: loading ? null : state.error, loading, reload }
}
