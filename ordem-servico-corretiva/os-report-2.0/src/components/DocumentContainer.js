import React, { useEffect, useState } from 'react';
import './DocumentContainer.css';

const DocumentContainer = ({ children, isPreview }) => {
  const [isPrinting, setIsPrinting] = useState(false);

  // Detectar quando a página está sendo impressa
  useEffect(() => {
    const beforePrintHandler = () => {
      setIsPrinting(true);
    };

    const afterPrintHandler = () => {
      setIsPrinting(false);
    };

    window.addEventListener('beforeprint', beforePrintHandler);
    window.addEventListener('afterprint', afterPrintHandler);

    return () => {
      window.removeEventListener('beforeprint', beforePrintHandler);
      window.removeEventListener('afterprint', afterPrintHandler);
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