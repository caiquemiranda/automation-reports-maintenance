import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

/**
 * Banco SQLite (node:sqlite, sem dependências nativas).
 *
 * clientes → sites (um por painel/TSW) → eventos.
 * events guarda TODOS os registros do log, sem filtro: a análise do que vai
 * para o dashboard acontece na leitura (src/lib/classify.js + aggregate.js).
 *
 * Identidade de um evento (uid, única por site) = seq + data/hora + nó + descrição.
 *  - seq sozinho não basta: o TSW reinicia a numeração a cada volume do histórico;
 *  - o conteúdo sozinho não basta: há eventos legítimos idênticos no mesmo segundo
 *    (ex.: vários "TROUBLE GLOBAL ACKNOWLEDGE"), diferenciados só pelo seq.
 * tipo/estado/detalhe ficam fora da chave para que um evento cortado no fim de um
 * arquivo possa ser completado quando o próximo log chegar.
 */
const VERSION = 2

const SCHEMA = `
CREATE TABLE IF NOT EXISTS clients (
  id    INTEGER PRIMARY KEY,
  slug  TEXT NOT NULL UNIQUE,
  name  TEXT NOT NULL,
  sort  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sites (
  id         INTEGER PRIMARY KEY,
  client_id  INTEGER NOT NULL REFERENCES clients(id),
  name       TEXT NOT NULL,
  source     TEXT UNIQUE,           -- "<site> · <painel>" do cabeçalho do TSW: um painel pertence a um só cliente
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS imports (
  id          INTEGER PRIMARY KEY,
  site_id     INTEGER NOT NULL REFERENCES sites(id),
  file_name   TEXT    NOT NULL,
  file_sha1   TEXT    NOT NULL,
  imported_at TEXT    NOT NULL,
  meta        TEXT,                 -- cabeçalho do relatório (site, painel, nó, rev)
  parsed      INTEGER NOT NULL,     -- eventos lidos do arquivo
  inserted    INTEGER NOT NULL,     -- novos no banco
  duplicates  INTEGER NOT NULL,     -- já existentes (ignorados)
  completed   INTEGER NOT NULL,     -- existentes que estavam incompletos e foram completados
  seq_offset  INTEGER NOT NULL DEFAULT 0, -- renumeração detectada no arquivo
  first_ts    INTEGER,
  last_ts     INTEGER,
  warnings    TEXT    NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS events (
  id        INTEGER PRIMARY KEY,
  site_id   INTEGER NOT NULL REFERENCES sites(id),
  uid       TEXT    NOT NULL,
  ckey      TEXT    NOT NULL,       -- data/hora + nó + descrição (sem seq): detecta renumeração
  vol       TEXT,                   -- volume do histórico (YYYY-MM-DD) ou NULL se desconhecido
  seq       INTEGER NOT NULL,       -- número do evento no TSW
  ts        INTEGER NOT NULL,       -- epoch ms, relógio de parede do painel
  node      INTEGER,
  descr     TEXT    NOT NULL,
  type      TEXT    NOT NULL DEFAULT '',
  state     TEXT    NOT NULL DEFAULT '',
  detail    TEXT    NOT NULL DEFAULT '',
  raw       TEXT    NOT NULL,       -- bloco original, para reprocessar no futuro
  import_id INTEGER NOT NULL REFERENCES imports(id),
  UNIQUE (site_id, uid)
);
CREATE INDEX IF NOT EXISTS events_site_ts      ON events(site_id, ts);
CREATE INDEX IF NOT EXISTS events_site_ckey    ON events(site_id, ckey);
CREATE INDEX IF NOT EXISTS events_site_vol_seq ON events(site_id, vol, seq);
`

export const CLIENTS = [
  ['vinci-airports', 'Vinci Airports'],
  ['vedacit', 'Vedacit'],
  ['bridgestone', 'Bridgestone'],
  ['bayer', 'Bayer'],
  ['boulevard-shopping', 'Boulevard Shopping'],
]

const columns = (db, table) => db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name)

/** v1 (um log só, sem clientes) → v2: todo o histórico existente é da Bayer. */
function migrateV1(db) {
  const meta = db.prepare('SELECT meta FROM imports ORDER BY id DESC LIMIT 1').get()?.meta
  const m = meta ? JSON.parse(meta) : null
  db.exec('ALTER TABLE events RENAME TO events_v1; ALTER TABLE imports RENAME TO imports_v1;')
  db.exec(SCHEMA)
  seedClients(db)
  const bayer = db.prepare("SELECT id FROM clients WHERE slug = 'bayer'").get().id
  const site = Number(
    db
      .prepare('INSERT INTO sites (client_id, name, source, created_at) VALUES (?, ?, ?, ?)')
      .run(bayer, m?.site ?? 'Site principal', m ? `${m.site} · ${m.panel}` : null, new Date().toISOString()).lastInsertRowid,
  )
  db.exec(`
    INSERT INTO imports SELECT id, ${site}, file_name, file_sha1, imported_at, meta, parsed, inserted, duplicates, completed, seq_offset, first_ts, last_ts, warnings FROM imports_v1;
    INSERT INTO events SELECT id, ${site}, uid, ckey, vol, seq, ts, node, descr, type, state, detail, raw, import_id FROM events_v1;
    DROP TABLE events_v1; DROP TABLE imports_v1;
  `)
}

function seedClients(db) {
  const insert = db.prepare('INSERT INTO clients (slug, name, sort) VALUES (?, ?, ?) ON CONFLICT(slug) DO NOTHING')
  CLIENTS.forEach(([slug, name], i) => insert.run(slug, name, i))
}

export function openDb(path = process.env.SDAI_DB || 'db/sdai.sqlite') {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true })
  const db = new DatabaseSync(path)
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA synchronous = NORMAL;')
  transaction(db, () => {
    const v = db.prepare('PRAGMA user_version').get().user_version
    if (v < 2 && columns(db, 'events').length && !columns(db, 'events').includes('site_id')) migrateV1(db)
    db.exec(SCHEMA)
    seedClients(db)
    db.exec(`PRAGMA user_version = ${VERSION}`)
  })
  return db
}

/** Executa fn numa transação; desfaz tudo se algo falhar. */
export function transaction(db, fn) {
  db.exec('BEGIN')
  try {
    const out = fn()
    db.exec('COMMIT')
    return out
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}

// ── Clientes e sites ────────────────────────────────────────────────────────

export const getClient = (db, slug) => db.prepare('SELECT * FROM clients WHERE slug = ?').get(slug) ?? null
export const listSites = (db, clientId) =>
  db
    .prepare('SELECT id, name, source, created_at AS createdAt, (SELECT COUNT(*) FROM events WHERE site_id = sites.id) AS events FROM sites WHERE client_id = ? ORDER BY id')
    .all(clientId)

function clientSummary(db, c) {
  const s = db
    .prepare('SELECT COUNT(*) AS events, MIN(ts) AS firstTs, MAX(ts) AS lastTs FROM events e JOIN sites s ON s.id = e.site_id WHERE s.client_id = ?')
    .get(c.id)
  const last = db
    .prepare('SELECT i.* FROM imports i JOIN sites s ON s.id = i.site_id WHERE s.client_id = ? ORDER BY i.id DESC LIMIT 1')
    .get(c.id)
  return { slug: c.slug, name: c.name, sites: listSites(db, c.id), ...s, lastImport: last ? importRow(last) : null }
}

export function listClients(db) {
  return db.prepare('SELECT * FROM clients ORDER BY sort, name').all().map((c) => clientSummary(db, c))
}

export function clientDetail(db, client) {
  const sum = clientSummary(db, client)
  const check = integrity(db, client.id)
  return { ...sum, integrity: { ok: check.ok, missing: check.sites.reduce((a, s) => a + s.volumes.reduce((b, v) => b + v.missing, 0), 0) } }
}

export function stats(db) {
  return db.prepare('SELECT COUNT(*) AS events, (SELECT COUNT(*) FROM imports) AS imports, (SELECT COUNT(*) FROM clients) AS clients FROM events').get()
}

// ── Importações ─────────────────────────────────────────────────────────────

export function listImports(db, clientId, limit = 50) {
  return db
    .prepare(
      `SELECT i.*, s.name AS site_name FROM imports i JOIN sites s ON s.id = i.site_id
       WHERE s.client_id = ? ORDER BY i.id DESC LIMIT ?`,
    )
    .all(clientId, limit)
    .map(importRow)
}

function importRow(r) {
  return {
    id: r.id,
    siteId: r.site_id,
    siteName: r.site_name,
    fileName: r.file_name,
    importedAt: r.imported_at,
    meta: r.meta ? JSON.parse(r.meta) : null,
    parsed: r.parsed,
    inserted: r.inserted,
    duplicates: r.duplicates,
    completed: r.completed,
    seqOffset: r.seq_offset,
    firstTs: r.first_ts,
    lastTs: r.last_ts,
    warnings: JSON.parse(r.warnings),
  }
}

// ── Eventos ─────────────────────────────────────────────────────────────────

export const EVENT_COLUMNS = ['id', 'site', 'seq', 'ts', 'node', 'desc', 'type', 'state', 'detail', 'vol']

/** Todos os eventos do cliente em formato colunar (compacto), para o Analytics. */
export function listEvents(db, clientId, { from = -8.64e15, to = 8.64e15 } = {}) {
  const rows = db
    .prepare(
      `SELECT e.id, e.site_id, e.seq, e.ts, e.node, e.descr, e.type, e.state, e.detail, e.vol
       FROM events e JOIN sites s ON s.id = e.site_id
       WHERE s.client_id = ? AND e.ts BETWEEN ? AND ? ORDER BY e.ts, e.site_id, e.vol, e.seq`,
    )
    .all(clientId, from, to)
  return {
    columns: EVENT_COLUMNS,
    rows: rows.map((r) => [r.id, r.site_id, r.seq, r.ts, r.node, r.descr, r.type, r.state, r.detail, r.vol]),
  }
}

/** Página de eventos com busca, para o navegador do banco (escala para milhões de linhas). */
export function listEventsPage(db, clientId, { page = 0, size = 50, q = '', siteId = null, order = 'desc' } = {}) {
  const where = ['s.client_id = ?']
  const args = [clientId]
  if (siteId) {
    where.push('e.site_id = ?')
    args.push(siteId)
  }
  if (q) {
    where.push("(e.descr LIKE ? ESCAPE '\\' OR e.type LIKE ? ESCAPE '\\' OR e.state LIKE ? ESCAPE '\\' OR CAST(e.seq AS TEXT) = ?)")
    const like = `%${q.replace(/[\\%_]/g, (c) => '\\' + c)}%`
    args.push(like, like, like, q)
  }
  const sql = `FROM events e JOIN sites s ON s.id = e.site_id WHERE ${where.join(' AND ')}`
  const total = db.prepare(`SELECT COUNT(*) AS n ${sql}`).get(...args).n
  const dir = order === 'asc' ? 'ASC' : 'DESC'
  const rows = db
    .prepare(
      `SELECT e.id, e.site_id AS site, s.name AS siteName, e.seq, e.vol, e.ts, e.node, e.descr AS "desc", e.type, e.state, e.detail, e.raw, e.import_id AS importId
       ${sql} ORDER BY e.ts ${dir}, e.seq ${dir} LIMIT ? OFFSET ?`,
    )
    .all(...args, size, page * size)
  return { total, page, size, rows }
}

// ── Integridade ─────────────────────────────────────────────────────────────

/**
 * Integridade por site e volume: o TSW numera os eventos em sequência, então todo
 * buraco na sequência é um registro que nunca chegou ao banco.
 */
export function integrity(db, clientId) {
  const sites = listSites(db, clientId)
  const out = sites.map((site) => {
    const volumes = db
      .prepare(
        `SELECT vol, COUNT(*) AS events, MIN(seq) AS minSeq, MAX(seq) AS maxSeq, MIN(ts) AS firstTs, MAX(ts) AS lastTs
         FROM events WHERE site_id = ? GROUP BY vol ORDER BY MIN(ts)`,
      )
      .all(site.id)
    const gaps = db
      .prepare(
        `SELECT vol, seq + 1 AS fromSeq, nxt - 1 AS toSeq FROM (
           SELECT vol, seq, LEAD(seq) OVER (PARTITION BY vol ORDER BY seq) AS nxt FROM events WHERE site_id = ?
         ) WHERE nxt > seq + 1 ORDER BY vol, seq`,
      )
      .all(site.id)
    const conflicts = db
      .prepare('SELECT vol, seq, COUNT(*) AS n FROM events WHERE site_id = ? GROUP BY vol, seq HAVING COUNT(*) > 1 ORDER BY vol, seq LIMIT 50')
      .all(site.id)
    return {
      siteId: site.id,
      siteName: site.name,
      volumes: volumes.map((v) => ({
        ...v,
        missing: v.maxSeq - v.minSeq + 1 - v.events,
        gaps: gaps.filter((g) => g.vol === v.vol).map(({ fromSeq, toSeq }) => [fromSeq, toSeq]),
      })),
      conflicts, // mesmo seq com conteúdos diferentes no mesmo volume: renumeração não detectada
    }
  })
  return { sites: out, ok: out.every((s) => s.conflicts.length === 0 && s.volumes.every((v) => v.missing === 0)) }
}
