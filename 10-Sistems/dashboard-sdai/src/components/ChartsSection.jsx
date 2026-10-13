import { ChartCard } from './ui/Card.jsx'
import { GranularityPicker, TimelineChart, TimelineLegend, TimelineTable } from './charts/TimelineChart.jsx'
import { NodeChart, NodeTable } from './charts/NodeChart.jsx'
import { Heatmap } from './charts/Heatmap.jsx'

/** Carregado sob demanda (recharts é a maior parte do bundle). */
export default function ChartsSection({ summary, onPickNode, gran, onGranChange, onPickRange, onZoomOut }) {
  const { series, nodes, heat, heatMax } = summary
  if (!summary.total) return null
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
      <ChartCard
        className="xl:col-span-5"
        title="Eventos ao longo do tempo"
        subtitle={`Por ${series.gran.label.toLowerCase()} · clique numa barra para aproximar, arraste para selecionar um trecho`}
        toolbar={<GranularityPicker series={series} wanted={gran} onChange={onGranChange} onZoomOut={onZoomOut} />}
        legend={<TimelineLegend series={series} />}
        chart={<TimelineChart series={series} onPickRange={onPickRange} />}
        table={<TimelineTable series={series} />}
      />
      <ChartCard
        className="xl:col-span-2"
        title="Eventos por nó"
        subtitle="Clique em uma barra para filtrar o nó"
        legend={<TimelineLegend series={nodes} />}
        chart={<NodeChart nodes={nodes} onPickNode={onPickNode} />}
        table={<NodeTable nodes={nodes} onPickNode={onPickNode} />}
      />
      <ChartCard className="xl:col-span-3" title="Quando os eventos acontecem" subtitle="Dia da semana × hora do dia" chart={<Heatmap heat={heat} max={heatMax} />} />
    </div>
  )
}
