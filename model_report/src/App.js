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

  const handleInsertClick = () => {
    setShowOptions((prev) => !prev);
  };

  const handleTextClick = (index = null) => {
    setShowEditor(true);
    setEditorIndex(index);
    setShowOptions(false);
  };

  const handleSaveText = (html) => {
    if (editorIndex === null) {
      setContents([...contents, { type: 'text', html }]);
    } else {
      const newContents = [...contents];
      newContents.splice(editorIndex, 0, { type: 'text', html });
      setContents(newContents);
    }
    setShowEditor(false);
    setEditorIndex(null);
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
        handleInsertClick={handleInsertClick}
        handleTextClick={handleTextClick}
        handleSaveText={handleSaveText}
        setShowEditor={setShowEditor}
      />
    </div>
  );
}

export default App;
