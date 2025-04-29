import React from 'react';
import '../styles/InsertOptions.css';

const InsertOptions = ({ handleTextClick }) => {
    return (
        <div className="insert-options">
            <button onClick={() => handleTextClick('text')}> Textos </button>
            <button onClick={() => handleTextClick('table')}> Tabela </button>
            <button onClick={() => handleTextClick('image-left')}> Foto com legenda lateral esquerda </button>
            <button onClick={() => handleTextClick('image-right')}> Foto com legenda na lateral direita </button>
            <button onClick={() => handleTextClick('image-below')}> Foto com legenda na lateral abaixo </button>
            <button onClick={() => handleTextClick('image-above')}> Foto com legenda acima </button>
        </div>
    );
};

export default InsertOptions; 