import React from 'react';
import '../styles/TemplateList.css';

const TemplateList = ({ templates, onInsert, onEdit, onDelete }) => {
    return (
        <div className="template-list">
            <div className="template-list-header">
                <h3>Modelos de Relatório</h3>
                <button className="template-add-btn" onClick={() => onEdit(null)}>+ Novo Modelo</button>
            </div>
            {templates.length === 0 ? (
                <div className="template-empty">Nenhum modelo cadastrado.</div>
            ) : (
                <ul>
                    {templates.map((tpl) => (
                        <li key={tpl.id} className="template-item">
                            <span className="template-title">{tpl.title}</span>
                            <div className="template-actions">
                                <button className="template-insert-btn" onClick={() => onInsert(tpl.id)}>Inserir</button>
                                <button className="template-edit-btn" onClick={() => onEdit(tpl.id)}>Editar</button>
                                <button className="template-delete-btn" onClick={() => onDelete(tpl.id)}>Excluir</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TemplateList; 