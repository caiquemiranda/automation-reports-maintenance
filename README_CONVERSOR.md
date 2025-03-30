# Conversor de Documentos DOC para HTML/PDF

Este projeto permite converter documentos no formato DOC para HTML, realizar edições e depois exportar para PDF.

## Pré-requisitos

1. Python 3.6 ou superior
2. Bibliotecas Python listadas em `requirements.txt`
3. wkhtmltopdf - necessário para a conversão de HTML para PDF

## Instalação

1. Clone ou baixe este repositório
2. Instale as dependências Python:

```
pip install -r requirements.txt
```

3. Instale o wkhtmltopdf:
   - Windows: Baixe o instalador em [wkhtmltopdf.org](https://wkhtmltopdf.org/downloads.html)
   - Linux: `sudo apt-get install wkhtmltopdf`
   - macOS: `brew install wkhtmltopdf`

## Como Usar

1. Coloque seu arquivo `report.doc` na mesma pasta do script
2. Execute o script:

```
python doc_converter.py
```

3. O servidor Flask será iniciado
4. Acesse http://localhost:5000/ para visualizar o documento convertido
5. Acesse http://localhost:5000/edit para editar o documento
6. Após fazer as alterações, clique em "Salvar Alterações"
7. Para baixar o documento em PDF, acesse http://localhost:5000/download-pdf

## Funcionalidades

- Conversão de DOC para HTML
- Interface de edição de HTML com editor visual
- Conversão de HTML para PDF
- Download do PDF gerado

## Personalização

Você pode modificar o arquivo CSS em `static/css/report.css` para ajustar o estilo do documento conforme necessário.

## Solução de Problemas

- Se a conversão de DOC para HTML falhar, verifique se o arquivo está corrompido ou protegido
- Se a geração de PDF falhar, verifique se o wkhtmltopdf está instalado corretamente

## Limitações

- A conversão de DOC para HTML pode perder algumas formatações complexas
- Alguns elementos como cabeçalhos, rodapés e marcas d'água podem não ser convertidos perfeitamente 