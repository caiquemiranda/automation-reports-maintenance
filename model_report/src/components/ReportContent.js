import React from 'react';
import '../styles/ReportContent.css';
import InsertOptions from './InsertOptions';
import SummernoteEditor from './SummernoteEditor';
import ListBlock from './ListBlock';

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
    setCurrentEditContent,
    insertType,
    setInsertType
}) => {
    // Renderiza o menu de opções inline
    const renderInsertOptions = (idx) =>
        showOptions && editorIndex === idx ? (
            <InsertOptions
                handleTextClick={(type) => {
                    setShowOptions(false);
                    if (type === 'text') {
                        setShowEditor(true);
                        setEditorIndex(idx);
                        setCurrentEditContent('');
                        setInsertType(type);
                    } else {
                        setInsertType(type);
                        // O fluxo de lista e outros tipos é tratado no App.js
                    }
                }}
            />
        ) : null;

    // Renderiza o editor inline apenas para texto
    const renderEditor = (idx) => {
        if (!(showEditor && editorIndex === idx && insertType === 'text')) return null;
        return (
            <SummernoteEditor
                initialContent={currentEditContent}
                onSave={handleSaveText}
                onClose={() => {
                    setShowEditor(false);
                    setEditorIndex(null);
                    setCurrentEditContent('');
                    setInsertType('');
                }}
            />
        );
    };

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
                                    setInsertType('');
                                }}
                            >
                                inserir tópico
                            </button>
                            {renderInsertOptions(idx)}
                            {renderEditor(idx)}
                        </>
                    )}
                    <div className="block-content">
                      {block.type === 'list' ? (
                        <ListBlock data={block.data} />
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: block.html }} />
                      )}
                    </div>
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
                                    setInsertType('');
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