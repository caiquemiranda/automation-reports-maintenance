import { createHash } from 'node:crypto'
import { parseLog } from '../src/lib/parser.js'
import { getClient, integrity, listSites, transaction } from './db.js'

const hash = (s) => createHash('sha1').update(s).digest('base64url')
const HOUR = 3600000
const RENUMBER_MIN_MATCHES = 20
const MAX_SEQ_DISTANCE = 1000

/** Erro de importação que a API/CLI apresenta ao usuário (com código para a UI decidir o que oferecer). */
export class IngestError extends Error {
  constructor(status, code, message, extra = {}) {
    super(message)
    Object.assign(this, { status, code, extra })
  }
}

const identity = (e) => {
  e.ckey = hash(`${e.ts}|${e.node ?? ''}|${e.desc}`)
  e.uid = hash(`${e.id}|${e.ckey}`)
}

/** Quanto do evento é conhecido: um bloco cortado no fim do arquivo tem menos campos. */
const completeness = (e) => (e.type ? 1 : 0) + (e.state ? 1 : 0) + (e.detail ? 1 : 0) + e.raw.split('\n').length

/**
 * Descobre em qual site (painel) gravar. O cabeçalho do TSW identifica o painel
 * ("MONSANTO · 212TSW02"), e um painel pertence a um único cliente — isso impede
 * misturar o log de um cliente no histórico de outro.
 */
function resolveSite(db, client, meta, { siteId, createSite }) {
  const sites = listSites(db, client.id)
  const source = meta ? `${meta.site} · ${meta.panel}` : null

  if (source) {
    const known = db.prepare('SELECT s.*, c.name AS client_name FROM sites s JOIN clients c ON c.id = s.client_id WHERE s.source = ?').get(source)
    if (known && known.client_id !== client.id) {
      throw new IngestError(409, 'other-client', `Este log é do painel ${source}, que pertence ao cliente ${known.client_name}. Nada foi importado.`)
    }
    if (known) return known.id
    if (siteId) {
      const chosen = sites.find((s) => s.id === siteId)
      if (!chosen) throw new IngestError(400, 'bad-site', 'Site inválido para este cliente.')
      if (chosen.source && chosen.source !== source) {
        throw new IngestError(409, 'site-mismatch', `O site "${chosen.name}" é o painel ${chosen.source}, mas este log é do painel ${source}.`)
      }
      db.prepare('UPDATE sites SET source = ? WHERE id = ?').run(source, chosen.id)
      return chosen.id
    }
    if (!sites.length || createSite) {
      return Number(
        db.prepare('INSERT INTO sites (client_id, name, source, created_at) VALUES (?, ?, ?, ?)').run(client.id, meta.site, source, new Date().toISOString())
          .lastInsertRowid,
      )
    }
    throw new IngestError(409, 'unknown-panel', `O painel ${source} ainda não está cadastrado em ${client.name}. Confirme se é um novo site deste cliente.`, {
      source,
      sites,
    })
  }

  // arquivo sem cabeçalho (ex.: cortado à mão): só dá para saber o site se o usuário disser ou se houver um só
  if (siteId && sites.some((s) => s.id === siteId)) return siteId
  if (sites.length === 1) return sites[0].id
  throw new IngestError(409, 'site-required', 'O arquivo não tem o cabeçalho do TSW. Escolha em qual site gravar.', { sites })
}

/**
 * Se o TSW renumerar o histórico (ex.: buffer circular), o mesmo evento chega com
 * outro seq. Detecta um deslocamento constante entre o arquivo e o banco usando
 * eventos com mesma data/hora + nó + descrição. Exige muitos instantes distintos
 * para não confundir com grupos de eventos idênticos no mesmo segundo.
 */
function detectRenumbering(db, siteId, events) {
  const uidExists = db.prepare('SELECT 1 FROM events WHERE site_id = ? AND uid = ?')
  const byCkey = db.prepare('SELECT seq, vol FROM events WHERE site_id = ? AND ckey = ?')
  const votes = new Map()
  for (const e of events) {
    if (uidExists.get(siteId, e.uid)) continue
    for (const r of byCkey.all(siteId, e.ckey)) {
      const k = r.seq - e.id
      if (k === 0) continue
      let v = votes.get(k)
      if (!v) votes.set(k, (v = { offset: k, vol: r.vol, instants: new Set() }))
      v.instants.add(e.ts)
    }
  }
  let best = null
  for (const v of votes.values()) if (!best || v.instants.size > best.instants.size) best = v
  return best && best.instants.size >= RENUMBER_MIN_MATCHES ? best : null
}

/**
 * Arquivos sem a linha "VOLUME:" (ex.: um log cortado à mão) herdam o volume do
 * evento vizinho na sequência que já está no banco.
 */
function fillUnknownVolumes(db, siteId) {
  const rows = db.prepare('SELECT seq, ts FROM events WHERE site_id = ? AND vol IS NULL ORDER BY seq, ts').all(siteId)
  if (!rows.length) return 0
  const runs = []
  for (const r of rows) {
    const run = runs.at(-1)
    if (run && r.seq === run.end + 1) {
      run.end = r.seq
      run.lastTs = r.ts
    } else runs.push({ start: r.seq, end: r.seq, firstTs: r.ts, lastTs: r.ts })
  }
  // Vizinho conhecido mais próximo no tempo, antes ou depois do trecho, desde que
  // perto na sequência (o vizinho imediato pode ter se perdido num corte).
  const before = db.prepare('SELECT vol, seq FROM events WHERE site_id = ? AND vol IS NOT NULL AND seq < ? AND ts <= ? ORDER BY ts DESC, seq DESC LIMIT 1')
  const after = db.prepare('SELECT vol, seq FROM events WHERE site_id = ? AND vol IS NOT NULL AND seq > ? AND ts >= ? ORDER BY ts, seq LIMIT 1')
  const update = db.prepare('UPDATE events SET vol = ? WHERE site_id = ? AND vol IS NULL AND seq BETWEEN ? AND ?')
  let filled = 0
  for (const run of runs) {
    let n = before.get(siteId, run.start, run.firstTs + HOUR)
    if (!n || run.start - n.seq > MAX_SEQ_DISTANCE) n = after.get(siteId, run.end, run.lastTs - HOUR)
    if (n && Math.min(Math.abs(run.start - n.seq), Math.abs(n.seq - run.end)) <= MAX_SEQ_DISTANCE) {
      filled += Number(update.run(n.vol, siteId, run.start, run.end).changes)
    }
  }
  return filled
}

/**
 * Importa um log do TSW para um cliente: insere só o que ainda não existe, ignora
 * duplicados, completa eventos que tinham chegado cortados. Tudo numa transação.
 *
 * @param {object} opts
 * @param {string} opts.client      slug do cliente
 * @param {string} [opts.fileName]
 * @param {number} [opts.siteId]    site escolhido pelo usuário (quando o cabeçalho não basta)
 * @param {boolean} [opts.createSite] confirma criar um site novo para um painel desconhecido
 */
export function ingestLog(db, text, { client: slug, fileName = 'log.txt', siteId = null, createSite = false }) {
  const t0 = performance.now()
  const client = getClient(db, slug)
  if (!client) throw new IngestError(404, 'no-client', `Cliente "${slug}" não existe.`)

  const parsed = parseLog(text, { raw: true })
  const { events } = parsed
  if (!events.length) {
    throw new IngestError(422, 'no-events', 'Nenhum evento reconhecido. Envie o "Entire Historical Log Report" exportado do TSW.')
  }
  const warnings = [...parsed.warnings]
  const fileSha1 = hash(text)
  for (const e of events) identity(e)

  return transaction(db, () => {
    const site = resolveSite(db, client, parsed.meta, { siteId, createSite })
    const before = db.prepare('SELECT COUNT(*) AS n, MAX(ts) AS lastTs FROM events WHERE site_id = ?').get(site)
    const alreadyImported = !!db.prepare('SELECT 1 FROM imports WHERE site_id = ? AND file_sha1 = ?').get(site, fileSha1)

    const renumber = before.n ? detectRenumbering(db, site, events) : null
    if (renumber) {
      for (const e of events) {
        e.id += renumber.offset
        e.vol = renumber.vol
        identity(e)
      }
      warnings.push(`Numeração do TSW deslocada em ${renumber.offset} em relação ao banco — eventos realinhados antes de comparar`)
    }

    let firstTs = events[0].ts
    let lastTs = events[0].ts
    for (const e of events) {
      if (e.ts < firstTs) firstTs = e.ts
      if (e.ts > lastTs) lastTs = e.ts
    }
    // o 1º evento do arquivo continua a sequência de algo que já está no banco?
    const continues = !!db.prepare('SELECT 1 FROM events WHERE site_id = ? AND seq = ? AND ts <= ? LIMIT 1').get(site, events[0].id - 1, events[0].ts + HOUR)

    const importId = Number(
      db
        .prepare(
          `INSERT INTO imports (site_id, file_name, file_sha1, imported_at, meta, parsed, inserted, duplicates, completed, seq_offset, first_ts, last_ts)
           VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0, ?, ?, ?)`,
        )
        .run(site, fileName, fileSha1, new Date().toISOString(), parsed.meta ? JSON.stringify(parsed.meta) : null, events.length, renumber?.offset ?? 0, firstTs, lastTs)
        .lastInsertRowid,
    )

    const find = db.prepare('SELECT id, vol, type, state, detail, raw FROM events WHERE site_id = ? AND uid = ?')
    const insert = db.prepare(
      `INSERT INTO events (site_id, uid, ckey, vol, seq, ts, node, descr, type, state, detail, raw, import_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    const complete = db.prepare('UPDATE events SET type = ?, state = ?, detail = ?, raw = ?, vol = COALESCE(vol, ?) WHERE id = ?')
    const setVol = db.prepare('UPDATE events SET vol = ? WHERE id = ? AND vol IS NULL')

    let inserted = 0
    let duplicates = 0
    let completed = 0
    for (const e of events) {
      const cur = find.get(site, e.uid)
      if (!cur) {
        insert.run(site, e.uid, e.ckey, e.vol, e.id, e.ts, e.node, e.desc, e.type, e.state, e.detail, e.raw, importId)
        inserted++
      } else if (completeness(e) > completeness(cur)) {
        complete.run(e.type, e.state, e.detail, e.raw, e.vol, cur.id)
        completed++
      } else {
        if (cur.vol === null && e.vol) setVol.run(e.vol, cur.id)
        duplicates++
      }
    }
    const volumesFilled = fillUnknownVolumes(db, site)

    if (before.n && inserted && !duplicates && !completed && !continues && firstTs > before.lastTs - HOUR) {
      const fmt = (ts) => new Date(ts).toISOString().slice(0, 16).replace('T', ' ')
      warnings.push(
        `Nenhum registro em comum com o banco e a numeração não continua do último evento conhecido: confira se não ficou um período sem baixar entre ${fmt(before.lastTs)} e ${fmt(firstTs)}`,
      )
    }

    db.prepare('UPDATE imports SET inserted = ?, duplicates = ?, completed = ?, warnings = ? WHERE id = ?').run(
      inserted,
      duplicates,
      completed,
      JSON.stringify(warnings),
      importId,
    )

    const check = integrity(db, client.id).sites.find((s) => s.siteId === site)
    return {
      importId,
      client: client.slug,
      siteId: site,
      siteName: db.prepare('SELECT name FROM sites WHERE id = ?').get(site).name,
      fileName,
      fileSha1,
      alreadyImported,
      meta: parsed.meta,
      parsed: events.length,
      inserted,
      duplicates,
      completed,
      volumesFilled,
      seqOffset: renumber?.offset ?? 0,
      firstTs,
      lastTs,
      warnings,
      dbTotal: db.prepare('SELECT COUNT(*) AS n FROM events WHERE site_id = ?').get(site).n,
      integrity: {
        ok: check.conflicts.length === 0 && check.volumes.every((v) => v.missing === 0),
        missing: check.volumes.reduce((a, v) => a + v.missing, 0),
        gaps: check.volumes.flatMap((v) => v.gaps.map((g) => ({ vol: v.vol, from: g[0], to: g[1] }))).slice(0, 20),
      },
      ms: Math.round(performance.now() - t0),
    }
  })
}
