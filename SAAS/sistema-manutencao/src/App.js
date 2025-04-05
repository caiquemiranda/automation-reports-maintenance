// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Páginas
import Dashboard from './pages/Dashboard';
// OS Corretiva
import NovaOSCorretiva from './pages/corretiva/NovaOS';
import ConsultaOSCorretiva from './pages/corretiva/ConsultaOS';
import OSPendentesCorretiva from './pages/corretiva/OSPendentes';
// OS Planejada
import NovaOSPlanejada from './pages/planejada/NovaOS';
import ConsultaOSPlanejada from './pages/planejada/ConsultaOS';
import CalendarioOSPlanejada from './pages/planejada/Calendario';
// Relatórios
import RelatorioMensal from './pages/relatorios/RelatorioMensal';
import RelatorioTecnico from './pages/relatorios/RelatorioTecnico';
import RelatorioEquipamento from './pages/relatorios/RelatorioEquipamento';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          {/* Rotas OS Corretiva */}
          <Route path="/corretiva/nova" element={<NovaOSCorretiva />} />
          <Route path="/corretiva/consulta" element={<ConsultaOSCorretiva />} />
          <Route path="/corretiva/pendentes" element={<OSPendentesCorretiva />} />
          
          {/* Rotas OS Planejada */}
          <Route path="/planejada/nova" element={<NovaOSPlanejada />} />
          <Route path="/planejada/consulta" element={<ConsultaOSPlanejada />} />
          <Route path="/planejada/calendario" element={<CalendarioOSPlanejada />} />
          
          {/* Rotas Relatórios */}
          <Route path="/relatorios/mensal" element={<RelatorioMensal />} />
          <Route path="/relatorios/tecnico" element={<RelatorioTecnico />} />
          <Route path="/relatorios/equipamento" element={<RelatorioEquipamento />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;