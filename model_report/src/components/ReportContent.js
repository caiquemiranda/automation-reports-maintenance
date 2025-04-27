import React from 'react';
import '../styles/ReportContent.css';

const ReportContent = ({ contents, isPreview, handleTextClick }) => {
    if (contents.length === 0 && !isPreview) {
        return (
            <div className="empty-report">
                <p>Seu relatório está vazio. Clique em "inserir tópico" para começar.</p>
            </div>
        );
    }

    return (
        <div className="report-content">
            {contents.map((block, idx) => (
                <div key={idx} className="report-block">
                    {!isPreview && (
                        <button
                            className="insert-topic-btn insert-above"
                            onClick={() => handleTextClick(idx)}
                        >
                            inserir tópico
                        </button>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: block.html }} />
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