import React from 'react';
import './AttachmentSection.css';
import { useOrdemServico } from '../../../contexts/OrdemServicoContext';
import EditableField from '../../../components/common/EditableField';

const AttachmentSection = () => {
    const {
        attachments,
        handleAddAttachment,
        handleRemoveAttachment,
        handleUpdateAttachmentDescription
    } = useOrdemServico();

    const handleFileUpload = (e) => {
        if (e.target.files.length > 0) {
            handleAddAttachment(e.target.files);
        }
    };

    return (
        <div className="attachment-section">
            <div className="section-label">ANEXOS:</div>
            <div className="attachment-container">
                <div id="image-attachments">
                    {attachments.map(attachment => (
                        <div key={attachment.id} className="attachment-item">
                            <img src={attachment.src} alt="Anexo" className="attachment-image" />
                            <EditableField
                                className="attachment-description"
                                value={attachment.description}
                                onChange={(value) => handleUpdateAttachmentDescription(attachment.id, value)}
                            />
                            <button
                                className="remove-attachment"
                                onClick={() => handleRemoveAttachment(attachment.id)}
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