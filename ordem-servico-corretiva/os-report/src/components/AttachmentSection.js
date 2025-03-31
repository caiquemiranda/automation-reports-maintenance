import React, { useState, useRef, useEffect } from 'react';

/**
 * Componente para a seção de anexos
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.attachments - Lista de anexos
 * @param {Function} props.setAttachments - Função para atualizar a lista de anexos
 */
const AttachmentSection = ({ attachments, setAttachments }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);
  const attachmentContainerRef = useRef(null);
  const [draggedItem, setDraggedItem] = useState(null);

  // Efeito para configurar o sistema de arrastar e soltar após renderização
  useEffect(() => {
    setupDragAndDrop();
  }, [attachments]);

  // Configurar funcionalidade de arrastar e soltar
  const setupDragAndDrop = () => {
    const attachmentItems = document.querySelectorAll('.attachment-item');
    
    attachmentItems.forEach((item) => {
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragend', handleDragEnd);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('dragenter', handleDragEnter);
      item.addEventListener('dragleave', handleDragLeave);
      item.addEventListener('drop', handleDrop);
      
      // Adicionar atributo para permitir arrastar
      item.setAttribute('draggable', 'true');
    });
    
    return () => {
      attachmentItems.forEach((item) => {
        item.removeEventListener('dragstart', handleDragStart);
        item.removeEventListener('dragend', handleDragEnd);
        item.removeEventListener('dragover', handleDragOver);
        item.removeEventListener('dragenter', handleDragEnter);
        item.removeEventListener('dragleave', handleDragLeave);
        item.removeEventListener('drop', handleDrop);
      });
    };
  };

  // Handlers para arrastar e soltar
  const handleDragStart = (e) => {
    const target = e.target.closest('.attachment-item');
    if (!target) return;
    
    setDraggedItem(target);
    target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', target.getAttribute('data-index'));
  };

  const handleDragEnd = (e) => {
    if (draggedItem) {
      draggedItem.classList.remove('dragging');
      setDraggedItem(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    const target = e.target.closest('.attachment-item');
    if (target && target !== draggedItem) {
      target.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e) => {
    const target = e.target.closest('.attachment-item');
    if (target) {
      target.classList.remove('drag-over');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const target = e.target.closest('.attachment-item');
    
    if (!target || !draggedItem || target === draggedItem) return;
    
    const fromIndex = parseInt(draggedItem.getAttribute('data-index'));
    const toIndex = parseInt(target.getAttribute('data-index'));
    
    // Reordenar os anexos
    const newAttachments = [...attachments];
    const [movedItem] = newAttachments.splice(fromIndex, 1);
    newAttachments.splice(toIndex, 0, movedItem);
    
    setAttachments(newAttachments);
    target.classList.remove('drag-over');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddAttachment = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAttachment = {
          id: `attachment-${Date.now()}`,
          src: e.target.result,
          description: description || selectedFile.name
        };
        setAttachments([...attachments, newAttachment]);
        setSelectedFile(null);
        setDescription('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveAttachment = (id) => {
    const updatedAttachments = attachments.filter(attachment => attachment.id !== id);
    setAttachments(updatedAttachments);
  };

  return (
    <div className="attachment-section">
      <div className="section-label">ANEXOS:</div>

      <div className="attachment-container">
        <div id="image-attachments" ref={attachmentContainerRef}>
          {attachments.map((attachment, index) => (
            <div 
              key={attachment.id} 
              className="attachment-item" 
              data-index={index}
            >
              <button
                className="remove-attachment"
                onClick={() => handleRemoveAttachment(attachment.id)}
              >
                ×
              </button>
              <img
                src={attachment.src}
                alt="Anexo"
                className="attachment-image"
              />
              <div
                className="attachment-description"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const updatedAttachments = [...attachments];
                  updatedAttachments[index].description = e.target.innerText;
                  setAttachments(updatedAttachments);
                }}
              >
                {attachment.description}
              </div>
            </div>
          ))}
        </div>

        <div className="attachment-controls">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            id="attachment-input"
            style={{ display: 'none' }}
          />
          <label htmlFor="attachment-input" className="btn-attachment">
            Selecionar Imagem
          </label>

          {selectedFile && (
            <>
              <input
                type="text"
                placeholder="Descrição do anexo"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
                style={{ width: '200px', marginLeft: '10px' }}
              />
              <button
                className="btn-attachment"
                onClick={handleAddAttachment}
                style={{ marginLeft: '10px' }}
              >
                Adicionar
              </button>
            </>
          )}
        </div>
      </div>
      <div className="attachment-instructions">
        <small>* Arraste as imagens para reorganizá-las conforme desejado</small>
      </div>
    </div>
  );
};

export default AttachmentSection; 