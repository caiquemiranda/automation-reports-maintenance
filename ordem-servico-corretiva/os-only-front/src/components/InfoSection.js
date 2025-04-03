import React from 'react';

const InfoSection = ({ formData, onChange }) => {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  const modernInputStyle = {
    flex: 1,
    fontSize: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '6px 10px',
    background: 'white',
    outline: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05) inset',
    transition: 'border-color 0.3s, box-shadow 0.3s'
  };

  const InfoItem = ({ label, field, value, type = 'text', options = [] }) => {
    return (
      <div className="info-item" style={{ marginBottom: '8px' }}>
        <div className="info-label" style={{
          fontWeight: 'bold',
          minWidth: '150px',
          fontSize: '12px',
          color: '#444',
          display: 'flex',
          alignItems: 'center'
        }}>
          {label}:
        </div>
        {type === 'select' ? (
          <select
            className="info-value"
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            style={modernInputStyle}
          >
            {options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            className="info-value"
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            style={modernInputStyle}
          />
        )}
      </div>
    );
  };

  // Tipos de dispositivos predefinidos
  const tiposDispositivo = [
    'Detector de fumaça',
    'Acionador Manual',
    'Modulo de Zona'
  ];

  // Requisitantes predefinidos
  const requisitantes = [
    'Selecione um requisitante',
    'Pedro Silva',
    'Maria Oliveira',
    'João Santos',
    'Ana Pereira',
    'Carlos Eduardo'
  ];

  return (
    <div className="info-section" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '20px',
      backgroundColor: '#f9f9f9',
      padding: '15px',
      borderRadius: '5px',
      border: '1px solid #e8e8e8'
    }}>
      <div className="info-row" style={{ display: 'flex', gap: '20px' }}>
        <InfoItem
          label="TAG equipamento"
          field="tagEquipamento"
          value={formData.tagEquipamento || formData.codigoManutencao}
        />
        <InfoItem
          label="Data de Solicitação"
          field="dataSolicitacao"
          value={formData.dataSolicitacao}
        />
      </div>
      <div className="info-row" style={{ display: 'flex', gap: '20px' }}>
        <InfoItem
          label="Tipo do dispositivo"
          field="tipoDispositivo"
          value={formData.tipoDispositivo || formData.nomeEquipamento}
          type="select"
          options={tiposDispositivo}
        />
        <InfoItem
          label="Data de Execução"
          field="dataExecucao"
          value={formData.dataExecucao}
        />
      </div>
      <div className="info-row" style={{ display: 'flex', gap: '20px' }}>
        <InfoItem
          label="Localização"
          field="localizacao"
          value={formData.localizacao}
        />
        <InfoItem
          label="Prioridade"
          field="prioridade"
          value={formData.prioridade}
        />
      </div>
      <div className="info-row" style={{ display: 'flex', gap: '20px' }}>
        <InfoItem
          label="Número da O.S."
          field="numeroOsCompleto"
          value={`OS-${formData.numeroOs}`}
        />
        <InfoItem
          label="Centro de custo"
          field="centroCusto"
          value={formData.centroCusto}
        />
      </div>
      <div className="info-row" style={{ display: 'flex', gap: '20px' }}>
        <InfoItem
          label="Condição Inicial"
          field="condicaoInicial"
          value={formData.condicaoInicial || 'No Answer'}
          type="select"
          options={['No Answer', 'Dirty', 'Imode']}
        />
        <InfoItem
          label="Requisitante"
          field="requisitante"
          value={formData.requisitante || 'Selecione um requisitante'}
          type="select"
          options={requisitantes}
        />
      </div>
    </div>
  );
};

export default InfoSection; 