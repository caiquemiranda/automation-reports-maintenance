import { categorize } from './classify.js'

/**
 * Parser do "Entire Historical Log Report" do TSW (Simplex).
 *
 * Cada evento é um bloco de 2 a 5 linhas:
 *
 *   <seq>  <hh:mm:ss>  <descrição>
 *                      <continuação da descrição>        (opcional, 0..n)
 *         <DOW dd-MON-yy>   (NODE n)
 *                      <TIPO>        <ESTADO>            (opcional)
 *                      <detalhe livre>                   (raro: sistema/operador)
 *
 * `seq` é a numeração do TSW dentro de um volume do histórico ("VOLUME: <data>").
 * Uma passada só, sem regex sobre o texto inteiro (9 MB em ~0,2 s).
 */

const START_RE = /^(\d+)\s+(\d{2}):(\d{2}):(\d{2})\s+(.*)$/
const DATE_RE =
  /^\s+(?:MON|TUE|WED|THU|FRI|SAT|SUN)\s+(\d{1,2})-([A-Z]{3})-(\d{2})(?:\s+\(?NODE\s+(\d+)\)?)?/
// "13:M1-52-0 ...", "8:P212 ...", "3:1 COMMON TROUBLE...", "[INSTALL] 13:M1-52-0 ..."
const DEVICE_RE = /^(?:\[INSTALL\]\s+)?(\d{1,2}):(\S+)\s*(.*)$/
const HEADER_RE = /^(.+?)\s{2,}(\S+)\s+Node\s+(\d+)\s+Rev\s+(\d+)\s+\w{3}\s+(\d{1,2}-[A-Z]{3}-\d{2})\s+(\d{2}:\d{2}:\d{2})/
const VOLUME_RE = /^VOLUME:\s+\w{3}\s+(\d{1,2})-([A-Z]{3})-(\d{2})/
const TITLE_RE = /Historical Log Report|^-{20,}\s*$/

const MONTHS = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 }
const pad = (n) => (n < 10 ? '0' + n : '' + n)

/** Quebra "TIPO    ESTADO" (2+ espaços entre colunas). */
function splitColumns(line) {
  const parts = line.trim().split(/\s{2,}/)
  return parts.length === 2 ? parts : null
}

/**
 * Acrescenta os campos derivados (dia, hora, dispositivo, categoria).
 * `ts` é "relógio de parede" em UTC: o log não traz fuso, então nenhuma
 * conversão local acontece e os agrupamentos por dia/hora são estáveis.
 * Usado tanto pelo parser quanto pelos dados vindos do banco.
 */
export function enrich(e) {
  const d = new Date(e.ts)
  const dev = DEVICE_RE.exec(e.desc)
  const ev = {
    ...e,
    day: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
    hour: d.getUTCHours(),
    dow: d.getUTCDay(),
    dev: dev ? `${dev[1]}:${dev[2]}` : '',
    label: dev ? dev[3] : e.desc,
  }
  ev.cat = categorize(ev)
  return ev
}

export function buildEvent({ y, mo, d, h, mi, s, ...rest }) {
  return enrich({ ...rest, ts: Date.UTC(y, mo, d, h, mi, s) })
}

/**
 * @param {string} text conteúdo do log
 * @param {{raw?: boolean}} [opts] raw: guarda o bloco original em `ev.raw` (usado pelo banco)
 * @returns {{events: object[], meta: object|null, warnings: string[], incomplete: number[], orphanLines: number}}
 */
export function parseLog(text, { raw = false } = {}) {
  const events = []
  const warnings = []
  const incomplete = [] // seq de blocos sem linha de data (arquivo cortado no meio do evento)
  const lines = text.split(/\r?\n/)
  let meta = null
  let vol = null
  let orphanLines = 0 // linhas de evento antes do primeiro cabeçalho de bloco
  let block = null // { head, vol, desc[], date, detail[], lines[] }

  const flush = () => {
    if (!block) return
    const b = block
    block = null
    if (!b.date) {
      incomplete.push(b.head.id)
      return
    }
    let type = ''
    let state = ''
    let detail = ''
    if (b.detail.length === 1) {
      const cols = splitColumns(b.detail[0])
      if (cols && !cols[0].startsWith('OPERATOR:')) [type, state] = cols
      else detail = b.detail[0].trim()
    } else if (b.detail.length > 1) {
      detail = b.detail.map((l) => l.trim()).join(' ')
    }
    const ev = buildEvent({
      ...b.head,
      ...b.date,
      vol: b.vol,
      desc: b.desc.join(' ').replace(/\s+/g, ' ').trim(),
      type,
      state,
      detail,
    })
    if (raw) ev.raw = b.lines.join('\n')
    events.push(ev)
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    const m = START_RE.exec(line)
    if (m) {
      flush()
      block = {
        head: { id: +m[1], h: +m[2], mi: +m[3], s: +m[4] },
        vol,
        desc: [m[5]],
        date: null,
        detail: [],
        lines: raw ? [line.trimEnd()] : null,
      }
      continue
    }

    // Linhas do relatório (título, cabeçalho, volume) podem aparecer em qualquer ponto
    const v = VOLUME_RE.exec(line)
    if (v && MONTHS[v[2]] !== undefined) {
      flush()
      vol = `20${v[3]}-${pad(MONTHS[v[2]] + 1)}-${pad(+v[1])}`
      continue
    }
    const h = line.includes(' Rev ') ? HEADER_RE.exec(line) : null // pré-filtro: a regex é cara em linhas longas
    if (h) {
      flush()
      meta ??= { site: h[1].trim(), panel: h[2], node: +h[3], rev: +h[4], printed: `${h[5]} ${h[6]}` }
      continue
    }
    if (TITLE_RE.test(line)) {
      flush()
      continue
    }

    if (!block) {
      orphanLines++
      continue
    }
    if (raw) block.lines.push(line.trimEnd())

    if (!block.date) {
      const d = DATE_RE.exec(line)
      if (d && MONTHS[d[2]] !== undefined) {
        block.date = { d: +d[1], mo: MONTHS[d[2]], y: 2000 + +d[3], node: d[4] === undefined ? null : +d[4] }
      } else {
        block.desc.push(line.trim()) // descrição quebrada em 2+ linhas
      }
    } else {
      block.detail.push(line)
    }
  }
  flush()

  if (orphanLines) warnings.push(`O arquivo começa no meio de um evento: ${orphanLines} linha(s) iniciais sem cabeçalho foram ignoradas`)
  if (incomplete.length) warnings.push(`Evento(s) ${incomplete.join(', ')} sem linha de data (arquivo cortado?) — não importado(s)`)

  // Integridade: dentro de um volume os ids são sequenciais por construção do TSW.
  let gaps = 0
  for (let i = 1; i < events.length; i++) {
    if (events[i].vol === events[i - 1].vol && events[i].id !== events[i - 1].id + 1) gaps++
  }
  if (gaps) warnings.push(`${gaps} salto(s) na sequência de IDs — o log pode estar incompleto`)

  return { events, meta, warnings, incomplete, orphanLines }
}
