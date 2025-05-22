import React, { useState } from 'react';
import SummernoteEditor from './SummernoteEditor';
import './ActivityDetails.css';

const ObservationEditor = ({ observacao, setObservacao }) => {
    const [edit, setEdit] = useState(false);
    return (
        <div className="edit-block">
            <strong>Observação (Qual problema):</strong>
            {edit ? (
                <SummernoteEditor
                    initialContent={observacao}
                    onSave={html => { setObservacao(html); setEdit(false); }}
                    onClose={() => setEdit(false)}
                />
            ) : (
                <div
                    onClick={() => setEdit(true)}
                    className="summernote-preview"
                    dangerouslySetInnerHTML={{ __html: observacao }}
                />
            )}
        </div>
    );
};

export default ObservationEditor; 