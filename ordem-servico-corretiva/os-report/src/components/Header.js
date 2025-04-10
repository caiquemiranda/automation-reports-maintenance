import React from 'react';

/**
 * Componente de cabeçalho da ordem de serviço
 * @param {Object} props - Propriedades do componente
 * @param {string} props.osNumber - Número da ordem de serviço
 * @param {Function} props.setOsNumber - Função para atualizar o número da OS
 * @param {boolean} props.manutencaoCorretiva - Estado do checkbox de manutenção corretiva
 * @param {Function} props.setManutencaoCorretiva - Função para atualizar o estado
 * @param {boolean} props.naoProgramados - Estado do checkbox de manutenção planejada
 * @param {Function} props.setNaoProgramados - Função para atualizar o estado
 */
const Header = ({
  osNumber,
  setOsNumber,
  manutencaoCorretiva,
  setManutencaoCorretiva,
  naoProgramados,
  setNaoProgramados
}) => {
  return (
    <div className="header">
      <div className="logo">
        <img src="/logo_IBS.png" alt="IBSystems Logo" className="logo-img" />
      </div>

      <div className="title-container">
        <h1 className="text-center">
          ORDEM DE SERVIÇO 
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setOsNumber(e.target.textContent)}
            className="os-number-editable"
          >
            {osNumber}
          </span>
        </h1>

        <div className="checkboxes">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="manutencao"
              name="manutencao"
              checked={manutencaoCorretiva}
              onChange={(e) => setManutencaoCorretiva(e.target.checked)}
            />
            <label htmlFor="manutencao">MANUTENÇÃO CORRETIVA</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="naoprogramados"
              name="naoprogramados"
              checked={naoProgramados}
              onChange={(e) => setNaoProgramados(e.target.checked)}
            />
            <label htmlFor="naoprogramados">MANUTENÇÃO PLANEJADA</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 