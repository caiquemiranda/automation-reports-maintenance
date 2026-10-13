import { useEffect, useId, useRef, useState } from 'react'
import { FileText, Loader2, MapPinPlus, ShieldX, UploadCloud, X } from 'lucide-react'
import ImportResult from './ImportResult.jsx'
import Link from './ui/Link.jsx'
import { btn } from './ui/styles.js'
import { uploadLog } from '../lib/api.js'

/**
 * Subir log para o banco de um cliente. Etapas: escolher → gravando → resultado.
 * Conflitos de painel/site viram perguntas, nunca importações silenciosas no lugar errado.
 */
export default function UploadDialog({ client, onClose, onImported }) {
  const [phase, setPhase] = useState('pick') // pick | uploading | done | error
  const [file, setFile] = useState(null)
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const [siteId, setSiteId] = useState('')
  const [over, setOver] = useState(false)
  const inputRef = useRef(null)
  const dialogRef = useRef(null)
  const titleId = useId()
  const busy = phase === 'uploading'

  // foco entra no diálogo e volta para quem o abriu; Esc fecha
  useEffect(() => {
    const opener = document.activeElement
    dialogRef.current?.focus()
    return () => opener?.focus?.()
  }, [])
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !busy && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [busy, onClose])

  const send = async (f, opts = {}) => {
    if (!f) return
    setFile(f)
    setPhase('uploading')
    try {
      const r = await uploadLog(client.slug, f, opts)
      setReport(r)
      setPhase('done')
      onImported(r)
    } catch (err) {
      setError(err)
      setPhase('error')
    }
  }

  const reset = () => {
    setPhase('pick')
    setError(null)
    setFile(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="animate-fade-in max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 shadow-2xl outline-none sm:max-w-lg sm:rounded-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="text-base font-semibold">
              Subir log · {client.name}
            </h2>
            <p className="text-[13px] text-muted">Só os registros novos entram; os que já existem são ignorados.</p>
          </div>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Fechar" className="grid size-8 shrink-0 place-items-center rounded-md hover:bg-surface-2 disabled:opacity-40">
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        {phase === 'pick' && (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setOver(true)
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setOver(false)
              send(e.dataTransfer.files?.[0])
            }}
            className={`rounded-xl border-2 border-dashed px-4 py-10 text-center ${over ? 'border-accent bg-accent/10' : 'border-line'}`}
          >
            <UploadCloud size={30} className="mx-auto mb-3 text-accent" aria-hidden="true" />
            <p className="text-sm">
              Arraste o <strong>Entire Historical Log Report</strong> (.txt) exportado do TSW
            </p>
            <button type="button" onClick={() => inputRef.current?.click()} className={`${btn.primary} mt-4`}>
              <FileText size={15} aria-hidden="true" /> Escolher arquivo
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".txt,.log"
              className="sr-only"
              aria-label="Arquivo de log do TSW"
              onChange={(e) => {
                send(e.target.files?.[0])
                e.target.value = ''
              }}
            />
          </div>
        )}

        {phase === 'uploading' && (
          <div role="status" aria-live="polite" className="py-10 text-center">
            <Loader2 size={34} className="mx-auto mb-3 animate-spin text-accent" aria-hidden="true" />
            <p className="font-semibold">Gravando {file?.name}…</p>
            <p className="mt-1 text-[13px] text-muted">Comparando com o histórico e gravando só o que é novo</p>
          </div>
        )}

        {phase === 'done' && report && (
          <>
            <ImportResult report={report} />
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={reset} className={btn.secondary}>
                Subir outro
              </button>
              <Link to={`/analytics/${client.slug}`} className={btn.primary}>
                Ver no Analytics
              </Link>
            </div>
          </>
        )}

        {phase === 'error' && error && (() => {
          // painel novo / site a escolher são perguntas, não erros
          const question = error.code === 'unknown-panel' || error.code === 'site-required'
          return (
          <div className="flex flex-col gap-4">
            <div role="alert" className={`flex items-start gap-3 rounded-lg p-3 text-[13px] ${question ? 'tint-device' : 'tint-fire'}`}>
              {error.code === 'unknown-panel' ? <MapPinPlus size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> : <ShieldX size={18} className="mt-0.5 shrink-0" aria-hidden="true" />}
              <span>{error.message}</span>
            </div>

            {error.code === 'site-required' && (
              <label className="flex flex-col gap-1.5 text-[13px]">
                Site de destino
                <select value={siteId} onChange={(e) => setSiteId(e.target.value)} className="h-9 rounded-lg border border-line bg-surface px-2">
                  <option value="">Escolha…</option>
                  {error.body.sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.source ? `(${s.source})` : ''}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" onClick={reset} className={btn.secondary}>
                Escolher outro arquivo
              </button>
              {error.code === 'unknown-panel' && (
                <button type="button" onClick={() => send(file, { createSite: true })} className={btn.primary}>
                  Cadastrar novo site e importar
                </button>
              )}
              {error.code === 'site-required' && (
                <button type="button" disabled={!siteId} onClick={() => send(file, { siteId: Number(siteId) })} className={btn.primary}>
                  Importar neste site
                </button>
              )}
            </div>
          </div>
          )
        })()}
      </div>
    </div>
  )
}
