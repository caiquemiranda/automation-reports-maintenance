// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Páginas
import Dashboard from './pages/Dashboard';
// OS Corretiva
import NovaOSCorretiva from './pages/corretiva/NovaOS';
import ConsultaOSCorretiva from './pages/corretiva/ConsultaOS';
// OS Planejada
import NovaOSPlanejada from './pages/planejada/NovaOS';
// Mapa de Sensores
import MapaSensores from './pages/MapaSensores';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          {/* Rotas OS Corretiva */}
          <Route path="/corretiva/nova" element={<NovaOSCorretiva />} />
          <Route path="/corretiva/consulta" element={<ConsultaOSCorretiva />} />

          {/* Rotas OS Planejada */}
          <Route path="/planejada/nova" element={<NovaOSPlanejada />} />

          {/* Mapa de Sensores */}
          <Route path="/mapa-sensores" element={<MapaSensores />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;