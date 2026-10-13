import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API = process.env.SDAI_API || 'http://localhost:3001'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // em dev, o backend (npm run server) responde em /api
    proxy: { '/api': API },
  },
  test: {
    testTimeout: 60000, // os testes de ingestão processam o log real várias vezes
  },
})
