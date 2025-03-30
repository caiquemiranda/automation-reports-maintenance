import os
import shutil
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

def copiar_formatacao_paragrafo(paragrafo_origem, paragrafo_destino):
    """
    Copia a formatação de um parágrafo para outro
    
    Args:
        paragrafo_origem: Parágrafo de origem
        paragrafo_destino: Parágrafo de destino
    """
    # Copiar alinhamento
    paragrafo_destino.alignment = paragrafo_origem.alignment
    
    # Copiar recuos e espaçamentos
    paragrafo_destino.paragraph_format.left_indent = paragrafo_origem.paragraph_format.left_indent
    paragrafo_destino.paragraph_format.right_indent = paragrafo_origem.paragraph_format.right_indent
    paragrafo_destino.paragraph_format.first_line_indent = paragrafo_origem.paragraph_format.first_line_indent
    paragrafo_destino.paragraph_format.space_before = paragrafo_origem.paragraph_format.space_before
    paragrafo_destino.paragraph_format.space_after = paragrafo_origem.paragraph_format.space_after
    paragrafo_destino.paragraph_format.line_spacing = paragrafo_origem.paragraph_format.line_spacing
    
    # Copiar estilo de lista, se houver
    if hasattr(paragrafo_origem, 'style') and paragrafo_origem.style:
        try:
            paragrafo_destino.style = paragrafo_origem.style
        except Exception:
            print("Aviso: Não foi possível copiar o estilo do parágrafo")

def copiar_formatacao_run(run_origem, run_destino):
    """
    Copia a formatação de um run para outro
    
    Args:
        run_origem: Run de origem (trecho de texto com formatação uniforme)
        run_destino: Run de destino
    """
    # Copiar fonte e tamanho
    run_destino.font.name = run_origem.font.name
    run_destino.font.size = run_origem.font.size
    
    # Copiar estilo (negrito, itálico, etc)
    run_destino.font.bold = run_origem.font.bold
    run_destino.font.italic = run_origem.font.italic
    run_destino.font.underline = run_origem.font.underline
    run_destino.font.strike = run_origem.font.strike  # Texto tachado
    run_destino.font.subscript = run_origem.font.subscript  # Subscrito
    run_destino.font.superscript = run_origem.font.superscript  # Sobrescrito
    
    # Copiar cor
    if run_origem.font.color.rgb:
        run_destino.font.color.rgb = run_origem.font.color.rgb
    
    # Copiar realce
    run_destino.font.highlight_color = run_origem.font.highlight_color
    
    # Copiar espaçamento entre caracteres
    if hasattr(run_origem.font, 'character_spacing'):
        run_destino.font.character_spacing = run_origem.font.character_spacing

def copiar_tabela(tabela_origem, documento_destino):
    """
    Copia uma tabela para o documento de destino
    
    Args:
        tabela_origem: Tabela de origem
        documento_destino: Documento de destino
        
    Returns:
        Tabela copiada
    """
    # Criar nova tabela com o mesmo número de linhas e colunas
    linhas = len(tabela_origem.rows)
    colunas = len(tabela_origem.columns)
    
    tabela_destino = documento_destino.add_table(rows=linhas, cols=colunas)
    
    # Copiar estilo da tabela
    if tabela_origem.style:
        try:
            tabela_destino.style = tabela_origem.style
        except Exception:
            print("Aviso: Não foi possível copiar o estilo da tabela")
    
    # Copiar largura das colunas (se possível)
    try:
        for i in range(colunas):
            for cell in tabela_destino.column_cells(i):
                cell.width = tabela_origem.column_cells(i)[0].width
    except Exception:
        print("Aviso: Não foi possível copiar a largura exata das colunas")
    
    # Copiar conteúdo e formatação célula por célula
    for i, linha in enumerate(tabela_origem.rows):
        # Definir altura da linha (se possível)
        try:
            tabela_destino.rows[i].height = linha.height
        except:
            pass
            
        for j, celula in enumerate(linha.cells):
            celula_destino = tabela_destino.cell(i, j)
            
            # Copiar mesclagem (se aplicável)
            if celula.merge_origin:
                try:
                    # Identificar células a mesclar na tabela de destino
                    # Isso é uma simplificação, o ideal seria identificar o intervalo exato
                    pass
                except:
                    print("Aviso: Não foi possível copiar a mesclagem da célula")
            
            # Copiar o conteúdo
            # Remover parágrafo padrão se não for o primeiro
            if len(celula.paragraphs) > 1:
                celula_destino.paragraphs.clear()
                
            for paragrafo_origem in celula.paragraphs:
                if len(celula_destino.paragraphs) > 0 and celula_destino.paragraphs[0].text == "":
                    paragrafo_destino = celula_destino.paragraphs[0]
                else:
                    paragrafo_destino = celula_destino.add_paragraph()
                
                # Copiar o texto e formatação
                for run_origem in paragrafo_origem.runs:
                    run_destino = paragrafo_destino.add_run(run_origem.text)
                    copiar_formatacao_run(run_origem, run_destino)
                
                copiar_formatacao_paragrafo(paragrafo_origem, paragrafo_destino)
            
            # Copiar bordas (simplificado)
            try:
                if hasattr(celula, 'border_top') and celula.border_top:
                    celula_destino.border_top = celula.border_top
                if hasattr(celula, 'border_bottom') and celula.border_bottom:
                    celula_destino.border_bottom = celula.border_bottom
                if hasattr(celula, 'border_left') and celula.border_left:
                    celula_destino.border_left = celula.border_left
                if hasattr(celula, 'border_right') and celula.border_right:
                    celula_destino.border_right = celula.border_right
            except:
                print("Aviso: Não foi possível copiar as bordas da célula")
    
    return tabela_destino

def copiar_imagem(imagem_origem, documento_destino):
    """
    Copia uma imagem para o documento de destino
    
    Args:
        imagem_origem: Imagem de origem (bloco de imagem)
        documento_destino: Documento de destino
    """
    try:
        # Em implementações mais complexas, seria necessário extrair a imagem e reinseri-la
        # Esta é uma implementação simplificada
        pass
    except Exception as e:
        print(f"Erro ao copiar imagem: {e}")

def replicar_documento(caminho_origem, caminho_destino):
    """
    Replica o documento de origem para o de destino
    
    Args:
        caminho_origem: Caminho do arquivo de origem
        caminho_destino: Caminho do arquivo de destino
    """
    # Para arquivos .doc (formato binário antigo), usamos cópia direta
    if caminho_origem.lower().endswith('.doc') and not caminho_origem.lower().endswith('.docx'):
        print("Realizando cópia binária do arquivo .doc (formato binário)")
        shutil.copy2(caminho_origem, caminho_destino)
        return
    
    # Para arquivos .docx (formato XML)
    try:
        print("Tentando replicar documento DOCX usando python-docx...")
        doc_origem = Document(caminho_origem)
        doc_destino = Document()
        
        # Copiar propriedades do documento
        try:
            doc_destino.core_properties.author = doc_origem.core_properties.author
            doc_destino.core_properties.title = doc_origem.core_properties.title
            doc_destino.core_properties.comments = doc_origem.core_properties.comments
            doc_destino.core_properties.category = doc_origem.core_properties.category
            doc_destino.core_properties.subject = doc_origem.core_properties.subject
        except:
            print("Aviso: Não foi possível copiar todas as propriedades do documento")
        
        # Copiar margens e configurações de página
        seções_origem = doc_origem.sections
        seções_destino = doc_destino.sections
        
        for i, secao_origem in enumerate(seções_origem):
            # Garantir que existe a seção no documento de destino
            if i >= len(seções_destino):
                # Adicionar nova seção se necessário
                doc_destino.add_section()
            
            secao_destino = seções_destino[i]
            
            # Copiar configurações de página
            secao_destino.page_height = secao_origem.page_height
            secao_destino.page_width = secao_origem.page_width
            secao_destino.left_margin = secao_origem.left_margin
            secao_destino.right_margin = secao_origem.right_margin
            secao_destino.top_margin = secao_origem.top_margin
            secao_destino.bottom_margin = secao_origem.bottom_margin
            secao_destino.header_distance = secao_origem.header_distance
            secao_destino.footer_distance = secao_origem.footer_distance
            
            # Copiar orientação da página
            try:
                secao_destino.orientation = secao_origem.orientation
            except:
                print("Aviso: Não foi possível copiar a orientação da página")
            
            # Copiar cabeçalhos e rodapés (simplificado)
            try:
                # Esta é uma implementação simplificada, seria necessário percorrer
                # os conteúdos de cada cabeçalho/rodapé para uma cópia perfeita
                pass
            except:
                print("Aviso: Não foi possível copiar cabeçalhos e rodapés")
        
        # Percorrer todos os elementos do documento de forma estruturada
        for elemento in doc_origem.element.body:
            # Parágrafo
            if elemento.tag.endswith('p'):  
                for para_idx, para_origem in enumerate(doc_origem.paragraphs):
                    if para_origem._element is elemento:
                        para_destino = doc_destino.add_paragraph()
                        
                        # Copiar o texto e formatação
                        for run_origem in para_origem.runs:
                            run_destino = para_destino.add_run(run_origem.text)
                            copiar_formatacao_run(run_origem, run_destino)
                        
                        copiar_formatacao_paragrafo(para_origem, para_destino)
                        break
            
            # Tabela
            elif elemento.tag.endswith('tbl'):  
                for tabela_idx, tabela_origem in enumerate(doc_origem.tables):
                    if tabela_origem._element is elemento:
                        copiar_tabela(tabela_origem, doc_destino)
                        break
            
            # Outros elementos como imagens, gráficos, etc.
            else:
                # Esta é uma implementação simplificada
                # Para uma cópia perfeita, seria necessário identificar e tratar
                # todos os tipos de elementos possíveis no documento
                pass
        
        # Salvar o documento replicado
        doc_destino.save(caminho_destino)
        print(f"Documento replicado com sucesso em: {caminho_destino}")
    
    except Exception as e:
        print(f"Erro ao replicar o documento: {e}")
        print("Nota: Muitos documentos .doc antigos podem não ser totalmente suportados pela biblioteca python-docx")
        print("Tentando cópia binária como fallback")
        shutil.copy2(caminho_origem, caminho_destino)
        print(f"Cópia binária realizada com sucesso em: {caminho_destino}")

def verificar_conteudo(caminho_origem, caminho_destino):
    """
    Verifica se o conteúdo dos arquivos é idêntico (apenas para verificação)
    
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
                print(f"Tamanho do arquivo replicado: {tamanho2} bytes")
                
                if tamanho1 == tamanho2:
                    print("Os arquivos têm o mesmo tamanho, mas conteúdo diferente")
                else:
                    print(f"Diferença de tamanho: {abs(tamanho1 - tamanho2)} bytes")
                
                return False
    except Exception as e:
        print(f"Erro ao verificar conteúdo: {e}")
        return False

if __name__ == "__main__":
    # Configuração dos caminhos
    caminho_origem = "report.doc"
    caminho_destino = "report_replicado.doc"
    
    # Verificar se o arquivo de origem existe
    if not os.path.exists(caminho_origem):
        print(f"Erro: O arquivo {caminho_origem} não foi encontrado.")
    else:
        print(f"Replicando o arquivo {caminho_origem}...")
        print(f"Tamanho do arquivo original: {os.path.getsize(caminho_origem)} bytes")
        
        # Replicar o documento
        replicar_documento(caminho_origem, caminho_destino)
        
        # Verificar se o arquivo foi criado
        if os.path.exists(caminho_destino):
            print(f"Tamanho do arquivo replicado: {os.path.getsize(caminho_destino)} bytes")
            
            # Verificar se o conteúdo é idêntico (para fins de validação)
            verificar_conteudo(caminho_origem, caminho_destino)
        else:
            print(f"Erro: O arquivo {caminho_destino} não foi criado corretamente.")
