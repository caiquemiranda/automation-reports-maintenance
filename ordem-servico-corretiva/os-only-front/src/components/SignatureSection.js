import React from 'react';

const ResponsavelMaterialSection = ({ tecnicoResponsavel, materiaisUtilizados, onChange }) => {
    const textareaStyle = {
        width: '100%',
        minHeight: '80px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '10px',
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
        resize: 'vertical',
        outline: 'none',
        background: 'transparent',
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

    return (
        <div className="responsavel-material-section">
            <div style={sectionStyle}>
                <label style={labelStyle}>TÉCNICO RESPONSÁVEL:</label>
                <textarea
                    value={tecnicoResponsavel}
                    onChange={(e) => onChange('tecnicoResponsavel', e.target.value)}
                    placeholder="Informe o nome e registro do técnico responsável..."
                    style={textareaStyle}
                />
            </div>

            <div style={sectionStyle}>
                <label style={labelStyle}>MATERIAIS UTILIZADOS:</label>
                <textarea
                    value={materiaisUtilizados}
                    onChange={(e) => onChange('materiaisUtilizados', e.target.value)}
                    placeholder="Liste todos os materiais utilizados neste serviço..."
                    style={textareaStyle}
                />
            </div>
        </div>
    );
};

export default ResponsavelMaterialSection; 