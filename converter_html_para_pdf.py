import os
import pdfkit

def html_to_pdf(input_html, output_pdf):
    """Converte um arquivo HTML para PDF"""
    print(f"Convertendo {input_html} para PDF...")
    
    try:
        # Configurar opções para o tamanho A4
        options = {
            'page-size': 'A4',
            'margin-top': '10mm',
            'margin-right': '10mm',
            'margin-bottom': '10mm',
            'margin-left': '10mm',
            'encoding': 'UTF-8',
            'enable-local-file-access': True  # Importante para carregar o CSS local
        }
        
        # Converter HTML para PDF
        pdfkit.from_file(input_html, output_pdf, options=options)
        print(f"PDF gerado com sucesso em {output_pdf}")
        return True
    except Exception as e:
        print(f"Erro ao gerar PDF: {e}")
        print("Verifique se o wkhtmltopdf está instalado: https://wkhtmltopdf.org/downloads.html")
        return False

def main():
    input_html = "html/report.html"
    output_pdf = "report_final.pdf"
    
    if not os.path.exists(input_html):
        print(f"Arquivo HTML não encontrado: {input_html}")
        return
    
    html_to_pdf(input_html, output_pdf)

if __name__ == "__main__":
    main() 