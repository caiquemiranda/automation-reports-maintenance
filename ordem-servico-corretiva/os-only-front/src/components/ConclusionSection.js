import React, { useState } from 'react';
import './ConclusionSection.css';

const ConclusionSection = () => {
    const [conclusion, setConclusion] = useState({
        equipamentoNormal: false,
        equipamentoParcial: false,
        equipamentoInoperante: false
    });

    const handleConclusionChange = (field) => {
        setConclusion({
            ...conclusion,
            [field]: !conclusion[field]
        });
    };

    return (
        <div className="conclusion-section">
            <div className="section-label">CONCLUSÃO:</div>
            <div className="conclusion-options">
                <div className="conclusion-option">
                    <input
                        type="checkbox"
                        id="temporario-normal"
                        checked={conclusion.equipamentoNormal}
                        onChange={() => handleConclusionChange('equipamentoNormal')}
                    />
                    <label htmlFor="temporario-normal">Equipamento normal</label>
                </div>
                <div className="conclusion-option">
                    <input
                        type="checkbox"
                        id="equipamento-parcial"
                        checked={conclusion.equipamentoParcial}
                        onChange={() => handleConclusionChange('equipamentoParcial')}
                    />
                    <label htmlFor="equipamento-parcial">Equipamento parcial</label>
                </div>
                <div className="conclusion-option">
                    <input
                        type="checkbox"
                        id="equipamento-inop"
                        checked={conclusion.equipamentoInoperante}
                        onChange={() => handleConclusionChange('equipamentoInoperante')}
                    />
                    <label htmlFor="equipamento-inop">Equipamento inoperante</label>
                </div>
            </div>
        </div>
    );
};

export default ConclusionSection; 