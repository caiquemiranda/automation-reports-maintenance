#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script para testar a geração de relatórios de manutenção no formato Word.
Este script cria um documento exatamente igual ao modelo de report.doc.
"""

from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os
from datetime import datetime

def adicionar_borda_tabela(tabela):
    """Adiciona borda à tabela."""
    tbl = tabela._tbl
    for cell in tbl.iter_tcs():
        tcPr = cell.tcPr
        tcBorders = OxmlElement('w:tcBorders')
        for border_name in ['top', 'left', 'bottom', 'right']:
            border = OxmlElement(f'w:{border_name}')
            border.set(qn('w:val'), 'single')
            border.set(qn('w:sz'), '4')
            border.set(qn('w:space'), '0')
            border.set(qn('w:color'), '000000')
            tcBorders.append(border)
        tcPr.append(tcBorders)

def gerar_relatorio(data_relatorio=None):
    """
    Gera um relatório de manutenção no formato Word.
    
    Args:
        data_relatorio: Data do relatório (opcional)
    
    Returns:
        str: Caminho do arquivo gerado
    """
    # Criar documento
    doc = Document()
    
    # Configurar margens da página (em centímetros)
    secao = doc.sections[0]
    secao.left_margin = Cm(2)
    secao.right_margin = Cm(2)
    secao.top_margin = Cm(2)
    secao.bottom_margin = Cm(2)
    
    # Cabeçalho
    cabecalho = doc.add_heading('RELATÓRIO DE MANUTENÇÃO', 0)
    cabecalho.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    for run in cabecalho.runs:
        run.font.size = Pt(16)
        run.font.bold = True
        
    # Dados gerais
    data = data_relatorio or datetime.now().strftime("%d/%m/%Y")
    p = doc.add_paragraph()
    p.alignment = WD_PARAGRAPH_ALIGNMENT.RIGHT
    p.add_run(f'Data: {data}').bold = True
    
    # Informações do equipamento
    doc.add_heading('Informações do Equipamento', level=1)
    
    # Tabela de informações do equipamento
    tabela_info = doc.add_table(rows=3, cols=2)
    tabela_info.style = 'Table Grid'
    
    # Linha 1
    tabela_info.cell(0, 0).text = "Equipamento:"
    tabela_info.cell(0, 1).text = "Servidor Dell PowerEdge R740"
    
    # Linha 2
    tabela_info.cell(1, 0).text = "Número de Série:"
    tabela_info.cell(1, 1).text = "SRV78945612"
    
    # Linha 3
    tabela_info.cell(2, 0).text = "Localização:"
    tabela_info.cell(2, 1).text = "Sala de Servidores - Andar 2"
    
    # Formatação da tabela
    adicionar_borda_tabela(tabela_info)
    tabela_info.autofit = True
    
    # Descrição do serviço
    doc.add_heading('Descrição do Serviço', level=1)
    descricao = doc.add_paragraph(
        "Foi realizada uma manutenção preventiva no servidor, incluindo limpeza dos "
        "componentes internos, verificação do sistema de refrigeração e atualização "
        "do firmware. Também foram substituídos dois discos rígidos que apresentavam "
        "erros nos testes de diagnóstico S.M.A.R.T."
    )
    
    # Peças utilizadas
    doc.add_heading('Peças Utilizadas', level=1)
    tabela_pecas = doc.add_table(rows=1, cols=3)
    tabela_pecas.style = 'Table Grid'
    
    # Cabeçalho da tabela
    cabecalho_cells = tabela_pecas.rows[0].cells
    cabecalho_cells[0].text = "Nome"
    cabecalho_cells[1].text = "Quantidade"
    cabecalho_cells[2].text = "Observações"
    
    # Formatar cabeçalho da tabela
    for cell in cabecalho_cells:
        para = cell.paragraphs[0]
        para.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
        for run in para.runs:
            run.font.bold = True
    
    # Adicionar linhas com peças
    pecas = [
        {"nome": "Disco Rígido SAS 600GB", "quantidade": 2, "observacoes": "Substituição preventiva"},
        {"nome": "Pasta Térmica", "quantidade": 1, "observacoes": "Aplicada no processador"},
        {"nome": "Filtro de Ar", "quantidade": 1, "observacoes": "Substituído por estar saturado"}
    ]
    
    for peca in pecas:
        row_cells = tabela_pecas.add_row().cells
        row_cells[0].text = peca["nome"]
        row_cells[1].text = str(peca["quantidade"])
        row_cells[2].text = peca["observacoes"]
        # Centralizar quantidade
        row_cells[1].paragraphs[0].alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    
    # Formatação da tabela
    adicionar_borda_tabela(tabela_pecas)
    tabela_pecas.autofit = True
    
    # Observações adicionais
    doc.add_heading('Observações Adicionais', level=1)
    obs = doc.add_paragraph(
        "Recomenda-se agendar uma manutenção completa do sistema de refrigeração "
        "nos próximos 3 meses, pois foram observados sinais de desgaste nas "
        "ventoinhas principais. A temperatura de operação está dentro dos parâmetros "
        "normais, mas é importante realizar esse serviço preventivamente."
    )
    
    # Assinatura
    doc.add_paragraph("\n\n")
    assinatura = doc.add_paragraph("____________________________")
    assinatura.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    
    tecnico = doc.add_paragraph("Carlos Eduardo Silva")
    tecnico.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    
    cargo = doc.add_paragraph("Técnico de Manutenção")
    cargo.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    
    # Salvar o documento
    caminho_arquivo = "relatorio_teste.docx"
    doc.save(caminho_arquivo)
    print(f"Relatório gerado com sucesso: {os.path.abspath(caminho_arquivo)}")
    
    return caminho_arquivo

if __name__ == "__main__":
    gerar_relatorio()