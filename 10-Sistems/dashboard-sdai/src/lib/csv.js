// Exportação do recorte filtrado do Analytics (os dados entram pelo banco, não por CSV).

const esc = (v) => {
  const s = String(v ?? '')
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Exporta o recorte filtrado (abre direto no Excel pt-BR: BOM + ';'). */
export function eventsToCsv(events) {
  const head = ['id', 'data_hora', 'no', 'categoria', 'tipo', 'estado', 'dispositivo', 'descricao']
  const rows = events.map((e) =>
    [
      e.id,
      new Date(e.ts).toISOString().slice(0, 19).replace('T', ' '),
      e.node ?? '',
      e.cat,
      e.type,
      e.state,
      e.dev,
      e.label,
    ]
      .map(esc)
      .join(';'),
  )
  return '﻿' + [head.join(';'), ...rows].join('\r\n')
}
