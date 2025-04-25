import './App.css';
import React, { useState } from 'react';
import SummernoteEditor from './SummernoteEditor';

function App() {
  const [showOptions, setShowOptions] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editorIndex, setEditorIndex] = useState(null);
  const [contents, setContents] = useState([]);

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

  return (
    <div className="App">
      <div className="a4-sheet">
        <button className="insert-topic-btn" onClick={handleInsertClick}>inserir tópico</button>
        {showOptions && (
          <div className="insert-options">
            <button onClick={() => handleTextClick(null)}> Textos </button>
            {/* Outras opções */}
            <button disabled> Tabela </button>
            <button disabled> Foto com legenda lateral esquerda </button>
            <button disabled> Foto com legenda na lateral direita </button>
            <button disabled> Foto com legenda na lateral abaixo </button>
            <button disabled> Foto com legenda acima </button>
            <button disabled> Lista </button>
          </div>
        )}
        {showEditor && (
          <SummernoteEditor
            onSave={handleSaveText}
            onClose={() => setShowEditor(false)}
          />
        )}
        <div className="report-content">
          {contents.map((block, idx) => (
            <div key={idx} className="report-block">
              <button className="add-btn" onClick={() => handleTextClick(idx)}>Adicionar acima</button>
              <div dangerouslySetInnerHTML={{ __html: block.html }} />
              <button className="add-btn" onClick={() => handleTextClick(idx + 1)}>Adicionar abaixo</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
