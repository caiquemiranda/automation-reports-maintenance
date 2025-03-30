import React, { useState } from 'react';

/**
 * Componente para a seção de técnico responsável e materiais utilizados
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.formData - Dados do formulário
 * @param {Function} props.handleInputChange - Função para atualizar os dados do formulário
 */
const TecnicoMaterialSection = ({ formData, handleInputChange }) => {
  const [novoMaterial, setNovoMaterial] = useState('');

  // Lista de técnicos disponíveis
  const tecnicos = [
    { id: 1, nome: 'João Silva' },
    { id: 2, nome: 'Carlos Fernandes' },
    { id: 3, nome: 'Ana Oliveira' },
    { id: 4, nome: 'Pedro Santos' },
    { id: 5, nome: 'Mariana Costa' }
  ];

  // Handler para adicionar novo material
  const adicionarMaterial = () => {
    if (novoMaterial.trim()) {
      // Certifique-se de que materiaisUtilizados é um array
      const materiaisAtuais = Array.isArray(formData.materiaisUtilizados)
        ? [...formData.materiaisUtilizados]
        : [];

      // Adicionar novo material
      const novosMateriais = [...materiaisAtuais, novoMaterial.trim()];

      // Atualizar estado
      handleInputChange('materiaisUtilizados', novosMateriais);
      setNovoMaterial('');
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
              <input
                type="text"
                className="form-control"
                value={novoMaterial}
                onChange={(e) => setNovoMaterial(e.target.value)}
                placeholder="Ex: Base endereçável XYZ"
              />
              <button type="button" className="btn-action" onClick={adicionarMaterial}>
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