import { ChartNoAxesColumn, Database, FileBarChart } from 'lucide-react'

/** Áreas do sistema (sidebar). Cada uma abre os cards de clientes e depois a tela do cliente. */
export const SECTIONS = [
  {
    key: 'analytics',
    label: 'SDAI Analytics',
    Icon: ChartNoAxesColumn,
    intro: 'Escolha o cliente para abrir o painel de alarmes, falhas e supervisão.',
    cta: 'Abrir dashboard',
  },
  {
    key: 'relatorios',
    label: 'Relatórios',
    Icon: FileBarChart,
    intro: 'Resumo mês a mês de cada cliente, base do relatório gerencial.',
    cta: 'Ver relatórios',
  },
  {
    key: 'banco',
    label: 'Banco de dados',
    Icon: Database,
    intro: 'Histórico armazenado de cada cliente: importações, integridade e registros.',
    cta: 'Gerenciar dados',
  },
]

export const sectionByKey = Object.fromEntries(SECTIONS.map((s) => [s.key, s]))
