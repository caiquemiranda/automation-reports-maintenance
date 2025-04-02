import React from 'react';
import './AttachmentSection.css';

const AttachmentSection = ({ attachments, onAddAttachment, onRemoveAttachment, onUpdateDescription }) => {
    const handleFileUpload = (e) => {
        if (e.target.files.length > 0) {
            onAddAttachment(e.target.files);
        }
    };

    const handleDescriptionChange = (id, e) => {
        onUpdateDescription(id, e.target.textContent);
    };

    return (
        <div className="attachment-section">
            <div className="section-label">ANEXOS:</div>
            <div className="attachment-container">
                <div id="image-attachments">
                    {attachments.map(attachment => (
                        <div key={attachment.id} className="attachment-item">
                            <img src={attachment.src} alt="Anexo" className="attachment-image" />
                            <div
                                className="attachment-description"
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                                onBlur={(e) => handleDescriptionChange(attachment.id, e)}
                            >
                                {attachment.description}
                            </div>
                            <button
                                className="remove-attachment"
                                onClick={() => onRemoveAttachment(attachment.id)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
                <div className="attachment-controls">
                    <div className="attachment-button">
                        <label htmlFor="attachment-upload" className="btn-attachment">Adicionar imagem</label>
                        <input
                            type="file"
                            id="attachment-upload"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttachmentSection; 