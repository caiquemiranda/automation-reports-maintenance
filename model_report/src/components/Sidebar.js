import React, { useState } from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ onPreviewToggle, isPreview }) => {
  const [expanded, setExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState('report');

  const toggleExpand = () => {
    setExpanded(!expanded);
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
              onClick={() => setActiveSection('report')}
            >
              <span className="sidebar-icon">📄</span>
              <span className="sidebar-text">Relatório</span>
            </div>
            <div 
              className={`sidebar-section ${activeSection === 'data' ? 'active' : ''}`}
              onClick={() => setActiveSection('data')}
            >
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-text">Dados</span>
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
                <p className="sidebar-label">Configurações</p>
                <div className="sidebar-option">
                  <label>Tamanho:</label>
                  <select defaultValue="a4">
                    <option value="a4">A4</option>
                    <option value="letter">Carta</option>
                    <option value="legal">Ofício</option>
                  </select>
                </div>
                <div className="sidebar-option">
                  <label>Orientação:</label>
                  <select defaultValue="portrait">
                    <option value="portrait">Retrato</option>
                    <option value="landscape">Paisagem</option>
                  </select>
                </div>
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
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar; 