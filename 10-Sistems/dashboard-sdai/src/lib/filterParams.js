import { CATEGORY_ORDER } from './classify.js'
import { EMPTY_FILTERS } from './aggregate.js'

/**
 * Filtros do Analytics ⇄ query string, para que todo recorte seja um link
 * (favoritos, voltar/avançar, compartilhar com o colega exatamente o que se vê).
 *   ?de=2026-09-01&ate=2026-09-30&no=13,5&cat=fire&estado=BAD%20ANSWER&site=1&q=detector&op=1
 *   ?de=2026-09-17&hde=07:30&ate=2026-09-17&hate=12:15&dev=13:M1-38-0     (janela no dia + dispositivo)
 */
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/
const list = (v) => (v ? v.split(',').filter(Boolean) : [])
const ints = (v) => list(v).map(Number).filter(Number.isInteger)

export function filtersFromQuery(q) {
  const de = q.get('de') ?? ''
  const ate = q.get('ate') ?? ''
  return {
    ...EMPTY_FILTERS,
    from: DAY_RE.test(de) ? de : '',
    to: DAY_RE.test(ate) ? ate : '',
    tFrom: DAY_RE.test(de) && TIME_RE.test(q.get('hde') ?? '') ? q.get('hde') : '',
    tTo: DAY_RE.test(ate) && TIME_RE.test(q.get('hate') ?? '') ? q.get('hate') : '',
    devs: list(q.get('dev')),
    nodes: ints(q.get('no')),
    sites: ints(q.get('site')),
    cats: list(q.get('cat')).filter((c) => CATEGORY_ORDER.includes(c)),
    states: list(q.get('estado')),
    search: q.get('q') ?? '',
    hideInfo: q.get('op') !== '1',
  }
}

export function filtersToQuery(f) {
  return {
    de: f.from,
    hde: f.from ? f.tFrom : '',
    ate: f.to,
    hate: f.to ? f.tTo : '',
    dev: f.devs.join(','),
    no: f.nodes.join(','),
    site: f.sites.join(','),
    cat: f.cats.join(','),
    estado: f.states.join(','),
    q: f.search,
    op: f.hideInfo ? '' : '1',
  }
}
