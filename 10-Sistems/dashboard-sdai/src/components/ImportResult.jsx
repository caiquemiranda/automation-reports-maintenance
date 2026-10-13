import { CircleCheck, TriangleAlert } from 'lucide-react'
import { fmtInt } from '../lib/format.js'

/** Resultado de uma importação: o que entrou, o que já existia, o que pede atenção. */
export default function ImportResult({ report }) {
  const { inserted, duplicates, completed, dbTotal, warnings, integrity, siteName, fileName } = report
  const attention = warnings.length > 0 || !integrity.ok

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        {attention ? (
          <TriangleAlert size={22} className="mt-0.5 shrink-0 text-[var(--t-device)]" aria-hidden="true" />
        ) : (
          <CircleCheck size={22} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
        )}
        <div>
          <p className="font-semibold">{attention ? 'Importado, com pontos de atenção' : 'Importação concluída'}</p>
          <p className="text-[13px] text-muted">
            {fileName} → {siteName}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center">
        {[
          ['Novos', inserted, 'gravados agora'],
          ['Já existiam', duplicates, 'ignorados'],
          ['Completados', completed, 'estavam cortados'],
        ].map(([label, value, hint]) => (
          <div key={label} className="rounded-lg border border-line px-2 py-2.5">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="tnum text-xl font-semibold">{fmtInt(value)}</dd>
            <dd className="text-[11px] text-muted">{hint}</dd>
          </div>
        ))}
      </dl>
      <p className="text-[13px] text-ink-2">
        O site agora tem <strong className="tnum">{fmtInt(dbTotal)}</strong> eventos armazenados.
      </p>

      {(!integrity.ok || warnings.length > 0) && (
        <ul className="flex flex-col gap-1.5 rounded-lg tint-device p-3 text-[13px]">
          {!integrity.ok && (
            <li>
              {fmtInt(integrity.missing)} registro(s) faltando na sequência do TSW
              {integrity.gaps.length > 0 && ` (seq ${integrity.gaps.slice(0, 5).map((g) => (g.from === g.to ? g.from : `${g.from}–${g.to}`)).join(', ')})`}. Importe um log que cubra esse
              trecho.
            </li>
          )}
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
