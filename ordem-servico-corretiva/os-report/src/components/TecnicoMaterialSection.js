import React, { useState } from 'react';

/**
 * Componente para a seção de técnico responsável e materiais utilizados
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.formData - Dados do formulário
 * @param {Function} props.handleInputChange - Função para atualizar os dados do formulário
 */
const TecnicoMaterialSection = ({ formData, handleInputChange }) => {
    const [materialSelecionado, setMaterialSelecionado] = useState('');

    // Lista de técnicos disponíveis
    const tecnicos = [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Carlos Fernandes' },
        { id: 3, nome: 'Ana Oliveira' },
        { id: 4, nome: 'Pedro Santos' },
        { id: 5, nome: 'Mariana Costa' }
    ];

    // Lista de materiais pré-definidos
    const materiaisDisponiveis = [
        { id: 1, nome: 'Base simplex modelo 29283003' },
        { id: 2, nome: 'Detector simplex modelo 29283423' },
        { id: 3, nome: 'Acionador simplex modelo 29283234' }
    ];

    // Handler para adicionar material selecionado
    const adicionarMaterial = () => {
        if (materialSelecionado) {
            // Certifique-se de que materiaisUtilizados é um array
            const materiaisAtuais = Array.isArray(formData.materiaisUtilizados)
                ? [...formData.materiaisUtilizados]
                : [];

            // Verificar se o material já foi adicionado para evitar duplicações
            if (!materiaisAtuais.includes(materialSelecionado)) {
                // Adicionar novo material
                const novosMateriais = [...materiaisAtuais, materialSelecionado];

                // Atualizar estado
                handleInputChange('materiaisUtilizados', novosMateriais);
            }

            // Limpar a seleção
            setMaterialSelecionado('');
        }
    };

    // Handler para remover material
    const removerMaterial = (index) => {
        const materiais = [...formData.materiaisUtilizados];
        materiais.splice(index, 1);
        handleInputChange('materiaisUtilizados', materiais);
    };

    return (
        <div className="tecnico-material-section">
            <div className="section-container">
                <div className="tecnico-section">
                    <div className="section-label">TÉCNICO RESPONSÁVEL:</div>
                    <div className="section-content">
                        <select
                            className="select-control"
                            value={formData.tecnicoResponsavel || ''}
                            onChange={(e) => handleInputChange('tecnicoResponsavel', e.target.value)}
                            required
                        >
                            <option value="">Selecione o técnico responsável</option>
                            {tecnicos.map((tecnico) => (
                                <option key={tecnico.id} value={tecnico.nome}>
                                    {tecnico.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="material-section">
                    <div className="section-label">MATERIAL UTILIZADO:</div>
                    <div className="section-content">
                        <div className="material-list">
                            {Array.isArray(formData.materiaisUtilizados) && formData.materiaisUtilizados.length > 0 ? (
                                <ul>
                                    {formData.materiaisUtilizados.map((material, index) => (
                                        <li key={index}>
                                            {material}{' '}
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removerMaterial(index)}
                                            >
                                                x
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-materials">Nenhum material adicionado</p>
                            )}
                        </div>

                        <div className="add-material-form">
                            <select
                                className="select-control"
                                value={materialSelecionado}
                                onChange={(e) => setMaterialSelecionado(e.target.value)}
                            >
                                <option value="">Selecione um material</option>
                                {materiaisDisponiveis.map((material) => (
                                    <option key={material.id} value={material.nome}>
                                        {material.nome}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="btn-action"
                                onClick={adicionarMaterial}
                                disabled={!materialSelecionado}
                            >
                                Adicionar Material
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TecnicoMaterialSection; 