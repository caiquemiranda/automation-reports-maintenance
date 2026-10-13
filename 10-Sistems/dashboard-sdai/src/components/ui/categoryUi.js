import { Flame, CircleOff, Gauge, TriangleAlert, Info } from 'lucide-react'

/** Ícone + cor por categoria: a cor nunca carrega o significado sozinha. */
export const CAT_UI = {
  fire: { Icon: Flame, tint: 'tint-fire', bar: 'bg-fire', css: 'var(--c-fire)' },
  supervisory: { Icon: Gauge, tint: 'tint-supervisory', bar: 'bg-supervisory', css: 'var(--c-supervisory)' },
  device: { Icon: CircleOff, tint: 'tint-device', bar: 'bg-device', css: 'var(--c-device)' },
  trouble: { Icon: TriangleAlert, tint: 'tint-trouble', bar: 'bg-trouble', css: 'var(--c-trouble)' },
  info: { Icon: Info, tint: 'tint-info', bar: 'bg-info', css: 'var(--c-info)' },
}

/** Ordem de empilhamento nos gráficos (validada para separação CVD). */
export const STACK_ORDER = ['fire', 'supervisory', 'device', 'trouble', 'info']

/** Categorias com algum valor nas séries (evita legenda de série vazia). */
export const activeCats = (rows) => STACK_ORDER.filter((c) => rows.some((r) => r[c] > 0))
