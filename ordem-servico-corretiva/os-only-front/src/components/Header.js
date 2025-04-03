import React from 'react';
import logo from '../assets/logo_IBS.png';

const Header = ({ numeroOs, manutencaoCorretiva, naoProgramados, onChange }) => {
  const handleNumeroOsChange = (e) => {
    onChange('numeroOs', e.target.value);
  };

  const handleCheckboxChange = (field) => {
    if (field === 'manutencaoCorretiva') {
      onChange('manutencaoCorretiva', !manutencaoCorretiva);
    } else if (field === 'naoProgramados') {
      onChange('naoProgramados', !naoProgramados);
    }
  };

  return (
    <div className="header" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#f9f9f9',
      borderRadius: '5px',
      border: '1px solid #e8e8e8'
    }}>
      <div className="title">
        <h1 className="text-center" style={{
          fontSize: '20px',
          marginBottom: '15px',
          color: '#2980b9',
          fontWeight: 'bold'
        }}>
          ORDEM DE SERVIÇO CORRETIVA
          <input 
            type="text" 
            id="numero-os" 
            value={numeroOs} 
            onChange={handleNumeroOsChange} 
            style={{
              display: 'inline-block',
              minWidth: '60px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              padding: '4px 8px',
              background: 'white',
              outline: 'none',
              textAlign: 'center',
              fontSize: '18px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05) inset',
              color: '#333'
            }}
          />
        </h1>
        <div className="checkboxes" style={{
          display: 'flex',
          gap: '20px',
          marginTop: '15px'
        }}>
          <div className="checkbox-item" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #e0e0e0'
          }}>
            <input 
              type="checkbox" 
              id="manutencao" 
              name="manutencao" 
              checked={manutencaoCorretiva}
              onChange={() => handleCheckboxChange('manutencaoCorretiva')} 
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer'
              }}
            />
            <label htmlFor="manutencao" style={{
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              MANUTENÇÃO CORRETIVA
            </label>
          </div>
          <div className="checkbox-item" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #e0e0e0'
          }}>
            <input 
              type="checkbox" 
              id="naoprogramados" 
              name="naoprogramados" 
              checked={naoProgramados}
              onChange={() => handleCheckboxChange('naoProgramados')} 
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer'
              }}
            />
            <label htmlFor="naoprogramados" style={{
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              NÃO PROGRAMADOS
            </label>
          </div>
        </div>
      </div>
      <div className="logo" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: 'white',
        borderRadius: '5px',
        border: '1px solid #e0e0e0'
      }}>
        <img src={logo} alt="IBSystems Logo" className="logo-img" style={{
          maxWidth: '120px',
          maxHeight: '60px'
        }} />
      </div>
    </div>
  );
};

export default Header; 