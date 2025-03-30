import os
import shutil
import re
import sys
import subprocess
import tempfile
from pathlib import Path

# Verificar se pywin32 está instalado
try:
    import win32com.client
    HAS_PYWIN32 = True
except ImportError:
    HAS_PYWIN32 = False
    print("Aviso: A biblioteca 'pywin32' não está instalada. Funcionalidades de edição serão limitadas.")
    print("Para instalar, execute: pip install pywin32")

def replicar_documento(caminho_origem, caminho_destino):
    """
    Replica o documento de origem para o de destino usando cópia binária
    
    Args:
        caminho_origem: Caminho do arquivo de origem
        caminho_destino: Caminho do arquivo de destino
        
    Returns:
        Boolean indicando se a operação foi bem-sucedida
    """
    try:
        # Realizar cópia direta (binária) para garantir precisão
        print(f"Realizando cópia binária do arquivo {caminho_origem}...")
        shutil.copy2(caminho_origem, caminho_destino)
        print(f"Arquivo copiado com sucesso para: {caminho_destino}")
        return True
    except Exception as e:
        print(f"Erro ao replicar o documento: {e}")
        return False

def verificar_conteudo(caminho_origem, caminho_destino):
    """
    Verifica se o conteúdo dos arquivos é idêntico
    
    Args:
        caminho_origem: Caminho do arquivo de origem
        caminho_destino: Caminho do arquivo de destino
        
    Returns:
        Boolean indicando se os arquivos são idênticos
    """
    try:
        with open(caminho_origem, 'rb') as f1, open(caminho_destino, 'rb') as f2:
            conteudo1 = f1.read()
            conteudo2 = f2.read()
            
            if conteudo1 == conteudo2:
                print("Verificação: Os arquivos são IDÊNTICOS!")
                return True
            else:
                print("Verificação: Os arquivos são DIFERENTES!")
                tamanho1 = len(conteudo1)
                tamanho2 = len(conteudo2)
                print(f"Tamanho do arquivo original: {tamanho1} bytes")
                print(f"Tamanho do arquivo modificado: {tamanho2} bytes")
                
                if tamanho1 == tamanho2:
                    print("Os arquivos têm o mesmo tamanho, mas conteúdo diferente")
                else:
                    print(f"Diferença de tamanho: {abs(tamanho1 - tamanho2)} bytes")
                
                return False
    except Exception as e:
        print(f"Erro ao verificar conteúdo: {e}")
        return False

def modificar_doc_com_word(caminho_arquivo, texto_antigo, texto_novo):
    """
    Modifica um documento .doc usando a API do Word (via COM)
    
    Args:
        caminho_arquivo: Caminho do arquivo a ser modificado
        texto_antigo: Texto a ser substituído
        texto_novo: Novo texto
        
    Returns:
        Boolean indicando se a modificação foi bem-sucedida
    """
    if not HAS_PYWIN32:
        print("Erro: A biblioteca 'pywin32' é necessária para esta função.")
        return False
    
    caminho_completo = os.path.abspath(caminho_arquivo)
    
    try:
        # Inicializar Word
        print(f"Iniciando Microsoft Word para editar {caminho_arquivo}...")
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False  # Execução invisível
        
        # Abrir o documento
        doc = word.Documents.Open(caminho_completo)
        
        # Realizar a substituição
        word.Selection.Find.ClearFormatting()
        word.Selection.Find.Replacement.ClearFormatting()
        
        # Configurar a busca
        find_obj = word.Selection.Find
        find_obj.Text = texto_antigo
        find_obj.Replacement.Text = texto_novo
        find_obj.Forward = True
        find_obj.Wrap = 1  # wdFindContinue
        find_obj.Format = False
        find_obj.MatchCase = False
        find_obj.MatchWholeWord = False
        find_obj.MatchWildcards = False
        find_obj.MatchSoundsLike = False
        find_obj.MatchAllWordForms = False
        
        # Executar a substituição
        replace_count = 0
        while find_obj.Execute():
            find_obj.Execute(Replace=2)  # wdReplaceAll
            replace_count += 1
        
        # Salvar o documento
        doc.Save()
        
        # Fechar o documento
        doc.Close()
        
        # Encerrar o Word
        word.Quit()
        
        if replace_count > 0:
            print(f"Texto substituído com sucesso. {replace_count} substituições realizadas.")
            return True
        else:
            print("Aviso: Nenhuma ocorrência do texto foi encontrada.")
            return False
    
    except Exception as e:
        print(f"Erro ao modificar o documento com Word: {e}")
        
        # Em caso de erro, garantir que o Word seja fechado
        try:
            if 'doc' in locals() and doc:
                doc.Close(SaveChanges=False)
            if 'word' in locals() and word:
                word.Quit()
        except:
            pass
        
        return False

def modificar_doc_alternativo(caminho_arquivo, texto_antigo, texto_novo):
    """
    Método alternativo para modificar um documento .doc
    Usa a conversão temporária para .docx, modificação e conversão de volta
    
    Args:
        caminho_arquivo: Caminho do arquivo a ser modificado
        texto_antigo: Texto a ser substituído
        texto_novo: Novo texto
        
    Returns:
        Boolean indicando se a modificação foi bem-sucedida
    """
    try:
        # Verificar se LibreOffice está disponível
        subprocess.run(["libreoffice", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)
        has_libreoffice = True
    except:
        has_libreoffice = False

    try:
        # Criar diretório temporário
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_base = os.path.join(temp_dir, "temp_doc")
            temp_docx = temp_base + ".docx"
            
            print(f"Convertendo o documento para DOCX temporariamente...")
            
            # Usar LibreOffice para converter DOC para DOCX
            if has_libreoffice:
                cmd = [
                    "libreoffice", "--headless", "--convert-to", "docx", 
                    "--outdir", temp_dir, caminho_arquivo
                ]
                process = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                
                if process.returncode != 0:
                    print("Erro ao converter para DOCX usando LibreOffice")
                    return False
            else:
                # Se LibreOffice não estiver disponível, tentar com Word se pywin32 estiver disponível
                if HAS_PYWIN32:
                    try:
                        word = win32com.client.Dispatch("Word.Application")
                        word.Visible = False
                        
                        caminho_completo = os.path.abspath(caminho_arquivo)
                        doc = word.Documents.Open(caminho_completo)
                        
                        doc.SaveAs(os.path.abspath(temp_docx), FileFormat=16)  # 16 = wdFormatDocumentDefault (.docx)
                        doc.Close()
                        word.Quit()
                    except Exception as e:
                        print(f"Erro ao converter para DOCX usando Word: {e}")
                        return False
                else:
                    print("Erro: Não foi possível encontrar LibreOffice ou Word para conversão")
                    return False
            
            # Verificar se o arquivo DOCX temporário foi criado
            if not os.path.exists(temp_docx):
                print("Erro: A conversão para DOCX falhou")
                return False
            
            # Agora temos um arquivo DOCX, podemos modificá-lo com python-docx
            try:
                from docx import Document
                
                doc = Document(temp_docx)
                
                # Realizar substituição em parágrafos
                modificado = False
                for para in doc.paragraphs:
                    if texto_antigo in para.text:
                        texto_modificado = para.text.replace(texto_antigo, texto_novo)
                        
                        # Preservar formatação original
                        runs = list(para.runs)
                        para.clear()
                        para.add_run(texto_modificado)
                        
                        modificado = True
                
                # Realizar substituição em tabelas
                for table in doc.tables:
                    for row in table.rows:
                        for cell in row.cells:
                            for para in cell.paragraphs:
                                if texto_antigo in para.text:
                                    texto_modificado = para.text.replace(texto_antigo, texto_novo)
                                    
                                    # Preservar formatação original
                                    runs = list(para.runs)
                                    para.clear()
                                    para.add_run(texto_modificado)
                                    
                                    modificado = True
                
                if not modificado:
                    print("Aviso: Nenhuma ocorrência do texto foi encontrada no documento.")
                    return False
                
                # Salvar o arquivo DOCX modificado
                doc.save(temp_docx)
                
                # Converter de volta para DOC
                print("Convertendo de volta para o formato DOC...")
                
                # Substituir o arquivo original pelo modificado
                temp_doc = temp_base + ".doc"
                
                if has_libreoffice:
                    cmd = [
                        "libreoffice", "--headless", "--convert-to", "doc", 
                        "--outdir", temp_dir, temp_docx
                    ]
                    process = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                    
                    if process.returncode != 0:
                        print("Erro ao converter de volta para DOC")
                        return False
                    
                    # Copiar o arquivo temporário para o destino final
                    shutil.copy2(temp_doc, caminho_arquivo)
                else:
                    # Se LibreOffice não estiver disponível, tentar com Word
                    if HAS_PYWIN32:
                        try:
                            word = win32com.client.Dispatch("Word.Application")
                            word.Visible = False
                            
                            doc = word.Documents.Open(os.path.abspath(temp_docx))
                            
                            doc.SaveAs(os.path.abspath(caminho_arquivo), FileFormat=0)  # 0 = wdFormatDocument (.doc)
                            doc.Close()
                            word.Quit()
                        except Exception as e:
                            print(f"Erro ao converter de volta para DOC usando Word: {e}")
                            return False
                    else:
                        print("Erro: Não foi possível encontrar LibreOffice ou Word para conversão de volta")
                        return False
                
                print(f"Documento modificado com sucesso: {caminho_arquivo}")
                return True
                
            except ImportError:
                print("Erro: A biblioteca 'python-docx' é necessária para esta função.")
                print("Para instalar, execute: pip install python-docx")
                return False
            except Exception as e:
                print(f"Erro ao modificar o arquivo DOCX: {e}")
                return False
    
    except Exception as e:
        print(f"Erro no processo de conversão/modificação: {e}")
        return False

def perguntar_metodo():
    """
    Pergunta ao usuário qual método usar para modificar o documento
    
    Returns:
        String com o método escolhido
    """
    print("\nEscolha o método para modificar o documento:")
    print("1. Usar Microsoft Word (recomendado para máxima compatibilidade)")
    print("2. Usar método alternativo (conversão DOCX temporária)")
    
    escolha = input("\nDigite o número da opção desejada (1-2): ")
    
    if escolha == "1":
        if not HAS_PYWIN32:
            print("A biblioteca 'pywin32' não está instalada. Usando método alternativo.")
            return "alternativo"
        return "word"
    else:
        return "alternativo"

if __name__ == "__main__":
    # Configuração dos caminhos
    caminho_origem = "report.doc"
    caminho_trabalho = "report_copia_trabalho.doc"
    
    # Verificar se o arquivo de origem existe
    if not os.path.exists(caminho_origem):
        print(f"Erro: O arquivo {caminho_origem} não foi encontrado.")
        sys.exit(1)
    
    # Fase 1: Criar uma cópia exata de trabalho
    print(f"Processando o arquivo {caminho_origem}...")
    print(f"Tamanho do arquivo original: {os.path.getsize(caminho_origem)} bytes")
    
    # Replicar o documento
    sucesso = replicar_documento(caminho_origem, caminho_trabalho)
    
    if not sucesso or not os.path.exists(caminho_trabalho):
        print(f"Erro: Não foi possível criar a cópia de trabalho.")
        sys.exit(1)
    
    # Verificar se o conteúdo é idêntico
    if not verificar_conteudo(caminho_origem, caminho_trabalho):
        print("Aviso: A cópia de trabalho não é idêntica ao original. Isso pode causar problemas.")
        continuar = input("Deseja continuar mesmo assim? (S/N): ")
        if continuar.upper() != "S":
            print("Operação cancelada pelo usuário.")
            sys.exit(0)
    
    # Fase 2: Modificar o documento
    print("\n--- Fase de Modificação ---")
    print("Este script permite modificar o texto de serviço no documento.")
    
    texto_antigo = input("\nDigite o texto a ser substituído (ou pressione Enter para usar o padrão): ")
    if not texto_antigo:
        texto_antigo = "SERVIÇO: Troca da base, mais o detector de fumaça (N1-L01-215 DF)"
        print(f"Usando o texto padrão: '{texto_antigo}'")
    
    texto_novo = input("\nDigite o novo texto (ou pressione Enter para usar o padrão): ")
    if not texto_novo:
        texto_novo = "SERVIÇO: Susbtituição do modulo danificado (N1-L01-MZ-112)"
        print(f"Usando o texto padrão: '{texto_novo}'")
    
    # Perguntar qual método usar
    metodo = perguntar_metodo()
    
    # Aplicar a modificação
    if metodo == "word":
        print("\nModificando o documento usando Microsoft Word...")
        sucesso = modificar_doc_com_word(caminho_trabalho, texto_antigo, texto_novo)
    else:
        print("\nModificando o documento usando método alternativo...")
        sucesso = modificar_doc_alternativo(caminho_trabalho, texto_antigo, texto_novo)
    
    if sucesso:
        print("\nVerificando o resultado...")
        if verificar_conteudo(caminho_origem, caminho_trabalho):
            print("Aviso: O documento modificado é idêntico ao original. A modificação pode não ter sido aplicada.")
        else:
            print("\nModificação concluída com sucesso!")
            print(f"O documento modificado está em: {caminho_trabalho}")
            
            # Perguntar se deseja substituir o original
            backup = "report_original_backup.doc"
            substituir = input("\nDeseja substituir o arquivo original? (S/N): ")
            if substituir.upper() == "S":
                # Fazer backup do original
                shutil.copy2(caminho_origem, backup)
                print(f"Backup do arquivo original criado em: {backup}")
                
                # Substituir o original
                shutil.copy2(caminho_trabalho, caminho_origem)
                print(f"Arquivo original substituído.")
    else:
        print("\nA modificação falhou. A cópia de trabalho pode estar corrompida.") 