import { useCallback, useRef, useState } from 'react'

/**
 * Largura do elemento para gráficos SVG responsivos. Mede na hora em que o
 * elemento monta (não espera o 1º aviso do ResizeObserver) e acompanha mudanças.
 * Uso: const [ref, width] = useElementWidth(); <div ref={ref}>…
 */
export function useElementWidth() {
  const [width, setWidth] = useState(0)
  const observer = useRef(null)
  const ref = useCallback((node) => {
    observer.current?.disconnect()
    if (!node) return
    setWidth(Math.round(node.getBoundingClientRect().width))
    observer.current = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    observer.current.observe(node)
  }, [])
  return [ref, width]
}
