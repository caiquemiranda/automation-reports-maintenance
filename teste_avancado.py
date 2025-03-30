#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Versão avançada do script para geração de relatórios de manutenção.
Permite personalização completa dos dados via parâmetros.
"""

from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os
from datetime import datetime
import argparse
import json

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

def gerar_relatorio(dados):
    """
    Gera um relatório de manutenção personalizado no formato Word.
    
    Args:
        dados: Dicionário com os dados do relatório
    
    Returns:
        str: Caminho do arquivo gerado
    """
    # Verificar se os dados necessários estão presentes
    if not isinstance(dados, dict):
        raise ValueError("Os dados devem ser fornecidos como um dicionário")
        
    # Valores padrão para dados ausentes
    dados_padrao = {
        "titulo": "RELATÓRIO DE MANUTENÇÃO",
        "data": datetime.now().strftime("%d/%m/%Y"),
        "equipamento": {
            "nome": "Não especificado",
            "numero_serie": "Não especificado",
            "localizacao": "Não especificado"
        },
        "descricao_servico": "Não especificado",
        "pecas": [],
        "observacoes": "",
        "tecnico": {
            "nome": "Técnico Responsável",
            "cargo": "Técnico de Manutenção"
        },
        "nome_arquivo": "relatorio_personalizado.docx"
    }
    
    # Mesclar dados padrão com dados fornecidos
    for chave, valor in dados_padrao.items():
        if chave not in dados:
            dados[chave] = valor
        elif isinstance(valor, dict) and isinstance(dados[chave], dict):
            for sub_chave, sub_valor in valor.items():
                if sub_chave not in dados[chave]:
                    dados[chave][sub_chave] = sub_valor
    
    # Criar documento
    doc = Document()
    
    # Configurar margens da página (em centímetros)
    secao = doc.sections[0]
    secao.left_margin = Cm(2)
    secao.right_margin = Cm(2)
    secao.top_margin = Cm(2)
    secao.bottom_margin = Cm(2)
    
    # Cabeçalho
    cabecalho = doc.add_heading(dados["titulo"], 0)
    cabecalho.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    for run in cabecalho.runs:
        run.font.size = Pt(16)
        run.font.bold = True
        
    # Dados gerais
    p = doc.add_paragraph()
    p.alignment = WD_PARAGRAPH_ALIGNMENT.RIGHT
    p.add_run(f'Data: {dados["data"]}').bold = True
    
    # Informações do equipamento
    doc.add_heading('Informações do Equipamento', level=1)
    
    # Tabela de informações do equipamento
    tabela_info = doc.add_table(rows=3, cols=2)
    tabela_info.style = 'Table Grid'
    
    # Linha 1
    tabela_info.cell(0, 0).text = "Equipamento:"
    tabela_info.cell(0, 1).text = dados["equipamento"]["nome"]
    
    # Linha 2
    tabela_info.cell(1, 0).text = "Número de Série:"
    tabela_info.cell(1, 1).text = dados["equipamento"]["numero_serie"]
    
    # Linha 3
    tabela_info.cell(2, 0).text = "Localização:"
    tabela_info.cell(2, 1).text = dados["equipamento"]["localizacao"]
    
    # Formatação da tabela
    adicionar_borda_tabela(tabela_info)
    tabela_info.autofit = True
    
    # Descrição do serviço
    doc.add_heading('Descrição do Serviço', level=1)
    descricao = doc.add_paragraph(dados["descricao_servico"])
    
    # Peças utilizadas
    if dados["pecas"]:
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
        for peca in dados["pecas"]:
            row_cells = tabela_pecas.add_row().cells
            row_cells[0].text = peca.get("nome", "")
            row_cells[1].text = str(peca.get("quantidade", ""))
            row_cells[2].text = peca.get("observacoes", "")
            # Centralizar quantidade
            row_cells[1].paragraphs[0].alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
        
        # Formatação da tabela
        adicionar_borda_tabela(tabela_pecas)
        tabela_pecas.autofit = True
    
    # Observações adicionais
    if dados["observacoes"]:
        doc.add_heading('Observações Adicionais', level=1)
        obs = doc.add_paragraph(dados["observacoes"])
    
    # Assinatura
    doc.add_paragraph("\n\n")
    assinatura = doc.add_paragraph("____________________________")
    assinatura.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    
    tecnico = doc.add_paragraph(dados["tecnico"]["nome"])
    tecnico.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    
    cargo = doc.add_paragraph(dados["tecnico"]["cargo"])
    cargo.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    
    # Salvar o documento
    caminho_arquivo = dados["nome_arquivo"]
    doc.save(caminho_arquivo)
    print(f"Relatório gerado com sucesso: {os.path.abspath(caminho_arquivo)}")
    
    return caminho_arquivo

def carregar_json(caminho_arquivo):
    """Carrega dados de um arquivo JSON."""
    with open(caminho_arquivo, 'r', encoding='utf-8') as f:
        return json.load(f)

def main():
    """Função principal para execução via linha de comando."""
    parser = argparse.ArgumentParser(description='Gera relatórios de manutenção personalizados.')
    parser.add_argument('--json', help='Caminho para arquivo JSON com dados do relatório')
    parser.add_argument('--output', help='Nome do arquivo de saída (opcional)')
    args = parser.parse_args()
    
    # Dados de exemplo
    exemplo_dados = {
        "titulo": "RELATÓRIO DE MANUTENÇÃO",
        "data": datetime.now().strftime("%d/%m/%Y"),
        "equipamento": {
            "nome": "Servidor Dell PowerEdge R740",
            "numero_serie": "SRV78945612",
            "localizacao": "Sala de Servidores - Andar 2"
        },
        "descricao_servico": (
            "Foi realizada uma manutenção preventiva no servidor, incluindo limpeza dos "
            "componentes internos, verificação do sistema de refrigeração e atualização "
            "do firmware. Também foram substituídos dois discos rígidos que apresentavam "
            "erros nos testes de diagnóstico S.M.A.R.T."
        ),
        "pecas": [
            {"nome": "Disco Rígido SAS 600GB", "quantidade": 2, "observacoes": "Substituição preventiva"},
            {"nome": "Pasta Térmica", "quantidade": 1, "observacoes": "Aplicada no processador"},
            {"nome": "Filtro de Ar", "quantidade": 1, "observacoes": "Substituído por estar saturado"}
        ],
        "observacoes": (
            "Recomenda-se agendar uma manutenção completa do sistema de refrigeração "
            "nos próximos 3 meses, pois foram observados sinais de desgaste nas "
            "ventoinhas principais. A temperatura de operação está dentro dos parâmetros "
            "normais, mas é importante realizar esse serviço preventivamente."
        ),
        "tecnico": {
            "nome": "Carlos Eduardo Silva",
            "cargo": "Técnico de Manutenção"
        },
        "nome_arquivo": "relatorio_teste_avancado.docx"
    }
    
    # Carregar dados do arquivo JSON se especificado
    if args.json:
        dados = carregar_json(args.json)
    else:
        dados = exemplo_dados
    
    # Sobrescrever nome do arquivo se especificado
    if args.output:
        dados["nome_arquivo"] = args.output
    
    # Gerar relatório
    gerar_relatorio(dados)

if __name__ == "__main__":
    main() 