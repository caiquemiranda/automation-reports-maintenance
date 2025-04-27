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
    handleSaveText,
    setShowEditor,
    editorIndex
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
                        onSave={handleSaveText}
                        onClose={() => setShowEditor(false)}
                    />
                )}

                <ReportContent
                    contents={contents}
                    isPreview={isPreview}
                    handleTextClick={handleTextClick}
                />
            </div>
        </div>
    );
};

export default ReportSheet; 