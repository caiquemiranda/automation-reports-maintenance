import React from 'react';

function TopBar({ toggleSidebar, currentPage }) {
  // Função para obter o título da página
  const getPageTitle = () => {
    switch (currentPage) {
      case 'report-diario':
        return 'Report Diário de Falhas';
      case 'dashboard':
        return 'Dashboard';
      case 'ras':
        return 'RAS - Relatório Análise de Solução';
      case 'cronograma-anual':
        return 'Cronograma Anual';
      case 'cronograma-mensal':
        return 'Cronograma Mensal';
      case 'os-corretiva':
        return 'OS Corretiva';
      case 'os-planejada':
        return 'OS Planejada';
      case 'os-preventiva':
        return 'OS Preventiva';
      case 'historico-os':
        return 'Histórico de OS';
      case 'report-mensal':
        return 'Report Mensal';
      case 'dispositivos':
        return 'Mapa de Dispositivos';
      case 'analise-dados':
        return 'Análise de Dados';
      case 'dados-equipamentos':
        return 'Dados - Equipamentos';
      case 'dados-funcionarios':
        return 'Dados - Funcionários';
      case 'dados-relatorios':
        return 'Dados - Relatórios';
      case 'dados-exportacao':
        return 'Dados - Exportação';
      case 'home':
      default:
        return 'Home';
    }
  };

  return (
    <div className="top-bar">
      <div className="top-title">
        <h1>{getPageTitle()}</h1>
      </div>
      <div className="top-icons">
        <i className="fas fa-bars" id="sidebar-toggle" onClick={toggleSidebar}></i>
        <i className="fas fa-question-circle" id="help-icon"></i>
        <i className="fas fa-cog" id="settings-icon"></i>
        <i className="fas fa-user-circle" id="profile-icon"></i>
      </div>
    </div>
  );
}

export default TopBar; 