import React from 'react';
import './ActionSection.css';
import { useOrdemServico } from '../../../contexts/OrdemServicoContext';
import EditableField from '../../../components/common/EditableField';

const ActionSection = () => {
    const { acaoCorretiva, handleAcaoCorretivaChange } = useOrdemServico();

    return (
        <div className="action-section">
            <div className="section-label">Ação Corretiva:</div>
            <EditableField
                className="section-content"
                value={acaoCorretiva}
                onChange={handleAcaoCorretivaChange}
                html={true}
            />
        </div>
    );
};

export default ActionSection; 