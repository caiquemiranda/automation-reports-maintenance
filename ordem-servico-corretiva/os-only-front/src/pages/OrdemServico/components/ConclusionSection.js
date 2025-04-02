import React from 'react';
import './ConclusionSection.css';
import { useOrdemServico } from '../../../contexts/OrdemServicoContext';

const ConclusionSection = () => {
    const { conclusion, handleConclusionChange } = useOrdemServico();

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