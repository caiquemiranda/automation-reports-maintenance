import React from 'react';
import '../styles/ReportContent.css';

const ReportContent = ({ contents, isPreview, handleTextClick, handleEditContent, handleRemoveContent }) => {
    if (contents.length === 0 && !isPreview) {
        return (
            <div className="empty-report">
                <p>Seu relatório está vazio. Clique em "inserir tópico" para começar.</p>
            </div>
        );
    }

    return (
        <div className={`report-content ${isPreview ? 'preview-mode' : ''}`}>
            {contents.map((block, idx) => (
                <div key={idx} className={`report-block ${isPreview ? 'preview-mode' : ''}`}>
                    {!isPreview && (
                        <button
                            className="insert-topic-btn insert-above"
                            onClick={() => handleTextClick(idx)}
                        >
                            inserir tópico
                        </button>
                    )}
                    
                    <div className="block-content" dangerouslySetInnerHTML={{ __html: block.html }} />
                    
                    {!isPreview && (
                        <div className="block-actions">
                            <button 
                                className="edit-btn"
                                onClick={() => handleEditContent(idx, block.html)}
                            >
                                Editar
                            </button>
                            <button 
                                className="remove-btn"
                                onClick={() => handleRemoveContent(idx)}
                            >
                                Remover
                            </button>
                        </div>
                    )}
                    
                    {!isPreview && (
                        <button
                            className="insert-topic-btn insert-below"
                            onClick={() => handleTextClick(idx + 1)}
                        >
                            inserir tópico
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReportContent; 