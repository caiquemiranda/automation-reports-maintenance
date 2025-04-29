/**
 * Serviço para geração e exportação de PDFs
 */

/**
 * Gera um PDF a partir do conteúdo do relatório
 * @param {string} title - Título do relatório
 * @param {Element} contentElement - Elemento DOM contendo o conteúdo do relatório
 */
export const generatePdf = (title, contentElement) => {
  // Abordagem usando a API de impressão do navegador
  // Este método abre o diálogo de impressão onde o usuário pode escolher salvar como PDF

  // Clone o elemento para não interferir no original
  const contentClone = contentElement.cloneNode(true);

  // Aplicar estilo de impressão
  contentClone.style.width = '210mm';
  contentClone.style.minHeight = '297mm';
  contentClone.style.padding = '10mm';
  contentClone.style.backgroundColor = 'white';
  contentClone.style.boxShadow = 'none';
  contentClone.style.border = 'none';

  // Criar iframe temporário para impressão
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'absolute';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.left = '-9999px';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow.document;
  frameDoc.open();

  // Buscar os estilos do projeto
  const listBlockCss = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(el => el.outerHTML)
    .join('\n');

  // Adicionar HTML personalizado
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || 'Relatório'}</title>
        ${listBlockCss}
        <style>
          body { 
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 10mm;
            margin: 0 auto;
          }
          @media print {
            body { 
              width: 210mm;
              height: 297mm;
            }
            .page {
              page-break-after: always;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          ${contentClone.innerHTML}
        </div>
      </body>
    </html>
  `);

  frameDoc.close();

  // Aguardar pelo carregamento
  printFrame.onload = () => {
    try {
      // Imprimir
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();

      // Remover frame após impressão
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);

      // Remover frame se houver erro
      document.body.removeChild(printFrame);

      // Exibir mensagem de erro
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };
};

// Criar o objeto de serviço e atribuir a uma variável antes de exportar
const PdfService = {
  generatePdf
};

export default PdfService; 