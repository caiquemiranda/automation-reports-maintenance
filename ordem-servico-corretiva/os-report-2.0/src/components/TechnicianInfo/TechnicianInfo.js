import React, { useState } from 'react';
import './TechnicianInfo.css';

const TECHNICIANS = [
  'Carla Fernandes',
  'João Silva',
  'Maria Souza',
  'Pedro Oliveira',
];

const TechnicianInfo = () => {
  const [selectedTech, setSelectedTech] = useState(TECHNICIANS[0]);
  const [materialInput, setMaterialInput] = useState('');
  const [materials, setMaterials] = useState([]);

  const addMaterial = () => {
    if (materialInput.trim()) {
      setMaterials([...materials, materialInput.trim()]);
      setMaterialInput('');
    }
  };

  const removeMaterial = (idx) => {
    setMaterials(materials.filter((_, i) => i !== idx));
  };

  return (
    <section className="technician-info">
      <div className="info-block">
        <strong>TÉCNICO RESPONSÁVEL:</strong>
        <select value={selectedTech} onChange={e => setSelectedTech(e.target.value)}>
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
              <button type="button" className="remove-btn" onClick={() => removeMaterial(idx)}>x</button>
            </div>
          ))}
        </div>
        <div className="material-add">
          <input
            type="text"
            value={materialInput}
            onChange={e => setMaterialInput(e.target.value)}
            placeholder="Adicionar material"
          />
          <button type="button" onClick={addMaterial}>Adicionar</button>
        </div>
      </div>
    </section>
  );
};

export default TechnicianInfo; 