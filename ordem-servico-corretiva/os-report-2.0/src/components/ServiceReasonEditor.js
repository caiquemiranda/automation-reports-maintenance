import React, { useState } from 'react';
import SummernoteEditor from './SummernoteEditor';
import './ActivityDetails.css';

const ServiceReasonEditor = ({ servico, setServico }) => {
    const [edit, setEdit] = useState(false);
    return (
        <div className="edit-block">
            <strong>Serviço (Motivo de abertura da OS):</strong>
            {edit ? (
                <SummernoteEditor
                    initialContent={servico}
                    onSave={html => { setServico(html); setEdit(false); }}
                    onClose={() => setEdit(false)}
                />
            ) : (
                <div
                    onClick={() => setEdit(true)}
                    className="summernote-preview"
                    dangerouslySetInnerHTML={{ __html: servico }}
                />
            )}
        </div>
    );
};

export default ServiceReasonEditor; 