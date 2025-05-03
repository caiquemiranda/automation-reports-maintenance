import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onSave, onEdit, onPreview, isPreview, activeSection, onSectionChange }) => {
  const [expanded, setExpanded] = useState(true);

  if (!expanded) {
    return (
      <div className="sidebar collapsed sidebar-collapsed-only-btn">
        <button className="toggle-btn toggle-btn-center" onClick={() => setExpanded(true)}>
          ▶
        </button>
      </div>
    );
  }

  return (
    <div className={`sidebar expanded`}>
      <div className="sidebar-header">
        <h3>Opções</h3>
        <button className="toggle-btn" onClick={() => setExpanded(false)}>
          ◀
        </button>
      </div>
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
    </div>
  );
};

export default Sidebar; 