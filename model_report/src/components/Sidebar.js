import React, { useState, useEffect } from 'react';
import '../styles/Sidebar.css';
import ReportHistory from './ReportHistory';
import StorageService from '../services/StorageService';

const Sidebar = ({
  onPreviewToggle,
  isPreview,
  onSaveReport,
  onLoadReport,
  onDeleteReport,
  onTemplatesClick,
  activeSection,
  onSectionChange,
  onExportPdf
}) => {
  const [expanded, setExpanded] = useState(true);
  const [reports, setReports] = useState([]);

  // Carregar histórico de relatórios quando o componente for montado
  useEffect(() => {
    if (activeSection === 'history') {
      loadReports();
    }
  }, [activeSection]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const loadReports = () => {
    const savedReports = StorageService.getAllReports();
    setReports(savedReports);
  };

  const handleReportSelect = (reportId) => {
    if (onLoadReport) {
      onLoadReport(reportId);
    }
  };

  const handleReportDelete = (reportId) => {
    if (window.confirm('Tem certeza que deseja excluir este relatório?')) {
      StorageService.deleteReport(reportId);
      // Recarregar a lista após excluir
      loadReports();

      if (onDeleteReport) {
        onDeleteReport(reportId);
      }
    }
  };

  return (
    <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <h3 className={expanded ? '' : 'hidden'}>Opções</h3>
        <button className="toggle-btn" onClick={toggleExpand}>
          {expanded ? '◀' : '▶'}
        </button>
      </div>

      {expanded && (
        <>
          <div className="sidebar-sections">
            <div
              className={`sidebar-section ${activeSection === 'report' ? 'active' : ''}`}
              onClick={() => onSectionChange('report')}
            >
              <span className="sidebar-icon">📄</span>
              <span className="sidebar-text">Relatório</span>
            </div>
            <div
              className={`sidebar-section ${activeSection === 'data' ? 'active' : ''}`}
              onClick={() => onSectionChange('data')}
            >
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-text">Dados</span>
            </div>
            <div
              className={`sidebar-section ${activeSection === 'history' ? 'active' : ''}`}
              onClick={() => onSectionChange('history')}
            >
              <span className="sidebar-icon">📚</span>
              <span className="sidebar-text">Histórico</span>
            </div>
            <div
              className={`sidebar-section ${activeSection === 'templates' ? 'active' : ''}`}
              onClick={() => {
                onSectionChange('templates');
                if (onTemplatesClick) onTemplatesClick();
              }}
            >
              <span className="sidebar-icon">📑</span>
              <span className="sidebar-text">Modelos de Relatório</span>
            </div>
          </div>

          <div className="sidebar-content">
            {activeSection === 'report' && (
              <div className="section-content">
                <button
                  onClick={onPreviewToggle}
                  className={`preview-btn ${isPreview ? 'active' : ''}`}
                >
                  {isPreview ? 'Editar documento' : 'Preview do documento'}
                </button>
                <div className="sidebar-separator"></div>
                <p className="sidebar-label">Ações</p>
                <button className="action-btn" onClick={onSaveReport}>Salvar relatório</button>
                <button className="action-btn" onClick={onExportPdf}>Exportar como PDF</button>
              </div>
            )}

            {activeSection === 'data' && (
              <div className="section-content">
                <p className="sidebar-label">Fontes de Dados</p>
                <button className="data-btn">Importar Planilha</button>
                <button className="data-btn">Conectar ao Banco</button>
                <div className="sidebar-separator"></div>
                <p className="sidebar-label">Datasets</p>
                <div className="data-item">Sem dados importados</div>
              </div>
            )}

            {activeSection === 'history' && (
              <ReportHistory
                reports={reports}
                onReportSelect={handleReportSelect}
                onReportDelete={handleReportDelete}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar; 