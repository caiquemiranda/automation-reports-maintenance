import React from 'react';

/**
 * Componente para a seção de observações
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.formData - Dados do formulário
 * @param {Function} props.handleInputChange - Função para atualizar os dados
 */
const ObservationSection = ({ formData, handleInputChange }) => {
    return (
        <div className="observation-section">
            <div className="section-label">OBSERVAÇÃO:</div>
            <div className="section-content">
                <textarea
                    className="form-control"
                    value={formData.observacao}
                    onChange={(e) => handleInputChange('observacao', e.target.value)}
                    placeholder="Descreva a condição do equipamento antes do serviço"
                    required
                    rows={3}
                />
            </div>
        </div>
    );
};

export default ObservationSection; 