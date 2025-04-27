import React from 'react';
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
    editorIndex,
    currentEditContent
}) => {
    return (
        <div className="report-sheet-container">
            <div className="a4-sheet">
                {!isPreview && (
                    <button className="insert-topic-btn" onClick={handleInsertClick}>
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
                />
            </div>
        </div>
    );
};

export default ReportSheet; 