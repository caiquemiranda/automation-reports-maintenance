import React, { useState } from 'react';
import './ActionSection.css';

const ActionSection = () => {
    const [acaoCorretiva, setAcaoCorretiva] = useState(`
    <p>Foi realizada a troca do dispositivo por um novo do mesmo modelo (sensor de fumaça convencional),
        onde foi realizado a limpeza interna das conexões e ajuste no dispositivo, o que normalizou o
        seu funcionamento conforme especificações. Programação e instalação do detector de fumaça após a
        troca do equipamento que apresentava problema.</p>
    <ul>
        <li>Teste de formato</li>
        <li>Teste de comunicação com painel</li>
        <li>Funcionamento do detector</li>
    </ul>
  `);

    const handleAcaoCorretivaChange = (e) => {
        setAcaoCorretiva(e.target.innerHTML);
    };

    return (
        <div className="action-section">
            <div className="section-label">Ação Corretiva:</div>
            <div
                className="section-content"
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={handleAcaoCorretivaChange}
                dangerouslySetInnerHTML={{ __html: acaoCorretiva }}
            />
        </div>
    );
};

export default ActionSection; 