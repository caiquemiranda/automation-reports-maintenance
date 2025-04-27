import React from 'react';
import '../styles/InsertOptions.css';

const InsertOptions = ({ handleTextClick }) => {
    return (
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
    );
};

export default InsertOptions; 