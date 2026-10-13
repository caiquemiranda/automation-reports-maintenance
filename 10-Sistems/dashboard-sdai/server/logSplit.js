// Utilitários para simular "próximos downloads" do log a partir de um log.txt real.

const START_RE = /^\d+\s+\d{2}:\d{2}:\d{2}\s/

/** Separa o cabeçalho do relatório e os blocos de evento (linhas originais). */
export function splitLog(text) {
  const lines = text.split(/\r?\n/)
  const first = lines.findIndex((l) => START_RE.test(l))
  const header = lines.slice(0, first)
  const blocks = []
  for (const l of lines.slice(first)) {
    if (START_RE.test(l)) blocks.push([l])
    else if (l.trim()) blocks.at(-1).push(l)
  }
  return { header, blocks }
}

/** Divide os blocos em `n` partes contíguas de tamanho parecido. */
export function chunk(blocks, n) {
  const size = Math.ceil(blocks.length / n)
  return Array.from({ length: n }, (_, i) => blocks.slice(i * size, (i + 1) * size))
}

/** Monta o texto de um arquivo; com header = como o TSW exporta. */
export const toText = (blocks, header = null) => [...(header ?? []), ...blocks.flat()].join('\r\n') + '\r\n'

/** Corta o texto bruto em `n` partes por número de linhas (pode cair no meio de um evento). */
export function cutLines(text, n) {
  const lines = text.split(/\r?\n/)
  const size = Math.ceil(lines.length / n)
  return Array.from({ length: n }, (_, i) => lines.slice(i * size, (i + 1) * size).join('\r\n'))
}
