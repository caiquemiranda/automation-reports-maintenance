import React, { useEffect, useState } from 'react';
import ReportSheet from './ReportSheet';
import '../styles/ReportSheet.css';
import '../styles/ListBlock.css';

const ReportPrintPreview = () => {
  const [contents, setContents] = useState([]);
  const [isPreview, setIsPreview] = useState(true);

  useEffect(() => {
    // Recupera os dados do relatório do localStorage
    const data = localStorage.getItem('report_print_preview');
    if (data) {
      setContents(JSON.parse(data));
    }
    const previewFlag = localStorage.getItem('report_print_isPreview');
    setIsPreview(previewFlag === 'true');
  }, []);

  return (
    <div className="report-sheet-container" style={{ background: '#fff' }}>
      <button
        className="btn btn-primary btn-print-pdf"
        style={{ margin: '24px 0 16px 0', display: 'block' }}
        onClick={() => window.print()}
      >
        Exportar PDF
      </button>
      <ReportSheet
        isPreview={isPreview}
        showOptions={false}
        showEditor={false}
        contents={contents}
        handleInsertClick={() => {}}
        handleTextClick={() => {}}
        handleEditContent={() => {}}
        handleRemoveContent={() => {}}
        handleSaveText={() => {}}
        setShowEditor={() => {}}
        setShowOptions={() => {}}
        setEditorIndex={() => {}}
        setCurrentEditContent={() => {}}
        editorIndex={null}
        currentEditContent={''}
      />
    </div>
  );
};

export default ReportPrintPreview; 