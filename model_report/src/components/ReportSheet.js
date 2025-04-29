import React, { useState } from 'react';
import InsertOptions from './InsertOptions';
import ReportContent from './ReportContent';
import SummernoteEditor from './SummernoteEditor';
import '../styles/ReportSheet.css';

const ReportSheet = ({
    isPreview,
    showOptions,
    showEditor,
    contents,
    handleInsertClick,
    handleTextClick,
    handleEditContent,
    handleRemoveContent,
    handleSaveText,
    setShowEditor,
    setShowOptions,
    setEditorIndex,
    setCurrentEditContent,
    editorIndex,
    currentEditContent
}) => {
    const [insertType, setInsertType] = useState('');
    return (
        <div className="report-sheet-container">
            <div className="a4-sheet">
                {!isPreview && (
                    <button className="insert-topic-btn" onClick={() => handleInsertClick(0)}>
                        inserir tópico
                    </button>
                )}

                {showOptions && !isPreview && (
                    <InsertOptions handleTextClick={handleTextClick} />
                )}

                {showEditor && !isPreview && (
                    <SummernoteEditor
                        initialContent={currentEditContent}
                        onSave={handleSaveText}
                        onClose={() => setShowEditor(false)}
                    />
                )}

                <ReportContent
                    contents={contents}
                    isPreview={isPreview}
                    handleTextClick={handleTextClick}
                    handleEditContent={handleEditContent}
                    handleRemoveContent={handleRemoveContent}
                    showEditor={showEditor}
                    showOptions={showOptions}
                    editorIndex={editorIndex}
                    currentEditContent={currentEditContent}
                    handleSaveText={handleSaveText}
                    setShowEditor={setShowEditor}
                    setShowOptions={setShowOptions}
                    setEditorIndex={setEditorIndex}
                    setCurrentEditContent={setCurrentEditContent}
                    insertType={insertType}
                    setInsertType={setInsertType}
                />
            </div>
        </div>
    );
};

export default ReportSheet; 