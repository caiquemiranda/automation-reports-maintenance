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
  const [editingSize, setEditingSize] = useState(null);

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
    // Não permitir arrastar se estiver editando tamanho
    if (editingSize !== null) {
      e.preventDefault();
      return;
    }

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
          description: description || selectedFile.name,
          width: 200, // Largura padrão inicial
          height: 'auto' // Altura automática para manter proporção
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

  // Iniciar edição de tamanho para uma imagem
  const startSizeEdit = (index) => {
    setEditingSize(index);
  };

  // Finalizar edição de tamanho
  const endSizeEdit = () => {
    setEditingSize(null);
  };

  // Ajustar o tamanho da imagem
  const handleSizeChange = (index, sizeType, newValue) => {
    const updatedAttachments = [...attachments];
    updatedAttachments[index][sizeType] = newValue;
    setAttachments(updatedAttachments);
  };

  // Aplicar layout predefinido para as imagens
  const applyLayout = (layoutType) => {
    if (attachments.length === 0) return;

    const updatedAttachments = [...attachments];

    switch (layoutType) {
      case '2-landscape':
        // Layout para 2 imagens em paisagem
        updatedAttachments.forEach((attachment, index) => {
          attachment.width = '325';
          attachment.height = 'auto';
        });
        break;

      case '3-portrait':
        // Layout para 3 imagens em retrato
        updatedAttachments.forEach((attachment, index) => {
          attachment.width = '225';
          attachment.height = 'auto';
        });
        break;

      case 'full-width':
        // Uma imagem em largura total
        updatedAttachments.forEach((attachment, index) => {
          attachment.width = '690';
          attachment.height = 'auto';
        });
        break;

      case 'side-by-side':
        // Duas imagens lado a lado com largura calculada para caber exatamente
        if (attachments.length >= 2) {
          // Primeira metade das imagens na primeira linha
          for (let i = 0; i < Math.min(2, attachments.length); i++) {
            updatedAttachments[i].width = '325';
            updatedAttachments[i].height = 'auto';
          }
          // Restante das imagens em largura total
          for (let i = 2; i < attachments.length; i++) {
            updatedAttachments[i].width = '690';
            updatedAttachments[i].height = 'auto';
          }
        }
        break;

      default:
        break;
    }

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
              className={`attachment-item ${editingSize === index ? 'editing-size' : ''}`}
              data-index={index}
              style={{ width: attachment.width === 'auto' ? 'auto' : `${attachment.width}px` }}
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
                style={{
                  width: attachment.width === 'auto' ? 'auto' : '100%',
                  height: attachment.height === 'auto' ? 'auto' : `${attachment.height}px`,
                  maxHeight: attachment.height === 'auto' ? '150px' : 'none'
                }}
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

              {editingSize === index ? (
                <div className="size-controls">
                  <div className="size-control-row">
                    <label>Largura:</label>
                    <div className="size-input-group">
                      <input
                        type="number"
                        value={attachment.width === 'auto' ? '' : attachment.width}
                        onChange={(e) => handleSizeChange(index, 'width', e.target.value)}
                        placeholder="px"
                        className="size-input"
                        min="50"
                        max="690"
                      />
                      <span className="size-input-unit">px</span>
                      <select
                        onChange={(e) => handleSizeChange(index, 'width', e.target.value)}
                        className="size-presets"
                      >
                        <option value="">Predefinições</option>
                        <option value="auto">Auto</option>
                        <option value="225">225px (3 imagens)</option>
                        <option value="325">325px (2 imagens)</option>
                        <option value="450">450px</option>
                        <option value="550">550px</option>
                        <option value="690">690px (largura total)</option>
                      </select>
                    </div>
                  </div>
                  <div className="size-control-row">
                    <label>Altura:</label>
                    <div className="size-input-group">
                      <input
                        type="number"
                        value={attachment.height === 'auto' ? '' : attachment.height}
                        onChange={(e) => handleSizeChange(index, 'height', e.target.value)}
                        placeholder="px"
                        className="size-input"
                        min="50"
                        max="500"
                      />
                      <span className="size-input-unit">px</span>
                      <select
                        onChange={(e) => handleSizeChange(index, 'height', e.target.value)}
                        className="size-presets"
                      >
                        <option value="">Predefinições</option>
                        <option value="auto">Auto</option>
                        <option value="100">100px</option>
                        <option value="150">150px</option>
                        <option value="200">200px</option>
                        <option value="250">250px</option>
                        <option value="300">300px</option>
                        <option value="325">325px</option>
                        <option value="350">350px</option>
                      </select>
                    </div>
                  </div>
                  <button
                    className="size-control-done"
                    onClick={endSizeEdit}
                  >
                    Concluir
                  </button>
                </div>
              ) : (
                <div className="attachment-controls-overlay">
                  <button
                    className="btn-resize"
                    title="Ajustar tamanho"
                    onClick={() => startSizeEdit(index)}
                  >
                    <span role="img" aria-label="resize">↔️</span>
                  </button>
                </div>
              )}
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

        {attachments.length > 0 && (
          <div className="layout-hint">
            <span style={{ fontSize: '12px', marginRight: '5px' }}>Layouts pré-definidos:</span>
            <button
              className="layout-button"
              onClick={() => applyLayout('2-landscape')}
              title="Ideal para 2 imagens lado a lado"
            >
              2 Fotos Paisagem
            </button>
            <button
              className="layout-button"
              onClick={() => applyLayout('3-portrait')}
              title="Ideal para 3 imagens lado a lado"
            >
              3 Fotos Retrato
            </button>
            <button
              className="layout-button"
              onClick={() => applyLayout('full-width')}
              title="Imagem em largura total"
            >
              Largura Total
            </button>
          </div>
        )}
      </div>
      <div className="attachment-instructions">
        <small>* Arraste as imagens para reorganizá-las conforme desejado ou clique no botão de redimensionar para ajustar o tamanho</small>
      </div>
    </div>
  );
};

export default AttachmentSection; 