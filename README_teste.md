# Script de Automação de Relatórios

Este projeto contém scripts que geram relatórios de manutenção no formato Word, seguindo exatamente o mesmo modelo do arquivo `report.doc`.

## Requisitos

Para executar os scripts, você precisará instalar a biblioteca `python-docx`:

```bash
pip install python-docx
```

## Scripts Disponíveis

### 1. Script Básico (teste.py)

Um script simples que gera um relatório com dados predefinidos.

```bash
python teste.py
```

O script irá gerar um arquivo `relatorio_teste.docx` na mesma pasta.

### 2. Script Avançado (teste_avancado.py)

Um script mais flexível que permite personalizar todos os dados do relatório através de um arquivo JSON.

```bash
# Usando dados de exemplo (incorporados no script)
python teste_avancado.py

# Usando um arquivo JSON personalizado
python teste_avancado.py --json exemplo_relatorio.json

# Especificando o nome do arquivo de saída
python teste_avancado.py --json exemplo_relatorio.json --output meu_relatorio.docx
```

## Personalização via JSON

O script avançado aceita um arquivo JSON com a seguinte estrutura:

```json
{
    "titulo": "RELATÓRIO DE MANUTENÇÃO",
    "data": "30/03/2023",
    "equipamento": {
        "nome": "Nome do Equipamento",
        "numero_serie": "Número de Série",
        "localizacao": "Local do Equipamento"
    },
    "descricao_servico": "Descrição detalhada do serviço realizado...",
    "pecas": [
        {
            "nome": "Nome da Peça",
            "quantidade": 1,
            "observacoes": "Observações sobre a peça"
        }
    ],
    "observacoes": "Observações gerais sobre o serviço...",
    "tecnico": {
        "nome": "Nome do Técnico",
        "cargo": "Cargo do Técnico"
    },
    "nome_arquivo": "nome_do_arquivo_saida.docx"
}
```

## Funcionalidades

Os scripts incluem:

- Formatação de documento com estilo profissional
- Tabelas formatadas para informações do equipamento e peças utilizadas
- Seções organizadas por títulos
- Campo para assinatura do técnico
- Formatação de texto com alinhamento apropriado
- Suporte a dados personalizados (script avançado)

## Uso Programático

O script avançado também pode ser importado e usado diretamente em outros scripts Python:

```python
from teste_avancado import gerar_relatorio

# Criar dicionário com os dados
dados = {
    "titulo": "RELATÓRIO PERSONALIZADO",
    "equipamento": {
        "nome": "Meu Equipamento",
        "numero_serie": "12345",
        "localizacao": "Minha Localização"
    },
    "descricao_servico": "Descrição do serviço...",
    # ... outros dados ...
}

# Gerar relatório
caminho_arquivo = gerar_relatorio(dados)
print(f"Relatório gerado em: {caminho_arquivo}") 