import React, { useState } from 'react';
import SummernoteEditor from './SummernoteEditor';
import './ActivityDetails.css';

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
        <div className="edit-block">
          <strong>Serviço (Motivo de abertura da OS):</strong>
          {editField === 'servico' ? (
            <SummernoteEditor
              initialContent={servico}
              onSave={html => { setServico(html); setEditField(null); }}
              onClose={() => setEditField(null)}
            />
          ) : (
            <div 
              onClick={() => setEditField('servico')} 
              className="summernote-preview" 
              dangerouslySetInnerHTML={{ __html: servico }}
            />
          )}
        </div>

        <div className="edit-block">
          <strong>Observação (Qual problema):</strong>
          {editField === 'observacao' ? (
            <SummernoteEditor
              initialContent={observacao}
              onSave={html => { setObservacao(html); setEditField(null); }}
              onClose={() => setEditField(null)}
            />
          ) : (
            <div 
              onClick={() => setEditField('observacao')} 
              className="summernote-preview" 
              dangerouslySetInnerHTML={{ __html: observacao }}
            />
          )}
        </div>

        <div className="edit-block">
          <strong>Ação Corretiva (Como foi desenvolvido a atividade):</strong>
          {editField === 'acaoCorretiva' ? (
            <SummernoteEditor
              initialContent={acaoCorretiva}
              onSave={html => { setAcaoCorretiva(html); setEditField(null); }}
              onClose={() => setEditField(null)}
            />
          ) : (
            <div 
              onClick={() => setEditField('acaoCorretiva')} 
              className="summernote-preview" 
              dangerouslySetInnerHTML={{ __html: acaoCorretiva }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ActivityDetails; 