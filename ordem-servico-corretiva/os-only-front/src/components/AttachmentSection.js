import React, { useRef } from 'react';

const AttachmentSection = ({ anexos, onAddAttachment, onRemoveAttachment, onChangeDescription }) => {
    const fileInputRef = useRef(null);

    const handleAddClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onAddAttachment(e.target.files);
            // Limpar input para permitir selecionar o mesmo arquivo novamente
            e.target.value = "";
        }
    };

    const handleDescriptionChange = (id, e) => {
        onChangeDescription(id, e.target.value);
    };

    return (
        <div className="attachment-section" style={{
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
                ANEXOS:
            </div>
            
            <div className="attachment-container" style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '5px',
                border: '1px solid #e0e0e0'
            }}>
                <div id="image-attachments" style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '15px', 
                    marginBottom: '20px' 
                }}>
                    {anexos.map((anexo) => (
                        <div key={anexo.id} className="attachment-item" style={{ 
                            position: 'relative', 
                            width: '200px', 
                            border: '1px solid #e0e0e0', 
                            borderRadius: '6px', 
                            overflow: 'hidden',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}>
                            <img
                                src={anexo.url}
                                alt="Anexo"
                                className="attachment-image"
                                style={{ 
                                    width: '100%', 
                                    height: '150px', 
                                    objectFit: 'cover', 
                                    display: 'block',
                                    borderBottom: '1px solid #f0f0f0'
                                }}
                            />
                            <textarea
                                className="attachment-description"
                                value={anexo.description}
                                onChange={(e) => handleDescriptionChange(anexo.id, e)}
                                placeholder="Descrição do anexo..."
                                style={{
                                    padding: '8px',
                                    fontSize: '12px',
                                    minHeight: '40px',
                                    width: '100%',
                                    border: 'none',
                                    outline: 'none',
                                    resize: 'vertical',
                                    backgroundColor: '#fafafa'
                                }}
                            />
                            <button
                                className="remove-attachment"
                                onClick={() => onRemoveAttachment(anexo.id)}
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(231, 76, 60, 0.85)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <div className="attachment-controls" style={{ 
                    display: 'flex', 
                    justifyContent: 'center' 
                }}>
                    <button
                        className="btn-attachment"
                        onClick={handleAddClick}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#2980b9',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'background-color 0.3s'
                        }}
                    >
                        + Adicionar imagem
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        id="attachment-upload"
                        onChange={handleFileChange}
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AttachmentSection; 