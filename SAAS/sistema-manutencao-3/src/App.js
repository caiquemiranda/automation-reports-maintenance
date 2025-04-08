import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import ReportDiario from './pages/ReportDiario';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Verificar a rota no carregamento e quando mudar de página
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };

    // Configurar no carregamento inicial
    handleHashChange();

    // Adicionar listener para mudanças na hash
    window.addEventListener('hashchange', handleHashChange);

    // Limpar o listener quando o componente for desmontado
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Renderizar o componente correspondente à página atual
  const renderPage = () => {
    switch (currentPage) {
      case 'report-diario':
        return <ReportDiario />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="container">
      <TopBar toggleSidebar={toggleSidebar} currentPage={currentPage} />
      <Sidebar collapsed={sidebarCollapsed} />
      <div className={`main-content ${sidebarCollapsed ? 'main-content-expanded' : ''}`}>
        <div className="content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
