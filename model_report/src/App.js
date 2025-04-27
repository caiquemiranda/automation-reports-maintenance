import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ReportSheet from './components/ReportSheet';
import './styles/App.css';

function App() {
  const [showOptions, setShowOptions] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editorIndex, setEditorIndex] = useState(null);
  const [contents, setContents] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [currentEditContent, setCurrentEditContent] = useState('');

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

  return (
    <div className="app-container">
      <Sidebar
        isPreview={isPreview}
        onPreviewToggle={handlePreviewToggle}
      />

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
  );
}

export default App;
