import React from 'react';

/**
 * Componente para a seção de conclusão com opções de seleção única
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.conclusao - Estado dos radio buttons de conclusão
 * @param {Function} props.handleConclusaoChange - Função para atualizar o estado
 */
const ConclusionSection = ({ conclusao, handleConclusaoChange }) => {
  // Verificar se alguma opção está selecionada
  const algumaSelecionada = conclusao.normal || conclusao.parcial || conclusao.inoperante;

  console.log('Renderizando ConclusionSection com estado:', conclusao);

  // Função para lidar com cliques na div inteira
  const handleOptionClick = (option) => {
    handleConclusaoChange(option, true);
  };

  return (
    <div className="conclusion-page-wrapper">
      <div className="conclusion-section">
        <div className="section-label">Conclusão:</div>
        <div className="conclusion-options">
          <div
            className={`conclusion-option ${conclusao.normal ? 'selected' : ''}`}
            onClick={() => handleOptionClick('normal')}
          >
            <input
              type="radio"
              id="equipamento-normal"
              name="conclusao-estado"
              checked={conclusao.normal}
              onChange={() => handleConclusaoChange('normal', true)}
              required={!algumaSelecionada}
            />
            <label htmlFor="equipamento-normal">Equipamento normal</label>
          </div>
          <div
            className={`conclusion-option ${conclusao.parcial ? 'selected' : ''}`}
            onClick={() => handleOptionClick('parcial')}
          >
            <input
              type="radio"
              id="equipamento-parcial"
              name="conclusao-estado"
              checked={conclusao.parcial}
              onChange={() => handleConclusaoChange('parcial', true)}
            />
            <label htmlFor="equipamento-parcial">Equipamento parcial</label>
          </div>
          <div
            className={`conclusion-option ${conclusao.inoperante ? 'selected' : ''}`}
            onClick={() => handleOptionClick('inoperante')}
          >
            <input
              type="radio"
              id="equipamento-inop"
              name="conclusao-estado"
              checked={conclusao.inoperante}
              onChange={() => handleConclusaoChange('inoperante', true)}
            />
            <label htmlFor="equipamento-inop">Equipamento inoperante</label>
          </div>
          {!algumaSelecionada && (
            <div className="required-message">
              * Selecione uma opção para conclusão
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConclusionSection; 