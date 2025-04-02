import React from 'react';

const ServiceSection = ({ servico, observacao, acaoCorretiva, acaoCorretivaItens, onChange }) => {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  const handleItemChange = (index, value) => {
    const newItems = [...acaoCorretivaItens];
    newItems[index] = value;
    onChange('acaoCorretivaItens', newItems);
  };

  const addItem = () => {
    onChange('acaoCorretivaItens', [...acaoCorretivaItens, '']);
  };

  const removeItem = (index) => {
    const newItems = [...acaoCorretivaItens];
    newItems.splice(index, 1);
    onChange('acaoCorretivaItens', newItems);
  };

  const textareaStyle = {
    width: '100%',
    minHeight: '30px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '10px',
    fontSize: '12px',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical',
    outline: 'none',
    background: 'white',
    marginTop: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05) inset',
    transition: 'border-color 0.3s, box-shadow 0.3s'
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

  const buttonStyle = {
    backgroundColor: '#2980b9',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '12px',
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'background-color 0.3s'
  };

  return (
    <>
      <div style={sectionStyle}>
        <label style={labelStyle}>SERVIÇO:</label>
        <textarea
          className="section-content"
          value={servico}
          onChange={(e) => handleChange('servico', e.target.value)}
          style={textareaStyle}
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>OBSERVAÇÃO:</label>
        <textarea
          className="section-content"
          value={observacao}
          onChange={(e) => handleChange('observacao', e.target.value)}
          style={textareaStyle}
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>AÇÃO CORRETIVA:</label>
        <div className="action-content">
          <textarea
            className="section-content"
            value={acaoCorretiva}
            onChange={(e) => handleChange('acaoCorretiva', e.target.value)}
            style={{...textareaStyle, marginBottom: '15px'}}
          />
          
          <div style={{ margin: '10px 0' }}>
            <label style={{ ...labelStyle, fontSize: '13px' }}>ITENS DE VERIFICAÇÃO:</label>
            <ul style={{ 
              paddingLeft: '20px', 
              fontSize: '12px',
              marginTop: '10px',
              listStyleType: 'circle' 
            }}>
              {acaoCorretivaItens.map((item, index) => (
                <li key={index} style={{ 
                  marginBottom: '8px', 
                  display: 'flex', 
                  alignItems: 'center',
                  backgroundColor: 'white',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0'
                }}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    style={{
                      border: 'none',
                      fontSize: '12px',
                      flex: 1,
                      outline: 'none',
                      background: 'transparent'
                    }}
                  />
                  <button 
                    onClick={() => removeItem(index)}
                    style={{
                      marginLeft: '5px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#e74c3c',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%'
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            
            <button
              onClick={addItem}
              style={buttonStyle}
            >
              + Adicionar item
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceSection; 