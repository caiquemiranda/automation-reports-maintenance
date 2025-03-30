import React, { useRef } from 'react';

/**
 * Componente para a seção de anexos
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.attachments - Lista de anexos
 * @param {Function} props.setAttachments - Função para atualizar a lista de anexos
 */
const AttachmentSection = ({ attachments, setAttachments }) => {
  const fileInputRef = useRef(null);

  const handleAttachmentUpload = (e) => {
    const files = e.target.files;
    
    if (!files.length) return;
    
    const newAttachments = [...attachments];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        newAttachments.push({
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          src: event.target.result,
          description: 'Descrição da imagem...'
        });
        setAttachments([...newAttachments]);
      };
      
      reader.readAsDataURL(file);
    });
  };
  
  const handleAttachmentDescriptionChange = (id, description) => {
    const updatedAttachments = attachments.map(attachment => 
      attachment.id === id ? { ...attachment, description } : attachment
    );
    setAttachments(updatedAttachments);
  };
  
  const removeAttachment = (id) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  return (
    <div className="attachment-section">
      <div className="section-label">ANEXOS:</div>
      <div className="attachment-container">
        <div id="image-attachments">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="attachment-item">
              <img
                src={attachment.src}
                alt="Anexo"
                className="attachment-image"
              />
              <textarea
                className="attachment-description"
                value={attachment.description}
                onChange={(e) => handleAttachmentDescriptionChange(attachment.id, e.target.value)}
                placeholder="Descrição da imagem..."
              />
              <button
                className="remove-attachment"
                onClick={() => removeAttachment(attachment.id)}
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
              ref={fileInputRef}
              onChange={handleAttachmentUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentSection; 