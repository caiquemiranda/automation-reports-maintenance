import React, { useState } from 'react';
import './ObservationSection.css';

const ObservationSection = () => {
    const [observacao, setObservacao] = useState('O dispositivo encontrava-se danificado como citou "no cheiro" no final de inspeção, pessoal fumando escondido.');

    const handleObservacaoChange = (e) => {
        setObservacao(e.target.textContent);
    };

    return (
        <div className="observation-section">
            <div className="section-label">OBSERVAÇÃO:</div>
            <div
                className="section-content"
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={handleObservacaoChange}
            >
                {observacao}
            </div>
        </div>
    );
};

export default ObservationSection; 