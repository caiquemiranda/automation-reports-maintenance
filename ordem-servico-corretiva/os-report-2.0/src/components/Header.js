import React from 'react';
import './Header.css';

const Header = ({ numeroOS, manutencao, setManutencao }) => {
  return (
    <div className="os-header">
      <div className="logo-section">
        <div className="company-info">
          <strong>IBSistemas</strong>
          <span>Facility Solutions</span>
        </div>
      </div>

      <div className="os-title">
        <h2>OS {numeroOS}</h2>
      </div>

      <div className="maintenance-type">
        <label>
          <input
            type="radio"
            name="manutencao"
            value="corretiva"
            checked={manutencao === 'corretiva'}
            onChange={() => setManutencao('corretiva')}
            required
          />
          MANUTENÇÃO CORRETIVA
        </label>
        <label>
          <input
            type="radio"
            name="manutencao"
            value="planejada"
            checked={manutencao === 'planejada'}
            onChange={() => setManutencao('planejada')}
            required
          />
          MANUTENÇÃO PLANEJADA
        </label>
      </div>
    </div>
  );
};

export default Header; 