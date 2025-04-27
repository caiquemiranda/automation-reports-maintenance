import React, { useState, useEffect } from 'react';

const TemplateModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setContent(initialData.content || '');
        } else {
            setTitle('');
            setContent('');
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSave({
            id: initialData?.id || Date.now().toString(),
            title: title.trim(),
            content: content
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialData ? 'Editar Modelo' : 'Novo Modelo'}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Título:</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label>Conteúdo padrão:</label>
                        <textarea value={content} onChange={e => setContent(e.target.value)} rows={6} />
                    </div>
                    <div style={{ marginTop: 16, textAlign: 'right' }}>
                        <button type="submit" className="btn btn-primary" style={{ marginRight: 8 }}>Salvar</button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TemplateModal; 