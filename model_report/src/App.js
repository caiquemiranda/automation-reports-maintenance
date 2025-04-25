import './App.css';
import React, { useState } from 'react';

function App() {
  const [showOptions, setShowOptions] = useState(false);

  const handleInsertClick = () => {
    setShowOptions((prev) => !prev);
  };

  return (
    <div className="App">
      <div className="a4-sheet">
        <button className="insert-topic-btn" onClick={handleInsertClick}>inserir tópico</button>
        {showOptions && (
          <div className="insert-options">
            <button> Tabela </button>
            <button> Foto com legenda lateral esquerda </button>
            <button> Foto com legenda na lateral direita </button>
            <button> Foto com legenda na lateral abaixo </button>
            <button> Foto com legenda acima </button>
            <button> Textos </button>
            <button> Lista </button>
          </div>
        )}
        {/* Conteúdo do relatório aqui */}
      </div>
    </div>
  );
}

export default App;
