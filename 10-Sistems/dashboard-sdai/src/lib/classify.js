/**
 * Classificação dos eventos do TSW em categorias operacionais.
 * É o único lugar a editar se a regra de negócio mudar.
 */

export const CATEGORIES = {
  fire: {
    label: 'Alarme de incêndio',
    short: 'Incêndio',
    hint: 'Detector, acionador manual ou zona em FIRE ALARM',
  },
  device: {
    label: 'Falha de dispositivo',
    short: 'Dispositivo',
    hint: 'Sem resposta, resposta inválida ou cabeça do detector ausente',
  },
  supervisory: {
    label: 'Supervisão anormal',
    short: 'Supervisão',
    hint: 'Válvulas, chaves de fluxo e painéis supervisionados fora do normal',
  },
  trouble: {
    label: 'Falha de sistema',
    short: 'Falha',
    hint: 'Trouble de rede, terra, energia, circuito aberto, desabilitações',
  },
  info: {
    label: 'Operacional',
    short: 'Operacional',
    hint: 'Reconhecimentos, resets, sirenes ON/OFF e pontos de utilidade',
  },
}

export const CATEGORY_ORDER = ['fire', 'device', 'supervisory', 'trouble', 'info']

const DEVICE_STATES = new Set(['NO ANSWER', 'BAD ANSWER', 'HEAD MISSING', 'WRONG DEVICE'])
const NEUTRAL_STATES = new Set(['ON', 'OFF', 'RANGE NORMAL', ''])
/** Pontos "COMMON TROUBLE" agregados: repetem outros eventos, tratados como ruído. */
const AGGREGATE_TYPES = new Set(['SYSTEM PSEUDO STATUS'])
const SYSTEM_FAULT_RE = /\b(CRASH|AUTO-SHUTDOWN|SHUTDOWN)\b/

export function categorize({ type, state, desc }) {
  if (state === 'FIRE ALARM') return 'fire'
  if (DEVICE_STATES.has(state)) return 'device'
  if (AGGREGATE_TYPES.has(type)) return 'info'
  if (type === 'SUPERVISORY MONITOR' && state === 'ABNORMAL') return 'supervisory'
  if (!NEUTRAL_STATES.has(state) && state) return 'trouble'
  if (!type && SYSTEM_FAULT_RE.test(desc)) return 'trouble'
  return 'info'
}
