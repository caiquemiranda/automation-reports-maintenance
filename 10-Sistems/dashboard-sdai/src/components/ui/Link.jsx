import { navigate } from '../../lib/router.js'

/** <a> de verdade (abre em nova aba, copia link) com navegação sem recarregar. */
export default function Link({ to, onClick, children, ...rest }) {
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target) return
        e.preventDefault()
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
