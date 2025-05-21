import React, { useEffect, useState } from 'react';
import './DocumentContainer.css';

const DocumentContainer = ({ children, isPreview }) => {
  const [isPrinting, setIsPrinting] = useState(false);

  // Detectar quando a página está sendo impressa
  useEffect(() => {
    const beforePrintHandler = () => {
      setIsPrinting(true);
      document.body.classList.add('printing');
      
      // Aplicar estilos diretamente aos elementos para impressão
      forceStylesForPrinting(true);
    };

    const afterPrintHandler = () => {
      setIsPrinting(false);
      document.body.classList.remove('printing');
      
      // Remover estilos adicionados
      forceStylesForPrinting(false);
    };

    window.addEventListener('beforeprint', beforePrintHandler);
    window.addEventListener('afterprint', afterPrintHandler);

    return () => {
      window.removeEventListener('beforeprint', beforePrintHandler);
      window.removeEventListener('afterprint', afterPrintHandler);
    };
  }, []);
  
  // Função para aplicar estilos diretamente aos elementos
  const forceStylesForPrinting = (apply) => {
    // Detalhes da OS - Itens com layout flex
    const previewItems = document.querySelectorAll('.preview-item');
    previewItems.forEach(item => {
      if (apply) {
        item.style.display = 'flex';
        item.style.flexDirection = 'row';
        item.style.alignItems = 'baseline';
        item.style.width = '100%';
      } else {
        item.style.display = '';
        item.style.flexDirection = '';
        item.style.alignItems = '';
        item.style.width = '';
      }
    });
    
    // Labels dos itens
    const labels = document.querySelectorAll('.preview-item .label');
    labels.forEach(label => {
      if (apply) {
        label.style.minWidth = '150px';
        label.style.fontWeight = 'bold';
        label.style.display = 'inline-block';
        label.style.textAlign = 'left';
      } else {
        label.style.minWidth = '';
        label.style.fontWeight = '';
        label.style.display = '';
        label.style.textAlign = '';
      }
    });
    
    // Valores dos itens
    const values = document.querySelectorAll('.preview-item .value');
    values.forEach(value => {
      if (apply) {
        value.style.flex = '1';
        value.style.paddingLeft = '8px';
        value.style.borderBottom = '1px dotted #000';
        value.style.display = 'inline-block';
        value.style.textAlign = 'left';
      } else {
        value.style.flex = '';
        value.style.paddingLeft = '';
        value.style.borderBottom = '';
        value.style.display = '';
        value.style.textAlign = '';
      }
    });
    
    // Tabela de materiais
    const materialsTables = document.querySelectorAll('.materials-table');
    materialsTables.forEach(table => {
      if (apply) {
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.border = '1px solid #000';
      } else {
        table.style.width = '';
        table.style.borderCollapse = '';
        table.style.border = '';
      }
    });
    
    // Células da tabela
    const cells = document.querySelectorAll('.materials-table th, .materials-table td');
    cells.forEach(cell => {
      if (apply) {
        cell.style.border = '1px solid #000';
        cell.style.padding = '8px 10px';
        cell.style.textAlign = 'left';
      } else {
        cell.style.border = '';
        cell.style.padding = '';
        cell.style.textAlign = '';
      }
    });
    
    // Status do equipamento
    const statusBoxes = document.querySelectorAll('.status-box');
    statusBoxes.forEach(box => {
      if (apply) {
        box.style.border = '1px solid #000';
        box.style.backgroundColor = '#e6f7ff';
        box.style.padding = '10px 15px';
        box.style.borderRadius = '4px';
        box.style.display = 'inline-block';
      } else {
        box.style.border = '';
        box.style.backgroundColor = '';
        box.style.padding = '';
        box.style.borderRadius = '';
        box.style.display = '';
      }
    });
  };

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