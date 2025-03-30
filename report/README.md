# Replicação de Documentos DOC/DOCX

Este script permite replicar arquivos de documentos DOC/DOCX de forma segura, mantendo o arquivo original intacto.

## Funcionalidades

O script `teste.py` implementa:

1. **Replicação de documentos .doc**: Utilizando cópia binária direta para garantir reprodução exata
2. **Verificação de conteúdo**: Comparação byte a byte para confirmar a reprodução exata

## Como usar

```python
python teste.py
```

Por padrão, o script:
- Lê o arquivo `report.doc` na pasta raiz
- Cria uma réplica exata em `report_replicado.doc`
- Verifica se os arquivos são idênticos

## Requisitos

- Python 3.6+

## Limitações

- A tentativa anterior de modificar o conteúdo do documento .doc causou corrupção
- Este script foi simplificado para apenas replicar o documento, sem modificá-lo
- Alterações no conteúdo devem ser feitas manualmente usando aplicativos como Microsoft Word

## Personalização

Para personalizar os caminhos de origem e destino, modifique as seguintes linhas no script:

```python
caminho_origem = "report.doc"
caminho_destino = "report_replicado.doc"
```

## Nota Importante

Tentativas anteriores de manipular o conteúdo do arquivo .doc resultaram em corrupção. Por questões de segurança, este script agora realiza apenas cópia binária direta para garantir a integridade do documento. 