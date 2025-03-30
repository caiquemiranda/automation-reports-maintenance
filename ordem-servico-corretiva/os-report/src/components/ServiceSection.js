import React from 'react';

/**
 * Componente para a seção de serviço
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.formData - Dados do formulário
 * @param {Function} props.handleInputChange - Função para atualizar os dados
 */
const ServiceSection = ({ formData, handleInputChange }) => {
    return (
        <div className="service-section">
            <div className="section-label">SERVIÇO:</div>
            <div className="section-content">
                <textarea
                    className="form-control"
                    value={formData.servico}
                    onChange={(e) => handleInputChange('servico', e.target.value)}
                    rows={2}
                />
            </div>
        </div>
    );
};

export default ServiceSection; 