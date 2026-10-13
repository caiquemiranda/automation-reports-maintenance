import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { parseLog } from './parser.js'
import { categorize } from './classify.js'
import { filterEvents, summarize, describeEvents, previousRange, EMPTY_FILTERS, delta } from './aggregate.js'
import { eventsToCsv } from './csv.js'

const SAMPLE = [
  'TSW                      Entire Historical Log Report',
  '',
  'MONSANTO    212TSW02   Node  19    Rev  37  MON 28-SEP-26    10:16:25',
  '----------------------------------------------------------------------',
  'VOLUME:  THU 27-NOV-25',
  '1      11:26:58        P83 HISTORICAL LOG VOLUME DELETED',
  '                       TROUBLE',
  '       THU 27-NOV-25   (NODE 19)',
  '                       TROUBLE POINT                           ABNORMAL',
  '2      11:26:59        TROUBLE GLOBAL ACKNOWLEDGE',
  '       THU 27-NOV-25   (NODE 19)',
  '3      11:27:02        RIGHT END',
  '       THU 27-NOV-25   NODE 0',
  '4      11:27:10        13:M1-38-0 MANUTENCAO DETECTOR 38',
  '       FRI 28-NOV-25   (NODE 13)',
  '                       SMOKE DETECTOR                          BAD ANSWER',
  '5      11:27:11        SYSTEM RESET REQUESTED',
  '       FRI 28-NOV-25',
  '6      22:22:06        AUTO-SHUTDOWN',
  '       THU 25-DEC-25   (NODE 19)',
  '                       OPERATOR: NO OPERATOR',
  '                       LICENSE STATE CHANGE DETECTED',
  '7      22:23:10        CRASH:  Fatal Operating System Error detected',
  '       THU 25-DEC-25   KERNELBASE.dll  76300000    0023:7642A892 NA NA(0)',
  '8      11:21:19        SOUND PROBLEM DETECTED',
  '       FRI 15-MAY-26   (NODE 19)',
  '                       Windows Volume level is too low (must be',
  '                       at least 80%).',
  '9      22:25:05        [INSTALL] 13:M1-52-0 ADDED TO INSTALL',
  '                       MODE',
  '       THU 25-DEC-25   (NODE 13)',
].join('\n')

describe('parseLog — formatos de bloco', () => {
  const { events, meta } = parseLog(SAMPLE)
  const byId = (id) => events.find((e) => e.id === id)

  it('lê o cabeçalho do relatório', () => {
    expect(meta).toMatchObject({ site: 'MONSANTO', panel: '212TSW02', node: 19, rev: 37 })
  })
  it('conta todos os eventos', () => {
    expect(events).toHaveLength(9)
  })
  it('descrição quebrada em 2 linhas antes da data', () => {
    expect(byId(1).desc).toBe('P83 HISTORICAL LOG VOLUME DELETED TROUBLE')
    expect(byId(9).desc).toBe('[INSTALL] 13:M1-52-0 ADDED TO INSTALL MODE')
  })
  it('tipo + estado separados por 2+ espaços', () => {
    expect(byId(1)).toMatchObject({ type: 'TROUBLE POINT', state: 'ABNORMAL', node: 19 })
  })
  it('bloco sem tipo/estado (acknowledge)', () => {
    expect(byId(2)).toMatchObject({ type: '', state: '', cat: 'info' })
  })
  it('"NODE 0" sem parênteses e data sem nó', () => {
    expect(byId(3).node).toBe(0)
    expect(byId(5).node).toBeNull()
  })
  it('extrai o endereço do dispositivo', () => {
    expect(byId(4)).toMatchObject({ dev: '13:M1-38-0', label: 'MANUTENCAO DETECTOR 38', cat: 'device' })
    expect(byId(9).dev).toBe('13:M1-52-0')
  })
  it('detalhe livre (operador/licença) não vira tipo/estado', () => {
    expect(byId(6)).toMatchObject({ type: '', state: '', detail: 'OPERATOR: NO OPERATOR LICENSE STATE CHANGE DETECTED' })
    expect(byId(8).detail).toContain('Windows Volume')
  })
  it('linha de data com lixo do SO (crash) mantém a data', () => {
    expect(byId(7)).toMatchObject({ day: '2025-12-25', node: null, cat: 'trouble' })
  })
  it('data/hora em relógio de parede, sem deslocamento de fuso', () => {
    expect(new Date(byId(1).ts).toISOString()).toBe('2025-11-27T11:26:58.000Z')
    expect(byId(4)).toMatchObject({ day: '2025-11-28', hour: 11, dow: 5 })
  })
  it('avisa sobre IDs fora de sequência', () => {
    const gap = SAMPLE.replace(/^2 {6}/m, '20     ')
    expect(parseLog(gap).warnings.join()).toMatch(/salto/)
  })
})

describe('categorize', () => {
  it.each([
    [{ type: 'SMOKE DETECTOR', state: 'FIRE ALARM', desc: '' }, 'fire'],
    [{ type: 'PULL STATION', state: 'FIRE ALARM', desc: '' }, 'fire'],
    [{ type: 'SMOKE DETECTOR', state: 'NO ANSWER', desc: '' }, 'device'],
    [{ type: 'SMOKE DETECTOR', state: 'HEAD MISSING', desc: '' }, 'device'],
    [{ type: 'SUPERVISORY MONITOR', state: 'ABNORMAL', desc: '' }, 'supervisory'],
    [{ type: 'SUPERVISORY MONITOR', state: 'OPEN CIRCUIT TROUBLE', desc: '' }, 'trouble'],
    [{ type: 'EARTH GROUND', state: 'TROUBLE', desc: '' }, 'trouble'],
    [{ type: 'NETWORK CARD STATUS', state: 'TROUBLE', desc: '' }, 'trouble'],
    [{ type: 'SYSTEM PSEUDO STATUS', state: 'TROUBLE', desc: '' }, 'info'],
    [{ type: 'UTILITY POINT', state: 'ON', desc: '' }, 'info'],
    [{ type: 'VISUAL', state: 'OFF', desc: '' }, 'info'],
    [{ type: '', state: '', desc: 'CRASH:  Fatal Operating System Error detected' }, 'trouble'],
    [{ type: '', state: '', desc: 'TROUBLE GLOBAL ACKNOWLEDGE' }, 'info'],
  ])('%j → %s', (ev, cat) => expect(categorize(ev)).toBe(cat))
})

describe('aggregate', () => {
  const { events } = parseLog(SAMPLE)
  const bounds = describeEvents(events)

  it('descreve limites do log', () => {
    expect(bounds).toMatchObject({ min: '2025-11-27', max: '2026-05-15' })
    expect(bounds.nodes).toEqual([-1, 0, 13, 19])
  })
  it('filtra por período inclusivo, nó e categoria', () => {
    const f = { ...EMPTY_FILTERS, hideInfo: false }
    expect(filterEvents(events, { ...f, from: '2025-11-28', to: '2025-11-28' })).toHaveLength(2)
    expect(filterEvents(events, { ...f, nodes: [13] })).toHaveLength(2)
    expect(filterEvents(events, { ...f, cats: ['device'] })).toHaveLength(1)
    expect(filterEvents(events, { ...f, nodes: [-1] }).map((e) => e.id)).toEqual([5, 7])
  })
  it('oculta operacional por padrão, mas não se a categoria for pedida', () => {
    expect(filterEvents(events, EMPTY_FILTERS).every((e) => e.cat !== 'info')).toBe(true)
    expect(filterEvents(events, { ...EMPTY_FILTERS, cats: ['info'] }).length).toBeGreaterThan(0)
  })
  it('busca por texto', () => {
    expect(filterEvents(events, { ...EMPTY_FILTERS, hideInfo: false, search: 'detector 38' })).toHaveLength(1)
  })
  it('summarize soma por categoria e preenche a série temporal sem buracos', () => {
    const s = summarize(events, EMPTY_FILTERS, bounds)
    expect(s.total).toBe(9)
    expect(Object.values(s.byCat).reduce((a, c) => a + c.count, 0)).toBe(9)
    expect(s.series.weekly).toBe(true)
    expect(s.series.reduce((a, b) => a + b.info + b.fire + b.device + b.supervisory + b.trouble, 0)).toBe(9)
    expect(s.heat.flat().reduce((a, b) => a + b, 0)).toBe(9)
  })
  it('período anterior tem o mesmo tamanho e some quando não há dados antes', () => {
    const f = { ...EMPTY_FILTERS, from: '2026-05-10', to: '2026-05-15' }
    const prev = previousRange(f, bounds)
    expect(new Date(prev.to).toISOString().slice(0, 10)).toBe('2026-05-09')
    expect(previousRange(EMPTY_FILTERS, bounds)).toBeNull()
  })
  it('delta', () => {
    expect(delta(150, 100)).toBe(50)
    expect(delta(5, 0)).toBeNull()
    expect(delta(0, 0)).toBe(0)
    expect(delta(5, null)).toBeNull()
  })
})

describe('csv', () => {
  it('exporta com BOM, ; e uma linha por evento', () => {
    const { events } = parseLog(SAMPLE)
    const csv = eventsToCsv(events.slice(0, 2))
    expect(csv.startsWith('﻿id;data_hora')).toBe(true)
    expect(csv.split('\r\n')).toHaveLength(3)
  })
})

const REAL = 'data/log.txt'
describe.skipIf(!existsSync(REAL))('log real (data/log.txt)', () => {
  const text = existsSync(REAL) ? readFileSync(REAL, 'utf8') : ''
  const { events, warnings } = parseLog(text)
  it('um evento por cabeçalho de bloco, sem avisos', () => {
    const headers = text.split(/\r?\n/).filter((l) => /^\d+\s+\d{2}:\d{2}:\d{2}/.test(l)).length
    expect(events).toHaveLength(headers)
    expect(warnings).toEqual([])
  })
  it('IDs únicos e datas válidas', () => {
    expect(new Set(events.map((e) => e.id)).size).toBe(events.length)
    expect(events.every((e) => Number.isFinite(e.ts))).toBe(true)
  })
  it('nenhum evento de campo fica sem tipo', () => {
    expect(events.filter((e) => !e.type && e.cat !== 'info' && !/CRASH|SHUTDOWN/.test(e.desc))).toEqual([])
  })
})
