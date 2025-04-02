import React from 'react';

const ConclusionSection = ({ conclusao, onChange }) => {
  const handleCheckboxChange = (field) => {
    onChange(field, !conclusao[field]);
  };

  return (
    <div className="conclusion-section">
      <div className="section-label">CONCLUSÃO:</div>
      <div className="conclusion-options" style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        borderTop: '1px solid black', 
        borderBottom: '1px solid black', 
        padding: '10px 0' 
      }}>
        <div className="conclusion-option">
          <input 
            type="checkbox" 
            id="equipamento-normal" 
            checked={conclusao.equipamentoNormal}
            onChange={() => handleCheckboxChange('equipamentoNormal')} 
          />
          <label htmlFor="equipamento-normal">Equipamento normal</label>
        </div>
        <div className="conclusion-option">
          <input 
            type="checkbox" 
            id="equipamento-parcial" 
            checked={conclusao.equipamentoParcial}
            onChange={() => handleCheckboxChange('equipamentoParcial')} 
          />
          <label htmlFor="equipamento-parcial">Equipamento parcial</label>
        </div>
        <div className="conclusion-option">
          <input 
            type="checkbox" 
            id="equipamento-inop" 
            checked={conclusao.equipamentoInoperante}
            onChange={() => handleCheckboxChange('equipamentoInoperante')} 
          />
          <label htmlFor="equipamento-inop">Equipamento inoperante</label>
        </div>
      </div>
    </div>
  );
};

export default ConclusionSection; 