import React, { useEffect, useState } from 'react';
import './DocumentContainer.css';

const DocumentContainer = ({ children, isPreview }) => {
  const [isPrinting, setIsPrinting] = useState(false);

  // Detectar quando a página está sendo impressa
  useEffect(() => {
    const beforePrintHandler = () => {
      setIsPrinting(true);
      document.body.classList.add('printing');
    };

    const afterPrintHandler = () => {
      setIsPrinting(false);
      document.body.classList.remove('printing');
    };

    window.addEventListener('beforeprint', beforePrintHandler);
    window.addEventListener('afterprint', afterPrintHandler);

    return () => {
      window.removeEventListener('beforeprint', beforePrintHandler);
      window.removeEventListener('afterprint', afterPrintHandler);
    };
  }, []);

  // Adicionar folha de estilo específica para impressão
  useEffect(() => {
    const printStylesheet = document.createElement('style');
    printStylesheet.setAttribute('type', 'text/css');
    printStylesheet.setAttribute('media', 'print');

    // Estilos específicos para impressão
    printStylesheet.innerHTML = `
      @page {
        size: A4;
        margin: 0.5cm;
      }
      
      body {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      .preview-item {
        display: flex !important;
        align-items: baseline !important;
      }
      
      .preview-item .label {
        min-width: 150px !important;
        font-weight: bold !important;
        color: #000 !important;
      }
      
      .preview-item .value {
        flex: 1 !important;
        padding-left: 8px !important;
        border-bottom: 1px dotted #000 !important;
        color: #000 !important;
      }
      
      .document-paper {
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
      }
    `;

    document.head.appendChild(printStylesheet);

    return () => {
      document.head.removeChild(printStylesheet);
    };
  }, []);

  return (
    <div className={`document-container ${isPreview ? 'preview-mode' : ''} ${isPrinting ? 'printing-mode' : ''}`}>
      <div className="document-paper">
        {children}
      </div>
    </div>
  );
};

export default DocumentContainer; 