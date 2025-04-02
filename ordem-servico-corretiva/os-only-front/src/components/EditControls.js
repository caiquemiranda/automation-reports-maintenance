import React from 'react';

const EditControls = ({ onSave, onPrint }) => {
  return (
    <div className="edit-buttons" style={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      gap: '10px', 
      marginBottom: '20px' 
    }}>
      <button 
        id="btn-save" 
        className="btn-action" 
        onClick={onSave}
        style={{
          padding: '8px 15px',
          backgroundColor: '#2980b9',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Salvar Documento
      </button>
      <button 
        id="btn-print" 
        className="btn-action" 
        onClick={onPrint}
        style={{
          padding: '8px 15px',
          backgroundColor: '#2980b9',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Imprimir
      </button>
    </div>
  );
};

export default EditControls; 