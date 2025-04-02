import React from 'react';

const ConclusionSection = ({ conclusao, onChange }) => {
  const handleCheckboxChange = (field) => {
    onChange(field, !conclusao[field]);
  };

  return (
    <div className="conclusion-section" style={{
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#f9f9f9',
      borderRadius: '5px',
      border: '1px solid #e8e8e8'
    }}>
      <div style={{
        fontWeight: 'bold',
        fontSize: '14px',
        marginBottom: '15px',
        color: '#333'
      }}>
        CONCLUSÃO:
      </div>
      
      <div className="conclusion-options" style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        padding: '15px 0',
        backgroundColor: 'white',
        borderRadius: '4px',
        border: '1px solid #e0e0e0'
      }}>
        <div className="conclusion-option" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <input 
            type="checkbox" 
            id="equipamento-normal" 
            checked={conclusao.equipamentoNormal}
            onChange={() => handleCheckboxChange('equipamentoNormal')} 
            style={{
              width: '16px',
              height: '16px',
              cursor: 'pointer'
            }}
          />
          <label 
            htmlFor="equipamento-normal" 
            style={{fontSize: '13px', cursor: 'pointer'}}
          >
            Equipamento normal
          </label>
        </div>
        
        <div className="conclusion-option" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <input 
            type="checkbox" 
            id="equipamento-parcial" 
            checked={conclusao.equipamentoParcial}
            onChange={() => handleCheckboxChange('equipamentoParcial')} 
            style={{
              width: '16px',
              height: '16px',
              cursor: 'pointer'
            }}
          />
          <label 
            htmlFor="equipamento-parcial"
            style={{fontSize: '13px', cursor: 'pointer'}}
          >
            Equipamento parcial
          </label>
        </div>
        
        <div className="conclusion-option" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <input 
            type="checkbox" 
            id="equipamento-inop" 
            checked={conclusao.equipamentoInoperante}
            onChange={() => handleCheckboxChange('equipamentoInoperante')} 
            style={{
              width: '16px',
              height: '16px',
              cursor: 'pointer'
            }}
          />
          <label 
            htmlFor="equipamento-inop"
            style={{fontSize: '13px', cursor: 'pointer'}}
          >
            Equipamento inoperante
          </label>
        </div>
      </div>
    </div>
  );
};

export default ConclusionSection; 