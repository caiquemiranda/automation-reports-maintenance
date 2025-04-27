import React from 'react';
import '../styles/ReportContent.css';
import InsertOptions from './InsertOptions';
import SummernoteEditor from './SummernoteEditor';

// Componentes placeholder para outros tipos
const ImageInsert = ({ onSave, onClose }) => {
    const fileInputRef = React.useRef();
    const urlInputRef = React.useRef();
    const [loading, setLoading] = React.useState(false);

    const handleInsert = () => {
        const url = urlInputRef.current.value.trim();
        if (url) {
            onSave(`<img src='${url}' alt='' style='max-width:100%' />`);
            return;
        }
        const file = fileInputRef.current.files[0];
        if (file) {
            setLoading(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                onSave(`<img src='${e.target.result}' alt='' style='max-width:100%' />`);
                setLoading(false);
            };
            reader.onerror = () => {
                alert('Erro ao ler o arquivo.');
                setLoading(false);
            };
            reader.readAsDataURL(file);
            return;
        }
        alert('Escolha um arquivo ou informe uma URL.');
    };

    return (
        <div className="editor-modal">
            <p><strong>Inserir Imagem</strong></p>
            <div style={{ marginBottom: 12 }}>
                <label>Escolher arquivo:</label><br />
                <input type="file" accept="image/*" ref={fileInputRef} />
            </div>
            <div style={{ marginBottom: 12 }}>
                <label>URL da imagem:</label><br />
                <input type="text" ref={urlInputRef} placeholder="https://..." style={{ width: '100%' }} />
            </div>
            <div style={{ textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={handleInsert} disabled={loading} style={{ marginRight: 8 }}>
                    {loading ? 'Carregando...' : 'Inserir Imagem'}
                </button>
                <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
            </div>
        </div>
    );
};

const TableInsert = ({ onSave, onClose }) => (
    <div className="editor-modal">
        <p>Insira uma tabela simples (3x2):</p>
        <div style={{ textAlign: 'right' }}>
            <button className="btn btn-primary" onClick={() => onSave('<table border="1" style="width:100%"><tr><th>Coluna 1</th><th>Coluna 2</th><th>Coluna 3</th></tr><tr><td></td><td></td><td></td></tr></table>')} style={{ marginRight: 8 }}>Salvar</button>
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        </div>
    </div>
);

const ListInsert = ({ onSave, onClose }) => (
    <div className="editor-modal">
        <p>Insira uma lista:</p>
        <textarea id="list-items" rows={4} style={{ width: '100%', marginBottom: 8 }} placeholder="Item 1\nItem 2\nItem 3" />
        <div style={{ textAlign: 'right' }}>
            <button className="btn btn-primary" onClick={() => {
                const value = document.getElementById('list-items').value;
                const html = `<ul>${value.split('\n').map(item => `<li>${item}</li>`).join('')}</ul>`;
                onSave(html);
            }} style={{ marginRight: 8 }}>Salvar</button>
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        </div>
    </div>
);

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
                    setShowEditor(true);
                    setEditorIndex(idx);
                    setCurrentEditContent('');
                    setInsertType(type);
                }}
            />
        ) : null;

    // Renderiza o editor correto inline
    const renderEditor = (idx) => {
        if (!(showEditor && editorIndex === idx)) return null;
        if (insertType === 'text') {
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
        }
        if (insertType === 'image-left' || insertType === 'image-right' || insertType === 'image-below' || insertType === 'image-above') {
            return (
                <ImageInsert
                    onSave={handleSaveText}
                    onClose={() => {
                        setShowEditor(false);
                        setEditorIndex(null);
                        setCurrentEditContent('');
                        setInsertType('');
                    }}
                />
            );
        }
        if (insertType === 'table') {
            return (
                <TableInsert
                    onSave={handleSaveText}
                    onClose={() => {
                        setShowEditor(false);
                        setEditorIndex(null);
                        setCurrentEditContent('');
                        setInsertType('');
                    }}
                />
            );
        }
        if (insertType === 'list') {
            return (
                <ListInsert
                    onSave={handleSaveText}
                    onClose={() => {
                        setShowEditor(false);
                        setEditorIndex(null);
                        setCurrentEditContent('');
                        setInsertType('');
                    }}
                />
            );
        }
        return null;
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