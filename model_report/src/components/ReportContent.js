import React from 'react';
import '../styles/ReportContent.css';
import InsertOptions from './InsertOptions';
import SummernoteEditor from './SummernoteEditor';

const ReportContent = ({
    contents,
    isPreview,
    handleTextClick,
    handleEditContent,
    handleRemoveContent,
    showEditor,
    showOptions,
    editorIndex,
    currentEditContent,
    handleSaveText,
    setShowEditor,
    setShowOptions,
    setEditorIndex,
    setCurrentEditContent
}) => {
    // Renderiza o menu de opções inline
    const renderInsertOptions = (idx) =>
        showOptions && editorIndex === idx ? (
            <InsertOptions
                handleTextClick={(type) => {
                    setShowOptions(false);
                    setShowEditor(true);
                    setEditorIndex(idx);
                    setCurrentEditContent('');
                }}
            />
        ) : null;

    // Renderiza o editor inline
    const renderEditor = (idx) =>
        showEditor && editorIndex === idx ? (
            <SummernoteEditor
                initialContent={currentEditContent}
                onSave={handleSaveText}
                onClose={() => {
                    setShowEditor(false);
                    setEditorIndex(null);
                    setCurrentEditContent('');
                }}
            />
        ) : null;

    if (contents.length === 0 && !isPreview) {
        return (
            <div className="empty-report">
                {renderInsertOptions(0)}
                {renderEditor(0)}
                <p>Seu relatório está vazio. Clique em "inserir tópico" para começar.</p>
            </div>
        );
    }

    return (
        <div className={`report-content ${isPreview ? 'preview-mode' : ''}`}>
            {contents.map((block, idx) => (
                <div key={idx} className={`report-block ${isPreview ? 'preview-mode' : ''}`}>
                    {!isPreview && (
                        <>
                            <button
                                className="insert-topic-btn insert-above"
                                onClick={() => {
                                    setShowOptions(true);
                                    setEditorIndex(idx);
                                    setShowEditor(false);
                                }}
                            >
                                inserir tópico
                            </button>
                            {renderInsertOptions(idx)}
                            {renderEditor(idx)}
                        </>
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
                        <>
                            <button
                                className="insert-topic-btn insert-below"
                                onClick={() => {
                                    setShowOptions(true);
                                    setEditorIndex(idx + 1);
                                    setShowEditor(false);
                                }}
                            >
                                inserir tópico
                            </button>
                            {renderInsertOptions(idx + 1)}
                            {renderEditor(idx + 1)}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReportContent; 