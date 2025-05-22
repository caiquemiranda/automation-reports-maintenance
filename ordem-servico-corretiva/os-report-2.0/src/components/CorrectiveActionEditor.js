import React, { useState } from 'react';
import SummernoteEditor from './SummernoteEditor';
import './ActivityDetails.css';

const CorrectiveActionEditor = ({ acaoCorretiva, setAcaoCorretiva }) => {
  const [edit, setEdit] = useState(false);
  return (
    <div className="edit-block">
      <strong>Ação Corretiva (Como foi desenvolvido a atividade):</strong>
      {edit ? (
        <SummernoteEditor
          initialContent={acaoCorretiva}
          onSave={html => { setAcaoCorretiva(html); setEdit(false); }}
          onClose={() => setEdit(false)}
        />
      ) : (
        <div
          onClick={() => setEdit(true)}
          className="summernote-preview"
          dangerouslySetInnerHTML={{ __html: acaoCorretiva }}
        />
      )}
    </div>
  );
};

export default CorrectiveActionEditor; 