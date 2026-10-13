// Backend leve do SDAI: API + banco SQLite + (em produção) o dashboard compilado.
//   npm run server   → API em http://localhost:3001 (o Vite faz proxy de /api em dev)
//   npm start        → API + dist/ (rode npm run build antes)
import { openDb, stats } from './db.js'
import { createApp } from './app.js'

const PORT = Number(process.env.PORT || 3001)
const HOST = process.env.HOST || '127.0.0.1' // sem autenticação: só a máquina local, a menos que HOST diga o contrário
const DB = process.env.SDAI_DB || 'db/sdai.sqlite'

const db = openDb(DB)
createApp({ db }).listen(PORT, HOST, () => {
  console.log(`SDAI backend em http://${HOST}:${PORT}  ·  banco: ${DB} (${stats(db).events} eventos)`)
})
