import React, { useState, useEffect } from 'react';

function Home() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('pt-BR', options));

      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="welcome-section">
        <h2>Bem-vindo ao Sistema de Manutenção</h2>
        <p>Hoje é {currentDate} | {currentTime}</p>
        <p>Você tem 5 ordens de serviço pendentes e 3 eventos agendados para esta semana.</p>
      </div>

      <div className="card-container">
        <div className="info-card">
          <h3><i className="fas fa-exclamation-circle"></i> Alertas de Prazos</h3>
          <div className="alert-item alert-high">
            <a href="#/os-corretiva">
              <strong>OS-2024-011</strong> - Manutenção no CLP Linha de Produção
              <div className="date"><i className="fas fa-clock"></i> Vence em 2 dias</div>
            </a>
          </div>
          <div className="alert-item alert-high">
            <a href="#/os-preventiva">
              <strong>OS-2024-015</strong> - Preventiva da Torre de Resfriamento
              <div className="date"><i className="fas fa-clock"></i> Vence hoje</div>
            </a>
          </div>
          <div className="alert-item alert-medium">
            <a href="#/os-planejada">
              <strong>OS-2024-018</strong> - Atualização do Sistema de Controle
              <div className="date"><i className="fas fa-clock"></i> Vence em 5 dias</div>
            </a>
          </div>
        </div>

        <div className="info-card">
          <h3><i className="fas fa-calendar-alt"></i> Datas Importantes</h3>
          <div className="alert-item alert-medium">
            <a href="#/cronograma-anual">
              <strong>Manutenção Semestral</strong> - Linha de Produção Principal
              <div className="date"><i className="fas fa-calendar"></i> 15/03/2024</div>
            </a>
          </div>
          <div className="alert-item alert-low">
            <a href="#/cronograma-mensal">
              <strong>Calibração de Sensores</strong> - Todos os setores
              <div className="date"><i className="fas fa-calendar"></i> 25/02/2024</div>
            </a>
          </div>
          <div className="alert-item alert-low">
            <a href="#/cronograma-anual">
              <strong>Treinamento</strong> - Novas Técnicas de Manutenção
              <div className="date"><i className="fas fa-calendar"></i> 01/03/2024</div>
            </a>
          </div>
        </div>

        <div className="info-card">
          <h3><i className="fas fa-chart-pie"></i> Resumo de Atividades</h3>
          <div className="dashboard-mini">
            <div className="dashboard-stat">
              <h4>5</h4>
              <p>OS Abertas</p>
            </div>
            <div className="dashboard-stat">
              <h4>12</h4>
              <p>OS Concluídas</p>
            </div>
            <div className="dashboard-stat">
              <h4>97%</h4>
              <p>Disponibilidade</p>
            </div>
            <div className="dashboard-stat">
              <h4>3</h4>
              <p>Falhas hoje</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="section-title"><i className="fas fa-history"></i> Histórico de Atividades Recentes</h3>

      <div className="activity-list">
        <div className="activity-item">
          <div className="activity-icon maintenance">
            <i className="fas fa-wrench"></i>
          </div>
          <div className="activity-content">
            <p><strong><a href="#/os-corretiva">OS-2024-014</a></strong> - Manutenção corretiva na Válvula Proporcional concluída</p>
            <div className="date">Hoje às 10:35 - Técnico: Pedro Souza</div>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-icon check">
            <i className="fas fa-clipboard-check"></i>
          </div>
          <div className="activity-content">
            <p><strong><a href="#/report-diario">Relatório</a></strong> - Falha reportada no Sistema Supervisório</p>
            <div className="date">Hoje às 09:15 - Operador: Carlos Pereira</div>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-icon plan">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="activity-content">
            <p><strong><a href="#/cronograma-mensal">Agendamento</a></strong> - Manutenção preventiva agendada para Compressor 2</p>
            <div className="date">Ontem às 16:40 - Planejador: Ana Oliveira</div>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-icon maintenance">
            <i className="fas fa-wrench"></i>
          </div>
          <div className="activity-content">
            <p><strong><a href="#/dispositivos">Dispositivo D002</a></strong> - Controlador de Pressão em manutenção</p>
            <div className="date">Ontem às 14:20 - Técnico: Maria Santos</div>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="activity-content">
            <p><strong><a href="#/ras">RAS-2024-003</a></strong> - Análise de falha no Motor Principal concluída</p>
            <div className="date">20/02/2024 às 11:30 - Engenheiro: João Silva</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 