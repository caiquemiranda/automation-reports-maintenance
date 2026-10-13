// Valida o parser JS contra o log real e contra o CSV gerado pelo etl.py.
//   node scripts/validate-log.mjs [data/log.txt] [data/eventos_sdai_completo.csv]
import { readFileSync, existsSync } from 'node:fs'
import { parseLog } from '../src/lib/parser.js'

const [logPath = 'data/log.txt', csvPath = 'data/eventos_sdai_completo.csv'] = process.argv.slice(2)
const t0 = performance.now()
const { events, meta, warnings } = parseLog(readFileSync(logPath, 'utf8'))
const ms = Math.round(performance.now() - t0)

const eventLines = readFileSync(logPath, 'utf8').split(/\r?\n/).filter((l) => /^\d+\s+\d{2}:\d{2}:\d{2}/.test(l)).length
let failures = 0
const check = (ok, msg) => { console.log(`${ok ? 'OK  ' : 'FAIL'} ${msg}`); if (!ok) failures++ }

console.log(`Parse: ${events.length} eventos em ${ms} ms`, meta)
check(events.length === eventLines, `um evento por linha de cabeçalho (${events.length} / ${eventLines})`)
check(new Set(events.map((e) => e.id)).size === events.length, 'IDs únicos')
check(warnings.length === 0, `sem avisos do parser ${warnings.length ? JSON.stringify(warnings) : ''}`)
check(events.every((e) => Number.isFinite(e.ts)), 'todo evento tem data/hora válida')
const states = new Set(events.map((e) => e.state))
console.log('estados:', [...states].join(' | '))
const noType = events.filter((e) => !e.type && e.cat !== 'info' && !/CRASH|SHUTDOWN/.test(e.desc))
check(noType.length === 0, `eventos sem tipo só são operacionais (${noType.length})`)
const days = events.map((e) => e.day).sort()
console.log(`período: ${days[0]} → ${days.at(-1)}`)
console.log('por categoria:', Object.entries(events.reduce((a, e) => ((a[e.cat] = (a[e.cat] || 0) + 1), a), {})))

if (existsSync(csvPath)) {
  const Papa = (await import('papaparse')).default
  const rows = Papa.parse(readFileSync(csvPath, 'utf8'), { header: true, skipEmptyLines: true }).data
  check(rows.length === events.length, `CSV do Python tem o mesmo nº de linhas (${rows.length})`)
  const diff = { datetime: [], node: [], type: [], state: [], desc: [] }
  const byId = new Map(events.map((e) => [e.id, e]))
  for (const r of rows) {
    const e = byId.get(+r.id)
    if (!e) continue
    const dt = new Date(e.ts).toISOString().slice(0, 19).replace('T', ' ')
    if (dt !== r.datetime) diff.datetime.push(r.id)
    if ((e.node ?? '') !== (r.node === '' ? '' : Math.round(+r.node))) diff.node.push(r.id)
    if (e.type !== r.type && !(e.type === '' && r.type === '')) diff.type.push(r.id)
    if (e.state !== r.state && !(e.state === '' && r.state === '')) diff.state.push(r.id)
    if (e.desc !== r.description) diff.desc.push(r.id)
  }
  for (const [k, v] of Object.entries(diff)) console.log(`  divergência ${k}: ${v.length}`, v.slice(0, 8).join(','))
}
process.exit(failures ? 1 : 0)
