import React from 'react';
import '../styles/InsertOptions.css';

const InsertOptions = ({ handleTextClick }) => {
    return (
        <div className="insert-options">
            <button onClick={() => handleTextClick('text')}>Inserir texto</button>
            <button onClick={() => handleTextClick('table')}>Inserir tabela</button>
            <button onClick={() => handleTextClick('image')}>Inserir imagem</button>
        </div>
    );
};

export default InsertOptions; 