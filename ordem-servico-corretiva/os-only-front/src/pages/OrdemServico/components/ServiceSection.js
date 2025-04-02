import React from 'react';
import './ServiceSection.css';
import { useOrdemServico } from '../../../contexts/OrdemServicoContext';
import EditableField from '../../../components/common/EditableField';

const ServiceSection = () => {
    const { servico, handleServicoChange } = useOrdemServico();

    return (
        <div className="service-section">
            <div className="section-label">SERVIÇO:</div>
            <EditableField
                className="section-content"
                value={servico}
                onChange={handleServicoChange}
            />
        </div>
    );
};

export default ServiceSection; 