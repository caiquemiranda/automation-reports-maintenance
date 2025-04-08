import React from 'react';

function Home() {
  return (
    <div>
      <h2>Bem-vindo ao Sistema de Manutenção</h2>
      <p>Selecione uma opção no menu lateral para começar ou clique em um dos links rápidos abaixo.</p>

      <div className="quick-links">
        <div className="quick-link-card">
          <i className="fas fa-home"></i>
          <h3>Home</h3>
          <p>Página inicial com resumo de atividades</p>
          <a href="#/home">Acessar</a>
        </div>
        <div className="quick-link-card">
          <i className="fas fa-tools"></i>
          <h3>Ordens de Serviço</h3>
          <p>Gerenciar OS corretivas e preventivas</p>
          <a href="#/os-corretiva">Acessar</a>
        </div>
        <div className="quick-link-card">
          <i className="fas fa-map-marked-alt"></i>
          <h3>Mapa de Dispositivos</h3>
          <p>Visualizar e gerenciar dispositivos</p>
          <a href="#/dispositivos">Acessar</a>
        </div>
        <div className="quick-link-card">
          <i className="fas fa-chart-bar"></i>
          <h3>Análise de Dados</h3>
          <p>Visualizar métricas e indicadores</p>
          <a href="#/analise-dados">Acessar</a>
        </div>
      </div>
    </div>
  );
}

export default Home; 