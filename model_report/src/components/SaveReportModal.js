import React, { useState } from 'react';
import '../styles/SaveReportModal.css';

/**
 * Modal para salvar relatório com título e informações adicionais
 */
const SaveReportModal = ({ isOpen, onClose, onSave, reportData }) => {
  const [title, setTitle] = useState(reportData?.title || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor, informe um título para o relatório.');
      return;
    }

    setIsSaving(true);
    try {
      // Criar objeto do relatório com título e data
      const reportToSave = {
        ...reportData,
        title: title.trim(),
        updatedAt: new Date().toISOString(),
      };

      await onSave(reportToSave);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      alert('Ocorreu um erro ao salvar o relatório. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="save-report-modal">
        <div className="modal-header">
          <h3>Salvar Relatório</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="report-title">Título do Relatório</label>
            <input
              id="report-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite um título para o relatório"
              required
            />
          </div>
          <div className="form-info">
            <p>
              <strong>Nota:</strong> O relatório será salvo em dois formatos:
            </p>
            <ul>
              <li>PDF para visualização</li>
              <li>Formato editável para modificações futuras</li>
            </ul>
            <p>Você poderá acessar este relatório pelo histórico a qualquer momento.</p>
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar Relatório'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveReportModal; 