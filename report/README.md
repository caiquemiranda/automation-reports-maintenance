# Replicação de Documentos DOC/DOCX

Este script permite replicar arquivos de documentos DOC/DOCX mantendo toda a formatação, incluindo:

- Textos e formatação (fontes, tamanhos, cores, estilos)
- Tabelas e sua estrutura
- Parágrafos e alinhamentos
- Configurações de página
- Cabeçalhos e rodapés (em implementações avançadas)
- Propriedades do documento

## Funcionalidades

O script `teste.py` implementa:

1. **Replicação de documentos .doc**: Utilizando cópia binária direta para garantir reprodução exata
2. **Replicação de documentos .docx**: Utilizando a biblioteca python-docx para reproduzir a estrutura
3. **Verificação de conteúdo**: Comparação byte a byte para confirmar a reprodução exata

## Como usar

```python
python teste.py
```

Por padrão, o script:
- Lê o arquivo `report.doc` na pasta raiz
- Cria uma réplica em `report_replicado.doc`
- Verifica se os arquivos são idênticos

## Requisitos

- Python 3.6+
- Biblioteca python-docx (`pip install python-docx`)

## Limitações

- Para documentos .doc antigos, o script utiliza cópia binária direta
- Alguns elementos complexos em documentos .docx podem não ser replicados com 100% de fidelidade através da biblioteca python-docx
- Imagens e gráficos complexos podem requerer módulos adicionais

## Personalização

Para personalizar os caminhos de origem e destino, modifique as seguintes linhas no script:

```python
caminho_origem = "report.doc"
caminho_destino = "report_replicado.doc"
``` 