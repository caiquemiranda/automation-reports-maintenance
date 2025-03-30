import os
import sys
import subprocess
import tempfile
from pathlib import Path
import shutil

def convert_doc_to_html(input_doc, output_html, output_css):
    """Converte o arquivo DOC para HTML usando LibreOffice ou Microsoft Word"""
    print(f"Convertendo {input_doc} para HTML...")
    
    # Diretório para arquivos temporários
    temp_dir = tempfile.mkdtemp()
    temp_html = os.path.join(temp_dir, "temp.html")
    
    try:
        # Primeiro, tentar usar o LibreOffice (se estiver instalado)
        try:
            # Detectar o caminho do LibreOffice/OpenOffice
            libreoffice_paths = [
                r"C:\Program Files\LibreOffice\program\soffice.exe",
                r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
                r"C:\Program Files\OpenOffice\program\soffice.exe",
                r"C:\Program Files (x86)\OpenOffice\program\soffice.exe"
            ]
            
            soffice_path = None
            for path in libreoffice_paths:
                if os.path.exists(path):
                    soffice_path = path
                    break
            
            if soffice_path:
                print("Usando LibreOffice/OpenOffice para a conversão...")
                subprocess.run([
                    soffice_path,
                    "--headless",
                    "--convert-to", "html",
                    "--outdir", temp_dir,
                    input_doc
                ], check=True)
                
                # Renomear o arquivo HTML gerado
                for file in os.listdir(temp_dir):
                    if file.endswith(".html"):
                        os.rename(os.path.join(temp_dir, file), temp_html)
                        break
                
                success = os.path.exists(temp_html)
            else:
                success = False
        except Exception as e:
            print(f"Erro ao usar LibreOffice: {e}")
            success = False
        
        # Se o LibreOffice falhar, tentar usar o Microsoft Word via PowerShell
        if not success:
            try:
                print("Tentando usar Microsoft Word para a conversão...")
                # Script PowerShell para usar o Word
                ps_script = f"""
                $word = New-Object -ComObject Word.Application
                $word.Visible = $false
                $doc = $word.Documents.Open("{os.path.abspath(input_doc)}")
                $doc.SaveAs("{os.path.abspath(temp_html)}", 10) # 10 = wdFormatFilteredHTML
                $doc.Close()
                $word.Quit()
                [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word)
                """
                
                # Salvar o script PowerShell em um arquivo temporário
                ps_file = os.path.join(temp_dir, "convert.ps1")
                with open(ps_file, "w") as f:
                    f.write(ps_script)
                
                # Executar o script PowerShell
                subprocess.run([
                    "powershell", "-ExecutionPolicy", "Bypass", "-File", ps_file
                ], check=True)
                
                success = os.path.exists(temp_html)
            except Exception as e:
                print(f"Erro ao usar Microsoft Word: {e}")
                success = False
        
        if not success:
            print("Tentando método alternativo com html2text...")
            try:
                # Tente usar o antiword, caso esteja instalado
                subprocess.run([
                    "antiword", "-x", "db", input_doc, ">", temp_html
                ], shell=True, check=True)
                success = os.path.exists(temp_html)
            except Exception as e:
                print(f"Erro no método alternativo: {e}")
                success = False
        
        if success:
            # Garantir que o diretório de saída existe
            os.makedirs(os.path.dirname(output_html), exist_ok=True)
            
            # Ler o conteúdo HTML gerado
            with open(temp_html, "r", encoding="utf-8", errors="ignore") as f:
                html_content = f.read()
            
            # Adicionar o link para o CSS e melhorar o HTML
            improved_html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório</title>
    <link rel="stylesheet" href="{os.path.basename(output_css)}">
</head>
<body>
    <div class="report-container">
        {html_content}
    </div>
</body>
</html>"""
            
            # Salvar o HTML melhorado
            with open(output_html, "w", encoding="utf-8") as f:
                f.write(improved_html)
            
            # Criar um CSS básico para o documento
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

/* Preservar estilos que possam vir do Word */
.MsoNormal {
    margin-bottom: 8pt;
}

/* Compatibilidade com estilos do Word */
span.MsoHyperlink {
    color: #0563C1;
    text-decoration: underline;
}

/* Estilos para tabelas do Word */
table.MsoTable {
    border-collapse: collapse;
    border: 1px solid #ddd;
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
            with open(output_css, "w", encoding="utf-8") as f:
                f.write(css)
            
            print(f"Conversão concluída! HTML salvo em {output_html} e CSS em {output_css}")
            return True
        else:
            print("Todos os métodos de conversão falharam.")
            return False
        
    except Exception as e:
        print(f"Erro na conversão: {e}")
        return False
    finally:
        # Limpar arquivos temporários
        try:
            shutil.rmtree(temp_dir)
        except:
            pass

def main():
    # Configuração
    input_doc = "report.doc"
    
    # Verificar se o arquivo DOC existe
    if not os.path.exists(input_doc):
        print(f"Erro: O arquivo {input_doc} não foi encontrado!")
        sys.exit(1)
    
    # Criar os diretórios necessários
    Path("html").mkdir(exist_ok=True)
    Path("html/css").mkdir(parents=True, exist_ok=True)
    
    # Caminhos de saída
    output_html = "html/report.html"
    output_css = "html/css/styles.css"
    
    # Converter DOC para HTML
    if not convert_doc_to_html(input_doc, output_html, output_css):
        print("Erro na conversão de DOC para HTML. Abortando.")
        sys.exit(1)
    
    print("\nPronto! Agora você pode abrir o arquivo HTML para visualizar o documento.")
    print(f"Arquivo HTML: {output_html}")
    print(f"Arquivo CSS: {output_css}")
    
    # Tentar abrir o arquivo HTML no navegador padrão
    try:
        import webbrowser
        webbrowser.open(os.path.abspath(output_html))
    except:
        pass

if __name__ == "__main__":
    main() 