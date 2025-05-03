import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onSave, onEdit, onPreview, isPreview, activeSection, onSectionChange }) => {
  const [expanded, setExpanded] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);

  // Detecta se está em tela pequena
  const isMobile = window.innerWidth <= 900;

  const handleToggle = () => {
    if (isMobile) {
      setShowOverlay(!showOverlay);
      setExpanded(!showOverlay);
    } else {
      setExpanded(e => !e);
    }
  };

  // Botão flutuante para abrir a sidebar em telas pequenas
  if (isMobile && !showOverlay) {
    return (
      <button className="sidebar-fab" onClick={handleToggle}>
        ☰
      </button>
    );
  }

  return (
    <>
      {isMobile && showOverlay && (
        <div className="sidebar-overlay" onClick={handleToggle}></div>
      )}
      <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'}${isMobile && showOverlay ? ' sidebar-mobile' : ''}`}>
        <div className="sidebar-header">
          <h3 className={expanded ? '' : 'hidden'}>Opções</h3>
          <button className="toggle-btn" onClick={handleToggle}>
            {expanded ? '◀' : '▶'}
          </button>
        </div>
        {expanded && (
          <>
            <div className="sidebar-sections">
              <div className={`sidebar-section ${activeSection === 'report' ? 'active' : ''}`}
                onClick={() => onSectionChange && onSectionChange('report')}>
                <span className="sidebar-icon">📄</span>
                <span className="sidebar-text">Relatório</span>
              </div>
              <div className={`sidebar-section ${activeSection === 'history' ? 'active' : ''}`}
                onClick={() => onSectionChange && onSectionChange('history')}>
                <span className="sidebar-icon">📚</span>
                <span className="sidebar-text">Histórico</span>
              </div>
            </div>
            <div className="sidebar-content">
              <div className="section-content">
                <button className={`preview-btn ${isPreview ? 'active' : ''}`} onClick={onPreview}>
                  {isPreview ? 'Editar documento' : 'Preview do documento'}
                </button>
                <div className="sidebar-separator"></div>
                <p className="sidebar-label">Ações</p>
                <button className="action-btn" onClick={onSave}>Salvar documento</button>
                <button className="action-btn" onClick={onEdit}>Editar documento</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar; 