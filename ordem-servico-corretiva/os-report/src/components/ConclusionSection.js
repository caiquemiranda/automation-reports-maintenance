import React from 'react';

/**
 * Componente para a seção de conclusão
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.conclusao - Estado dos checkboxes de conclusão
 * @param {Function} props.handleConclusaoChange - Função para atualizar o estado
 */
const ConclusionSection = ({ conclusao, handleConclusaoChange }) => {
  return (
    <div className="conclusion-section">
      <div className="section-label">CONCLUSÃO:</div>
      <div className="conclusion-options">
        <div className="conclusion-option">
          <input
            type="checkbox"
            id="temporario-normal"
            checked={conclusao.normal}
            onChange={(e) => handleConclusaoChange('normal', e.target.checked)}
          />
          <label htmlFor="temporario-normal">Equipamento normal</label>
        </div>
        <div className="conclusion-option">
          <input
            type="checkbox"
            id="equipamento-parcial"
            checked={conclusao.parcial}
            onChange={(e) => handleConclusaoChange('parcial', e.target.checked)}
          />
          <label htmlFor="equipamento-parcial">Equipamento parcial</label>
        </div>
        <div className="conclusion-option">
          <input
            type="checkbox"
            id="equipamento-inop"
            checked={conclusao.inoperante}
            onChange={(e) => handleConclusaoChange('inoperante', e.target.checked)}
          />
          <label htmlFor="equipamento-inop">Equipamento inoperante</label>
        </div>
      </div>
    </div>
  );
};

export default ConclusionSection; 