import React, { useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ReportSheet from './components/ReportSheet';
import SaveReportModal from './components/SaveReportModal';
import StorageService from './services/StorageService';
import PdfService from './services/PdfService';
import './styles/App.css';

function App() {
  const [showOptions, setShowOptions] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editorIndex, setEditorIndex] = useState(null);
  const [contents, setContents] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [currentEditContent, setCurrentEditContent] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [currentReport, setCurrentReport] = useState({
    id: `report-${Date.now()}`,
    title: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const reportSheetRef = useRef(null);

  const handleInsertClick = () => {
    setShowOptions((prev) => !prev);
  };

  const handleTextClick = (index = null) => {
    setShowEditor(true);
    setEditorIndex(index);
    setShowOptions(false);
    setCurrentEditContent('');
  };

  const handleEditContent = (index, html) => {
    setShowEditor(true);
    setEditorIndex(index);
    setShowOptions(false);
    setCurrentEditContent(html);
  };

  const handleRemoveContent = (index) => {
    const newContents = [...contents];
    newContents.splice(index, 1);
    setContents(newContents);
  };

  const handleSaveText = (html) => {
    if (currentEditContent) {
      // Editar conteúdo existente
      const newContents = [...contents];
      newContents[editorIndex] = { type: 'text', html };
      setContents(newContents);
    } else if (editorIndex === null) {
      // Adicionar ao final
      setContents([...contents, { type: 'text', html }]);
    } else {
      // Inserir no meio
      const newContents = [...contents];
      newContents.splice(editorIndex, 0, { type: 'text', html });
      setContents(newContents);
    }
    setShowEditor(false);
    setEditorIndex(null);
    setCurrentEditContent('');
  };

  const handlePreviewToggle = () => {
    setIsPreview(!isPreview);
  };

  const handleOpenSaveModal = () => {
    setShowSaveModal(true);
  };

  const handleSaveReport = async (reportData) => {
    // Atualizar o relatório atual com os novos dados
    const reportToSave = {
      ...currentReport,
      ...reportData,
      contents,
    };

    try {
      // Salvar como relatório editável 
      StorageService.saveReport(reportToSave);

      // Gerar PDF para o usuário
      if (reportSheetRef.current) {
        const contentElement = reportSheetRef.current.querySelector('.a4-sheet');
        PdfService.generatePdf(reportToSave.title, contentElement);
      }

      // Atualizar o ID do relatório atual para um novo
      setCurrentReport({
        ...reportToSave,
        id: reportToSave.id, // Manter o mesmo ID após salvar
      });

      return true;
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      return false;
    }
  };

  const handleLoadReport = (reportId) => {
    const report = StorageService.getReportById(reportId);
    if (report) {
      // Carregar conteúdo do relatório
      setContents(report.contents || []);

      // Atualizar relatório atual
      setCurrentReport(report);

      // Ir para seção de relatório
      setIsPreview(false);
    }
  };

  const handleDeleteReport = (reportId) => {
    // Se o relatório atual for excluído, limpar o estado
    if (currentReport && currentReport.id === reportId) {
      setContents([]);
      setCurrentReport({
        id: `report-${Date.now()}`,
        title: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        isPreview={isPreview}
        onPreviewToggle={handlePreviewToggle}
        onSaveReport={handleOpenSaveModal}
        onLoadReport={handleLoadReport}
        onDeleteReport={handleDeleteReport}
      />

      <div className="report-sheet-wrapper" ref={reportSheetRef}>
        <ReportSheet
          isPreview={isPreview}
          showOptions={showOptions}
          showEditor={showEditor}
          contents={contents}
          editorIndex={editorIndex}
          currentEditContent={currentEditContent}
          handleInsertClick={handleInsertClick}
          handleTextClick={handleTextClick}
          handleEditContent={handleEditContent}
          handleRemoveContent={handleRemoveContent}
          handleSaveText={handleSaveText}
          setShowEditor={setShowEditor}
        />
      </div>

      {showSaveModal && (
        <SaveReportModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveReport}
          reportData={currentReport}
        />
      )}
    </div>
  );
}

export default App;
