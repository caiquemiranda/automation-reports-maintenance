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
        <div className="attachment-section">
            <div className="section-label">ANEXOS:</div>
            <div className="attachment-container">
                <div id="image-attachments" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                    {anexos.map((anexo) => (
                        <div key={anexo.id} className="attachment-item" style={{ position: 'relative', width: '200px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                            <img
                                src={anexo.url}
                                alt="Anexo"
                                className="attachment-image"
                                style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
                            />
                            <textarea
                                className="attachment-description"
                                value={anexo.description}
                                onChange={(e) => handleDescriptionChange(anexo.id, e)}
                                style={{
                                    padding: '5px',
                                    fontSize: '12px',
                                    minHeight: '40px',
                                    width: '100%',
                                    border: 'none',
                                    borderTop: '1px solid #eee',
                                    resize: 'vertical',
                                    outline: 'none'
                                }}
                            />
                            <button
                                className="remove-attachment"
                                onClick={() => onRemoveAttachment(anexo.id)}
                                style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 0, 0, 0.7)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px'
                                }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
                <div className="attachment-controls" style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        className="btn-attachment"
                        onClick={handleAddClick}
                        style={{
                            padding: '8px 15px',
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Adicionar imagem
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