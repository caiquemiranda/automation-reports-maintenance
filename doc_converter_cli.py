import os
import sys
import argparse
from pathlib import Path
import mammoth
import pdfkit

def convert_doc_to_html(input_file, output_html, output_css):
    """Converte o arquivo DOC para HTML e extrai o CSS"""
    print(f"Convertendo {input_file} para HTML...")
    
    try:
        with open(input_file, "rb") as docx_file:
            # Converter DOC para HTML usando mammoth
            result = mammoth.convert_to_html(docx_file)
            html = result.value
            
            # Melhorar o HTML adicionando recursos adicionais
            html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório</title>
    <link rel="stylesheet" href="{os.path.basename(output_css)}">
</head>
<body>
    <div class="report-container">
        {html}
    </div>
</body>
</html>"""
            
            # Garantir que o diretório de saída existe
            os.makedirs(os.path.dirname(output_html), exist_ok=True)
            
            # Salvar o HTML
            with open(output_html, "w", encoding="utf-8") as html_file:
                html_file.write(html)
            
            # Criar um CSS básico
            css = """
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    margin: 0;
    padding: 0;
}

.report-container {
    max-width: 210mm; /* Tamanho A4 */
    margin: 0 auto;
    padding: 20mm;
}

h1 {
    color: #00356B;
    font-size: 24pt;
    margin-top: 0;
}

h2 {
    color: #0056b3;
    font-size: 18pt;
    margin-top: 20px;
}

h3 {
    color: #007bff;
    font-size: 16pt;
}

p {
    margin-bottom: 10px;
    text-align: justify;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

table, th, td {
    border: 1px solid #ddd;
}

th, td {
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

img {
    max-width: 100%;
    height: auto;
}

@media print {
    body {
        font-size: 12pt;
    }
    
    .report-container {
        padding: 0;
    }
}
"""
            
            # Garantir que o diretório de saída CSS existe
            os.makedirs(os.path.dirname(output_css), exist_ok=True)
            
            # Salvar o CSS
            with open(output_css, "w", encoding="utf-8") as css_file:
                css_file.write(css)
                
            print(f"Conversão concluída! HTML salvo em {output_html} e CSS em {output_css}")
            return True
            
    except Exception as e:
        print(f"Erro na conversão: {e}")
        return False

def html_to_pdf(input_html, output_pdf):
    """Converte o arquivo HTML para PDF"""
    print(f"Convertendo HTML para PDF...")
    try:
        # Configurar opções para o tamanho A4
        options = {
            'page-size': 'A4',
            'margin-top': '0mm',
            'margin-right': '0mm',
            'margin-bottom': '0mm',
            'margin-left': '0mm',
            'encoding': 'UTF-8',
        }
        
        # Converter HTML para PDF
        pdfkit.from_file(input_html, output_pdf, options=options)
        print(f"PDF gerado com sucesso em {output_pdf}")
        return True
    except Exception as e:
        print(f"Erro ao gerar PDF: {e}")
        print("Você precisa instalar o wkhtmltopdf: https://wkhtmltopdf.org/downloads.html")
        return False

def main():
    parser = argparse.ArgumentParser(description='Conversor de documentos DOC para HTML e PDF')
    parser.add_argument('input_file', help='Caminho para o arquivo DOC de entrada')
    parser.add_argument('--output-html', dest='output_html', help='Caminho para o arquivo HTML de saída')
    parser.add_argument('--output-css', dest='output_css', help='Caminho para o arquivo CSS de saída')
    parser.add_argument('--output-pdf', dest='output_pdf', help='Caminho para o arquivo PDF de saída')
    parser.add_argument('--skip-pdf', dest='skip_pdf', action='store_true', help='Pular a geração de PDF')
    
    args = parser.parse_args()
    
    # Verificar se o arquivo de entrada existe
    if not os.path.exists(args.input_file):
        print(f"Erro: O arquivo {args.input_file} não foi encontrado!")
        sys.exit(1)
    
    # Definir caminhos padrão se não forem fornecidos
    output_html = args.output_html if args.output_html else os.path.splitext(args.input_file)[0] + '.html'
    output_css = args.output_css if args.output_css else os.path.dirname(output_html) + '/style.css'
    output_pdf = args.output_pdf if args.output_pdf else os.path.splitext(args.input_file)[0] + '.pdf'
    
    # Converter DOC para HTML
    if not convert_doc_to_html(args.input_file, output_html, output_css):
        print("Erro na conversão de DOC para HTML. Abortando.")
        sys.exit(1)
    
    # Converter HTML para PDF se não for para pular
    if not args.skip_pdf:
        if not html_to_pdf(output_html, output_pdf):
            print("Erro na conversão de HTML para PDF.")
            sys.exit(1)

if __name__ == "__main__":
    main() 