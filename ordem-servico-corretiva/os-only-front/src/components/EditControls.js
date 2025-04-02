import React from 'react';

const EditControls = ({ onSave, onPrint }) => {
    const buttonStyle = {
        padding: '10px 18px',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background-color 0.3s, transform 0.1s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    return (
        <div className="edit-buttons" style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '15px',
            marginBottom: '25px'
        }}>
            <button
                id="btn-save"
                className="btn-action"
                onClick={onSave}
                style={{
                    ...buttonStyle,
                    backgroundColor: '#27ae60',
                }}
            >
                💾 Salvar Documento
            </button>
            <button
                id="btn-print"
                className="btn-action"
                onClick={onPrint}
                style={{
                    ...buttonStyle,
                    backgroundColor: '#3498db',
                }}
            >
                🖨️ Imprimir
            </button>
        </div>
    );
};

export default EditControls; 