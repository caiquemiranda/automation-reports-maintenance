import React, { useState } from 'react';
import SummernoteEditor from './SummernoteEditor';
import './ActivityDetails.css';
import ServiceReasonEditor from './ServiceReasonEditor';
import ObservationEditor from './ObservationEditor';
import CorrectiveActionEditor from './CorrectiveActionEditor';

const ActivityDetails = ({
  servico,
  setServico,
  observacao,
  setObservacao,
  acaoCorretiva,
  setAcaoCorretiva
}) => {
  const [editField, setEditField] = useState(null);

  return (
    <section className="activity-details">
      <h3>Detalhes da Atividade</h3>
      <div className="activity-edit-blocks">
        <ServiceReasonEditor servico={servico} setServico={setServico} />
        <ObservationEditor observacao={observacao} setObservacao={setObservacao} />
        <CorrectiveActionEditor acaoCorretiva={acaoCorretiva} setAcaoCorretiva={setAcaoCorretiva} />
      </div>
    </section>
  );
};

export default ActivityDetails; 