import React, { useEffect, useState } from 'react';
import ListBlock from './ListBlock';
import '../styles/ReportSheet.css';
import '../styles/ListBlock.css';
import '../styles/Sidebar.css';
import '../styles/App.css';

const PAGE_HEIGHT_PX = 1122; // Aproximadamente A4 em 96dpi

const ReportPrintPreview = () => {
  const [contents, setContents] = useState([]);
  const sheetRef = React.useRef();
  const [breaks, setBreaks] = useState([]);

  useEffect(() => {
    // Recupera os dados do relatório do localStorage
    const data = localStorage.getItem('report_print_preview');
    if (data) {
      setContents(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    // Após renderizar, calcula onde inserir as quebras de página
    if (sheetRef.current) {
      const blocks = Array.from(sheetRef.current.querySelectorAll('.report-block'));
      let accHeight = 0;
      let pageBreaks = [];
      blocks.forEach((block, idx) => {
        accHeight += block.offsetHeight;
        if (accHeight > PAGE_HEIGHT_PX) {
          pageBreaks.push(idx);
          accHeight = block.offsetHeight;
        }
      });
      setBreaks(pageBreaks);
    }
  }, [contents]);

  let renderedBlocks = [];
  let breakIdx = 0;
  contents.forEach((block, idx) => {
    renderedBlocks.push(
      <div key={idx} className="report-block">
        <div className="block-content">
          {block.type === 'table' ? (
            <ListBlock data={block.data} />
          ) : (
            <span dangerouslySetInnerHTML={{ __html: block.html }} />
          )}
        </div>
      </div>
    );
    if (breaks.includes(idx + 1)) {
      renderedBlocks.push(
        <div key={`break-${breakIdx++}`} className="page-break-preview"></div>
      );
    }
  });

  return (
    <div className="report-sheet-container" style={{ background: '#fff' }}>
      <div className="a4-sheet" ref={sheetRef}>
        {renderedBlocks}
      </div>
    </div>
  );
};

export default ReportPrintPreview; 