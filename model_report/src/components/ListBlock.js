import React from 'react';
import '../styles/ListBlock.css';

const ListBlock = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="list-block-empty">Nenhum dado de lista encontrado.</div>;
  }

  // Cabeçalhos a partir da primeira linha do array
  const headers = Object.keys(data[0]);

  return (
    <div className="list-block-container">
      <table className="list-block-table">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'even' : 'odd'}>
              {headers.map((header, hidx) => (
                <td key={hidx}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListBlock; 