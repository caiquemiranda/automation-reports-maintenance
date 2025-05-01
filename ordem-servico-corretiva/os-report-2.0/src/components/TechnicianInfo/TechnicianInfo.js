import React, { useState, useEffect } from 'react';
import './TechnicianInfo.css';

const TECHNICIANS = [
  'Carla Fernandes',
  'João Silva',
  'Maria Souza',
  'Pedro Oliveira',
];
const DEFAULT_MATERIALS = [
  'Acionador simples modelo 2023/234',
  'Detector de fumaça convencional',
];

const TechnicianInfo = ({ selectedTech, setSelectedTech, materials, setMaterials, errors }) => {
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [availableMaterials, setAvailableMaterials] = useState(DEFAULT_MATERIALS);

  useEffect(() => {
    if (materials.length === 0) {
      setMaterials([]);
    }
  }, []);

  const addMaterial = () => {
    if (selectedMaterial) {
      setMaterials([...materials, selectedMaterial]);
    }
  };

  const removeMaterial = (idx) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((_, i) => i !== idx));
    }
  };

  return (
    <section className="technician-info">
      <div className="info-block">
        <strong>TÉCNICO RESPONSÁVEL:</strong>
        <select value={selectedTech} onChange={e => setSelectedTech(e.target.value)} required className={errors.selectedTech ? 'input-error' : ''}>
          <option value="">Selecione</option>
          {TECHNICIANS.map(tech => (
            <option key={tech} value={tech}>{tech}</option>
          ))}
        </select>
      </div>
      <div className="info-block">
        <strong>MATERIAL UTILIZADO:</strong>
        <div className="material-list">
          {materials.map((mat, idx) => (
            <div key={idx} className="material-item">
              {mat}
              <button type="button" className="remove-btn" onClick={() => removeMaterial(idx)} disabled={materials.length === 1}>x</button>
            </div>
          ))}
        </div>
        <div className="material-add">
          <select value={selectedMaterial} onChange={e => setSelectedMaterial(e.target.value)}>
            <option value="">Selecione o material</option>
            {availableMaterials.map((mat, idx) => (
              <option key={idx} value={mat}>{mat}</option>
            ))}
          </select>
          <button type="button" onClick={addMaterial} disabled={!selectedMaterial}>Adicionar</button>
        </div>
        {errors.materials && <div className="error-msg">Adicione pelo menos um material.</div>}
      </div>
    </section>
  );
};

export default TechnicianInfo; 