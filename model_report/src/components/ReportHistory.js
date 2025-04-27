import React from 'react';
import '../styles/ReportHistory.css';

/**
 * Componente que exibe o histórico de relatórios salvos
 */
const ReportHistory = ({ reports, onReportSelect, onReportDelete }) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="report-history-empty">
        <p>Nenhum relatório salvo encontrado.</p>
      </div>
    );
  }

  return (
    <div className="report-history">
      <h3>Relatórios Salvos</h3>
      <div className="report-list">
        {reports.map((report) => (
          <div key={report.id} className="report-item">
            <div className="report-item-info">
              <h4>{report.title}</h4>
              <div className="report-item-meta">
                <span className="report-date">
                  {new Date(report.updatedAt).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
            <div className="report-item-actions">
              <button 
                className="report-action-btn edit" 
                onClick={() => onReportSelect(report.id)}
              >
                Abrir
              </button>
              <button 
                className="report-action-btn delete" 
                onClick={() => onReportDelete(report.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportHistory; 