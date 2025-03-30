import os
import subprocess
import sys
from pathlib import Path
from flask import Flask, render_template, request, send_file, redirect, url_for
import mammoth
import pdfkit

# Configuração
INPUT_DOC = "report.doc"
OUTPUT_HTML = "templates/report.html"
OUTPUT_CSS = "static/css/report.css"
OUTPUT_PDF = "report.pdf"

# Verificar se os diretórios existem, caso contrário, criá-los
Path("templates").mkdir(exist_ok=True)
Path("static/css").mkdir(parents=True, exist_ok=True)

def convert_doc_to_html():
    """Converte o arquivo DOC para HTML e extrai o CSS"""
    print(f"Convertendo {INPUT_DOC} para HTML...")
    
    try:
        with open(INPUT_DOC, "rb") as docx_file:
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
    <link rel="stylesheet" href="/static/css/report.css">
</head>
<body>
    <div class="report-container">
        {html}
    </div>
</body>
</html>"""
            
            # Salvar o HTML
            with open(OUTPUT_HTML, "w", encoding="utf-8") as html_file:
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
            
            # Salvar o CSS
            with open(OUTPUT_CSS, "w", encoding="utf-8") as css_file:
                css_file.write(css)
                
            print(f"Conversão concluída! HTML salvo em {OUTPUT_HTML} e CSS em {OUTPUT_CSS}")
            return True
            
    except Exception as e:
        print(f"Erro na conversão: {e}")
        return False

def html_to_pdf():
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
        pdfkit.from_file(OUTPUT_HTML, OUTPUT_PDF, options=options)
        print(f"PDF gerado com sucesso em {OUTPUT_PDF}")
        return True
    except Exception as e:
        print(f"Erro ao gerar PDF: {e}")
        print("Você precisa instalar o wkhtmltopdf: https://wkhtmltopdf.org/downloads.html")
        return False

# App Flask para edição do documento
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('report.html')

@app.route('/edit')
def edit():
    # Ler o conteúdo do HTML para edição
    with open(OUTPUT_HTML, 'r', encoding='utf-8') as file:
        content = file.read()
    return render_template('editor.html', content=content)

@app.route('/save', methods=['POST'])
def save():
    if 'content' in request.form:
        with open(OUTPUT_HTML, 'w', encoding='utf-8') as file:
            file.write(request.form['content'])
        return redirect(url_for('index'))
    return "Erro ao salvar o conteúdo", 400

@app.route('/download-pdf')
def download_pdf():
    if html_to_pdf():
        return send_file(OUTPUT_PDF, as_attachment=True)
    return "Erro ao gerar PDF", 500

def create_editor_template():
    """Cria a página de editor HTML"""
    html = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editor de Relatório</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            height: 100vh;
        }
        
        .toolbar {
            background-color: #f0f0f0;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 4px;
        }
        
        .toolbar button {
            margin-right: 5px;
            padding: 5px 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .toolbar button:hover {
            background-color: #0056b3;
        }
        
        #editor {
            flex-grow: 1;
            border: 1px solid #ddd;
            padding: 10px;
            overflow-y: auto;
            min-height: 400px;
        }
        
        form {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        
        .form-actions {
            margin-top: 10px;
        }
        
        .form-actions button {
            padding: 8px 15px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .form-actions button:hover {
            background-color: #218838;
        }
    </style>
    <script src="https://cdn.ckeditor.com/4.16.2/standard/ckeditor.js"></script>
</head>
<body>
    <h1>Editar Relatório</h1>
    
    <form action="/save" method="post">
        <textarea id="editor" name="content">{{ content }}</textarea>
        
        <div class="form-actions">
            <button type="submit">Salvar Alterações</button>
            <a href="/" style="margin-left: 10px;">Cancelar</a>
        </div>
    </form>
    
    <script>
        CKEDITOR.replace('editor', {
            height: 500,
            entities: false,
            basicEntities: false,
            entities_latin: false
        });
    </script>
</body>
</html>"""
    
    with open("templates/editor.html", "w", encoding="utf-8") as file:
        file.write(html)
    
    print("Template do editor criado com sucesso!")

def main():
    # Verificar se o arquivo DOC existe
    if not os.path.exists(INPUT_DOC):
        print(f"Erro: O arquivo {INPUT_DOC} não foi encontrado!")
        sys.exit(1)
    
    # Converter DOC para HTML
    if not convert_doc_to_html():
        print("Erro na conversão de DOC para HTML. Abortando.")
        sys.exit(1)
    
    # Criar o template do editor
    create_editor_template()
    
    # Iniciar o aplicativo Flask
    print("\nIniciando o servidor web na porta 5000...")
    print("Abra seu navegador e acesse http://localhost:5000/")
    print("Para editar o relatório, acesse http://localhost:5000/edit")
    print("Para sair, pressione Ctrl+C")
    app.run(debug=True)

if __name__ == "__main__":
    main() 