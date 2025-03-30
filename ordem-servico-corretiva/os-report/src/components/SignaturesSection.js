import React from 'react';

/**
 * Componente para a seção de assinaturas
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.formData - Dados do formulário
 * @param {Function} props.handleDateChange - Função para atualizar as datas
 */
const SignaturesSection = ({ formData, handleDateChange }) => {
  return (
    <div className="signatures-section">
      <table>
        <thead>
          <tr>
            <th>ASSISTENTE</th>
            <th>CLIENTE</th>
            <th>SUPERVISOR/PREVENTIVA</th>
            <th>FREQUÊNCIA DE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><div className="signature-line"></div></td>
            <td><div className="signature-line"></div></td>
            <td><div className="signature-line"></div></td>
            <td><div className="signature-line"></div></td>
          </tr>
          <tr>
            <td>
              <div className="date-line">
                DATA:
                <input
                  type="date"
                  className="date-picker"
                  value={formData.datas[0]}
                  onChange={(e) => handleDateChange(0, e.target.value)}
                />
              </div>
            </td>
            <td>
              <div className="date-line">
                DATA:
                <input
                  type="date"
                  className="date-picker"
                  value={formData.datas[1]}
                  onChange={(e) => handleDateChange(1, e.target.value)}
                />
              </div>
            </td>
            <td>
              <div className="date-line">
                DATA:
                <input
                  type="date"
                  className="date-picker"
                  value={formData.datas[2]}
                  onChange={(e) => handleDateChange(2, e.target.value)}
                />
              </div>
            </td>
            <td>
              <div className="date-line">
                DATA:
                <input
                  type="date"
                  className="date-picker"
                  value={formData.datas[3]}
                  onChange={(e) => handleDateChange(3, e.target.value)}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SignaturesSection; 