// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Páginas
import Dashboard from './pages/Dashboard';
// OS Corretiva
import NovaOSCorretiva from './pages/corretiva/NovaOS';
import ConsultaOSCorretiva from './pages/corretiva/ConsultaOS';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          {/* Rotas OS Corretiva */}
          <Route path="/corretiva/nova" element={<NovaOSCorretiva />} />
          <Route path="/corretiva/consulta" element={<ConsultaOSCorretiva />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;