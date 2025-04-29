import React, { useEffect, useState } from 'react';
import ListBlock from './ListBlock';
import '../styles/ReportSheet.css';
import '../styles/ListBlock.css';

const ReportPrintPreview = () => {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    // Recupera os dados do relatório do localStorage
    const data = localStorage.getItem('report_print_preview');
    if (data) {
      setContents(JSON.parse(data));
    }
  }, []);

  return (
    <div className="report-sheet-container" style={{ background: '#fff' }}>
      <div className="a4-sheet">
        {contents.map((block, idx) => (
          <div key={idx} className="report-block">
            <div className="block-content">
              {block.type === 'table' ? (
                <ListBlock data={block.data} />
              ) : (
                <span dangerouslySetInnerHTML={{ __html: block.html }} />
              )}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 32, textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={() => window.print()}>
            Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPrintPreview; 