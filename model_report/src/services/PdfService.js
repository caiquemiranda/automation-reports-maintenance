/**
 * Serviço para geração e exportação de PDFs
 */

/**
 * Gera um PDF a partir do conteúdo do relatório
 * @param {string} title - Título do relatório
 * @param {Element} contentElement - Elemento DOM contendo o conteúdo do relatório
 */
export const generatePdf = async (title, contentElement) => {
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

  // Buscar o conteúdo real dos arquivos CSS linkados
  const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  let cssText = '';
  for (const link of cssLinks) {
    try {
      const resp = await fetch(link.href);
      if (resp.ok) {
        cssText += await resp.text() + '\n';
      }
    } catch (e) { /* ignora erro */ }
  }
  // Também pega estilos inline
  const styleTags = Array.from(document.querySelectorAll('style'));
  for (const styleTag of styleTags) {
    cssText += styleTag.innerHTML + '\n';
  }

  // Criar iframe temporário para impressão
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'absolute';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.left = '-9999px';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow.document;
  frameDoc.open();

  // Adicionar HTML personalizado
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || 'Relatório'}</title>
        <style>${cssText}</style>
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