import React from 'react';
import logo from '../assets/logo_IBS.png';

const Header = ({ numeroOs, manutencaoCorretiva, naoProgramados, onChange }) => {
  const handleNumeroOsChange = (e) => {
    onChange('numeroOs', e.target.value);
  };

  const handleCheckboxChange = (field) => {
    if (field === 'manutencaoCorretiva') {
      onChange('manutencaoCorretiva', !manutencaoCorretiva);
    } else if (field === 'naoProgramados') {
      onChange('naoProgramados', !naoProgramados);
    }
  };

  return (
    <div className="header">
      <div className="title">
        <h1 className="text-center">
          ORDEM DE SERVIÇO CORRETIVA - OS-
          <input 
            type="text" 
            id="numero-os" 
            value={numeroOs} 
            onChange={handleNumeroOsChange} 
            style={{
              display: 'inline-block',
              minWidth: '60px',
              borderBottom: '1px dashed #ccc',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              textAlign: 'center'
            }}
          />
        </h1>
        <div className="checkboxes">
          <div className="checkbox-item">
            <input 
              type="checkbox" 
              id="manutencao" 
              name="manutencao" 
              checked={manutencaoCorretiva}
              onChange={() => handleCheckboxChange('manutencaoCorretiva')} 
            />
            <label htmlFor="manutencao">MANUTENÇÃO CORRETIVA</label>
          </div>
          <div className="checkbox-item">
            <input 
              type="checkbox" 
              id="naoprogramados" 
              name="naoprogramados" 
              checked={naoProgramados}
              onChange={() => handleCheckboxChange('naoProgramados')} 
            />
            <label htmlFor="naoprogramados">NÃO PROGRAMADOS</label>
          </div>
        </div>
      </div>
      <div className="logo">
        <img src={logo} alt="IBSystems Logo" className="logo-img" />
      </div>
    </div>
  );
};

export default Header; 