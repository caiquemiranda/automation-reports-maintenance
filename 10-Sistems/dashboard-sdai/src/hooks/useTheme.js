import { useCallback, useState } from 'react'

const read = () => {
  try {
    return localStorage.getItem('sdai-theme')
  } catch {
    return null
  }
}

/** Alterna claro/escuro; sem escolha salva, segue o sistema. */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = read()
    if (saved) document.documentElement.dataset.theme = saved
    return saved
  })
  const isDark = theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches

  const toggle = useCallback(() => {
    const next = isDark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    setTheme(next)
    try {
      localStorage.setItem('sdai-theme', next)
    } catch {
      /* armazenamento indisponível: a preferência vale só nesta sessão */
    }
  }, [isDark])

  return { isDark, toggle }
}
