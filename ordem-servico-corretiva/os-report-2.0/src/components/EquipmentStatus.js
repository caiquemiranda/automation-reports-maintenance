import React from 'react';
import './EquipmentStatus.css';

const EquipmentStatus = ({ status, setStatus }) => {
  return (
    <section className="equipment-status">
      <h3>Situação do Equipamento</h3>
      <div className="status-options">
        <label className={status === 'normal' ? 'selected' : ''}>
          <input
            type="radio"
            name="status"
            value="normal"
            checked={status === 'normal'}
            onChange={() => setStatus('normal')}
          />
          <span>Equipamento Normal</span>
        </label>
        
        <label className={status === 'parcial' ? 'selected' : ''}>
          <input
            type="radio"
            name="status"
            value="parcial"
            checked={status === 'parcial'}
            onChange={() => setStatus('parcial')}
          />
          <span>Funcionamento Parcial</span>
        </label>
        
        <label className={status === 'fora' ? 'selected' : ''}>
          <input
            type="radio"
            name="status"
            value="fora"
            checked={status === 'fora'}
            onChange={() => setStatus('fora')}
          />
          <span>Equipamento Fora de Serviço</span>
        </label>
      </div>
    </section>
  );
};

export default EquipmentStatus; 