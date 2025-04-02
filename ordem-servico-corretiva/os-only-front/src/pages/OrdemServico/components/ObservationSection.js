import React from 'react';
import './ObservationSection.css';
import { useOrdemServico } from '../../../contexts/OrdemServicoContext';
import EditableField from '../../../components/common/EditableField';

const ObservationSection = () => {
    const { observacao, handleObservacaoChange } = useOrdemServico();

    return (
        <div className="observation-section">
            <div className="section-label">OBSERVAÇÃO:</div>
            <EditableField
                className="section-content"
                value={observacao}
                onChange={handleObservacaoChange}
            />
        </div>
    );
};

export default ObservationSection; 