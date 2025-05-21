import React, { useState } from 'react';
import './TechnicianInfo.css';

const TECHNICIANS = [
  'Carla Fernandes',
  'João Silva',
  'Maria Souza',
  'Pedro Oliveira',
];

const TEAM_MEMBERS = [
  'André Santos',
  'Bruna Lima',
  'Carlos Mendes',
  'Débora Alves',
  'Eduardo Costa',
];

const TechnicianInfo = ({
  tecnicoResponsavel,
  setTecnicoResponsavel,
  equipe,
  setEquipe,
  errors
}) => {
  const [selectedMember, setSelectedMember] = useState('');

  const addTeamMember = () => {
    if (selectedMember && !equipe.includes(selectedMember)) {
      setEquipe([...equipe, selectedMember]);
      setSelectedMember('');
    }
  };

  const removeTeamMember = (member) => {
    setEquipe(equipe.filter(m => m !== member));
  };

  return (
    <section className="technician-info">
      <h3>Equipe</h3>

      <div className="info-block">
        <strong>Técnico Responsável:</strong>
        <select
          value={tecnicoResponsavel}
          onChange={e => setTecnicoResponsavel(e.target.value)}
          required
          className={errors?.tecnicoResponsavel ? 'input-error' : ''}
        >
          <option value="">Selecione o técnico</option>
          {TECHNICIANS.map(tech => (
            <option key={tech} value={tech}>{tech}</option>
          ))}
        </select>
      </div>

      <div className="info-block">
        <strong>Equipe:</strong>
        <div className="team-list">
          {equipe.length > 0 ? (
            equipe.map((member, idx) => (
              <div key={idx} className="team-member">
                <span>{member}</span>
                <button type="button" className="remove-btn" onClick={() => removeTeamMember(member)}>
                  ×
                </button>
              </div>
            ))
          ) : (
            <div className="empty-team">Nenhum membro adicionado à equipe</div>
          )}
        </div>

        <div className="team-add">
          <select
            value={selectedMember}
            onChange={e => setSelectedMember(e.target.value)}
          >
            <option value="">Selecione um membro para adicionar</option>
            {TEAM_MEMBERS.filter(member => !equipe.includes(member)).map((member, idx) => (
              <option key={idx} value={member}>{member}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addTeamMember}
            disabled={!selectedMember}
          >
            Adicionar
          </button>
        </div>
      </div>
    </section>
  );
};

export default TechnicianInfo; 