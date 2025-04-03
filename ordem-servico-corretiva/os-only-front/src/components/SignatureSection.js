import React, { useState } from 'react';

const ResponsavelMaterialSection = ({ tecnicoResponsavel, materiaisUtilizados = [], onChange }) => {
    const [materialSelecionado, setMaterialSelecionado] = useState('');

    // Lista de técnicos disponíveis
    const tecnicos = [
        'Selecione um técnico',
        'João Silva',
        'Carlos Fernandes',
        'Ana Oliveira',
        'Pedro Santos',
        'Mariana Costa'
    ];

    // Lista de materiais predefinidos
    const materiaisDisponiveis = [
        'Base simplex modelo 29283003',
        'Detector simplex modelo 29283423',
        'Acionador simplex modelo 29283234',
        'Módulo de controle',
        'Bateria 12V',
        'Cabo FTP',
        'Cabo flexível',
        'Fusível'
    ];

    // Função para adicionar material selecionado
    const adicionarMaterial = () => {
        if (materialSelecionado && materialSelecionado !== 'Selecione um material') {
            // Certifique-se de que materiaisUtilizados é um array
            const materiaisAtuais = Array.isArray(materiaisUtilizados) 
                ? [...materiaisUtilizados] 
                : [];
            
            // Verificar se o material já foi adicionado para evitar duplicações
            if (!materiaisAtuais.includes(materialSelecionado)) {
                const novosMateriais = [...materiaisAtuais, materialSelecionado];
                onChange('materiaisUtilizados', novosMateriais);
            }
            
            // Limpar a seleção
            setMaterialSelecionado('');
        }
    };

    // Função para remover material
    const removerMaterial = (index) => {
        const novosMateriais = Array.isArray(materiaisUtilizados) 
            ? [...materiaisUtilizados] 
            : [];
        novosMateriais.splice(index, 1);
        onChange('materiaisUtilizados', novosMateriais);
    };

    const sectionStyle = {
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        border: '1px solid #e8e8e8'
    };

    const labelStyle = {
        fontWeight: 'bold',
        fontSize: '14px',
        marginBottom: '8px',
        display: 'block',
        color: '#333'
    };

    const selectStyle = {
        width: '100%',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '8px',
        fontSize: '12px',
        outline: 'none',
        marginBottom: '10px',
        backgroundColor: 'white'
    };

    const buttonStyle = {
        backgroundColor: '#2980b9',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '6px 12px',
        cursor: 'pointer',
        fontSize: '12px',
        marginTop: '5px',
        marginBottom: '10px'
    };

    const materialItemStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 10px',
        margin: '5px 0',
        backgroundColor: 'white',
        borderRadius: '4px',
        border: '1px solid #e0e0e0',
        fontSize: '12px'
    };

    const removeButtonStyle = {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        padding: '2px 6px',
        cursor: 'pointer',
        fontSize: '10px'
    };

    return (
        <div className="responsavel-material-section">
            <div style={sectionStyle}>
                <label style={labelStyle}>TÉCNICO RESPONSÁVEL:</label>
                <select
                    value={tecnicoResponsavel || 'Selecione um técnico'}
                    onChange={(e) => onChange('tecnicoResponsavel', e.target.value)}
                    style={selectStyle}
                >
                    {tecnicos.map((tecnico, index) => (
                        <option key={index} value={tecnico}>
                            {tecnico}
                        </option>
                    ))}
                </select>
            </div>

            <div style={sectionStyle}>
                <label style={labelStyle}>MATERIAIS UTILIZADOS:</label>
                
                <div style={{ marginBottom: '15px' }}>
                    {Array.isArray(materiaisUtilizados) && materiaisUtilizados.length > 0 ? (
                        <div>
                            {materiaisUtilizados.map((material, index) => (
                                <div key={index} style={materialItemStyle}>
                                    <span>{material}</span>
                                    <button
                                        type="button"
                                        onClick={() => removerMaterial(index)}
                                        style={removeButtonStyle}
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ 
                            fontSize: '12px', 
                            color: '#666', 
                            marginBottom: '10px',
                            fontStyle: 'italic'
                        }}>
                            Nenhum material adicionado
                        </div>
                    )}
                </div>
                
                <select
                    value={materialSelecionado}
                    onChange={(e) => setMaterialSelecionado(e.target.value)}
                    style={selectStyle}
                >
                    <option value="">Selecione um material</option>
                    {materiaisDisponiveis.map((material, index) => (
                        <option key={index} value={material}>
                            {material}
                        </option>
                    ))}
                </select>
                
                <button
                    type="button"
                    onClick={adicionarMaterial}
                    disabled={!materialSelecionado}
                    style={buttonStyle}
                >
                    Adicionar Material
                </button>
            </div>
        </div>
    );
};

export default ResponsavelMaterialSection; 