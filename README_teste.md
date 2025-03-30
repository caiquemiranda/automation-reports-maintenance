# Script de Automação de Relatórios

Este script gera um relatório de manutenção no formato Word, seguindo exatamente o mesmo modelo do arquivo `report.doc`.

## Requisitos

Para executar o script, você precisará instalar a biblioteca `python-docx`:

```bash
pip install python-docx
```

## Como executar

Execute o script Python diretamente:

```bash
python teste.py
```

O script irá gerar um arquivo `relatorio_teste.docx` na mesma pasta.

## Personalização

Você pode modificar o script para personalizar as informações do relatório:

1. Edite os dados do equipamento na função `gerar_relatorio()`
2. Modifique a lista `pecas` para incluir diferentes peças utilizadas
3. Atualize a descrição do serviço e observações conforme necessário
4. Para alterar a data, passe um argumento para a função:
   ```python
   gerar_relatorio("25/04/2023")
   ```

## Funcionalidades

O script inclui:

- Formatação de documento com estilo profissional
- Tabelas formatadas para informações do equipamento e peças utilizadas
- Seções organizadas por títulos
- Campo para assinatura do técnico
- Formatação de texto com alinhamento apropriado 