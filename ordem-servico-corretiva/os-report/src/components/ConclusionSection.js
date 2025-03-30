import React from 'react';

/**
 * Componente para a seção de conclusão com opções de seleção única
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.conclusao - Estado dos checkboxes de conclusão
 * @param {Function} props.handleConclusaoChange - Função para atualizar o estado
 */
const ConclusionSection = ({ conclusao, handleConclusaoChange }) => {
  // Verificar se alguma opção está selecionada
  const algumaSelecionada = conclusao.normal || conclusao.parcial || conclusao.inoperante;

  // Função para lidar com a mudança de opção (seleção única)
  const handleRadioChange = (option) => {
    // Reset todas as opções
    const newState = {
      normal: false,
      parcial: false,
      inoperante: false
    };

    // Ativar apenas a opção selecionada
    newState[option] = true;

    // Atualizar cada opção individualmente
    Object.keys(newState).forEach(key => {
      handleConclusaoChange(key, newState[key]);
    });
  };

  return (
    <div className="conclusion-section">
      <div className="section-label">CONCLUSÃO:</div>
      <div className={`conclusion-options ${!algumaSelecionada ? 'required-field' : ''}`}>
        <div className="conclusion-option">
          <input
            type="radio"
            id="equipamento-normal"
            name="conclusao-estado"
            checked={conclusao.normal}
            onChange={() => handleRadioChange('normal')}
            required={!algumaSelecionada}
          />
          <label htmlFor="equipamento-normal">Equipamento normal</label>
        </div>
        <div className="conclusion-option">
          <input
            type="radio"
            id="equipamento-parcial"
            name="conclusao-estado"
            checked={conclusao.parcial}
            onChange={() => handleRadioChange('parcial')}
          />
          <label htmlFor="equipamento-parcial">Equipamento parcial</label>
        </div>
        <div className="conclusion-option">
          <input
            type="radio"
            id="equipamento-inop"
            name="conclusao-estado"
            checked={conclusao.inoperante}
            onChange={() => handleRadioChange('inoperante')}
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
  );
};

export default ConclusionSection; 