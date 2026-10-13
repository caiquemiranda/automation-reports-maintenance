// Teste de alimentação incremental do banco com o log real.
//   npm run test:incremental [-- data/log.txt]
//
// 1. corta o log em 10 partes (data/partes/parte-01.txt … parte-10.txt)
// 2. importa as partes em ordem num banco novo → cada uma deve trazer só eventos novos
// 3. reimporta as 10 partes e o log inteiro → nada novo pode entrar
// 4. compara o banco com o log original: mesma quantidade, nenhum duplicado, nenhum ausente
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseLog } from '../src/lib/parser.js'
import { openDb, integrity, listEvents, getClient } from '../server/db.js'
import { ingestLog } from '../server/ingest.js'
import { splitLog, chunk, toText } from '../server/logSplit.js'

const LOG = process.argv[2] || 'data/log.txt'
const OUT = 'data/partes'
const DB = join(tmpdir(), `sdai-teste-${process.pid}.sqlite`)

const text = readFileSync(LOG, 'utf8')
const { header, blocks } = splitLog(text)
const parts = chunk(blocks, 10)

mkdirSync(OUT, { recursive: true })
const files = parts.map((p, i) => {
  const file = join(OUT, `parte-${String(i + 1).padStart(2, '0')}.txt`)
  writeFileSync(file, toText(p, i === 0 ? header : null)) // como um corte manual: só a 1ª parte tem o cabeçalho
  return file
})
console.log(`${LOG}: ${blocks.length} eventos → ${files.length} partes em ${OUT}/\n`)

const db = openDb(DB)
const CLIENT = 'bayer'
const clientId = getClient(db, CLIENT).id
let failures = 0
const check = (ok, msg) => {
  console.log(`${ok ? '✔' : '✖'} ${msg}`)
  if (!ok) failures++
}

console.log('1) Importando as partes em ordem')
const rows = files.map((f, i) => {
  const r = ingestLog(db, readFileSync(f, 'utf8'), { client: CLIENT, fileName: f })
  return { parte: i + 1, 'eventos no arquivo': r.parsed, novos: r.inserted, duplicados: r.duplicates, 'total no banco': r.dbTotal, avisos: r.warnings.length }
})
console.table(rows)
check(rows.every((r, i) => r.novos === parts[i].length && r.duplicados === 0), 'cada parte trouxe exatamente os seus eventos, todos novos')

console.log('\n2) Reimportando as 10 partes e o log inteiro')
const again = files.map((f) => ingestLog(db, readFileSync(f, 'utf8'), { client: CLIENT, fileName: f }))
const full = ingestLog(db, text, { client: CLIENT, fileName: LOG })
check(again.every((r) => r.inserted === 0) && full.inserted === 0, `nada novo entrou (${again.reduce((a, r) => a + r.duplicates, 0)} + ${full.duplicates} registros ignorados como já existentes)`)

console.log('\n3) Comparando o banco com o log original')
const key = (e) => JSON.stringify([e.vol, e.seq, e.ts, e.node, e.desc, e.type, e.state, e.detail])
const truth = parseLog(text).events.map((e) => key({ ...e, seq: e.id }))
const { columns, rows: dbRows } = listEvents(db, clientId)
const stored = dbRows.map((r) => key(Object.fromEntries(columns.map((c, i) => [c, r[i]]))))
const storedSet = new Set(stored)
const truthSet = new Set(truth)
check(stored.length === truth.length, `mesma quantidade: banco ${stored.length} × log ${truth.length}`)
check(storedSet.size === stored.length, `nenhum duplicado no banco (${stored.length - storedSet.size})`)
check(truth.every((k) => storedSet.has(k)), `nenhum registro ausente (${truth.filter((k) => !storedSet.has(k)).length})`)
check(stored.every((k) => truthSet.has(k)), `nenhum registro inventado (${stored.filter((k) => !truthSet.has(k)).length})`)
const integ = integrity(db, clientId)
check(integ.ok, `sequência do TSW sem buracos: ${integ.sites.flatMap((s) => s.volumes.map((v) => `${s.siteName} / volume ${v.vol} seq ${v.minSeq}–${v.maxSeq}`)).join(', ')}`)

db.close()
rmSync(DB, { force: true })
for (const ext of ['-wal', '-shm']) rmSync(DB + ext, { force: true })
console.log(failures ? `\n✖ ${failures} verificação(ões) falharam` : '\n✔ Banco alimentado só com registros novos: sem duplicados e sem ausentes.')
process.exit(failures ? 1 : 0)
