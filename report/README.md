# Replicação e Modificação de Documentos DOC/DOCX

Este script permite replicar e modificar arquivos de documentos DOC/DOCX mantendo toda a formatação, incluindo:

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
3. **Modificação de textos**: Permite substituir textos específicos, como informações de serviços
4. **Verificação de conteúdo**: Comparação byte a byte para confirmar alterações

## Como usar

### Replicação simples

```python
python teste.py
```

Por padrão, o script:
- Lê o arquivo `report.doc` na pasta raiz
- Cria uma réplica em `report_modificado.doc` com o texto do serviço substituído
- Verifica se a modificação foi aplicada corretamente

### Modificação do texto de serviço

O script está configurado para substituir:

De: "SERVIÇO: Troca da base, mais o detector de fumaça (N1-L01-215 DF)"  
Para: "SERVIÇO: Susbtituição do modulo danificado (N1-L01-MZ-112)"

Para personalizar a substituição, modifique as seguintes linhas no script:

```python
modificacoes = {
    # Texto exato a substituir
    "SERVIÇO: Troca da base, mais o detector de fumaça (N1-L01-215 DF)": 
    "SERVIÇO: Susbtituição do modulo danificado (N1-L01-MZ-112)",
    
    # Ou usando regex para maior flexibilidade
    re.compile(r'SERVIÇO:.*?[\(N1-L01-215 DF\)]'): 
    "SERVIÇO: Susbtituição do modulo danificado (N1-L01-MZ-112)"
}
```

## Requisitos

- Python 3.6+
- Biblioteca python-docx (`pip install python-docx`)

## Técnicas implementadas

- **Substituição binária**: Modifica o conteúdo binário do arquivo .doc diretamente
- **Extração de texto**: Tentativa de identificar o conteúdo textual em documentos binários
- **Preservação de formatação**: Mantém estilos, fontes e cores durante as modificações
- **Manipulação de tabelas**: Permite modificar texto dentro de células de tabelas
- **Fallback automático**: Estratégias alternativas caso a abordagem principal falhe

## Limitações

- Para documentos .doc antigos, o script utiliza técnicas de substituição binária
- Alguns elementos complexos em documentos .docx podem não ser replicados com 100% de fidelidade
- A extração de texto de arquivos .doc binários pode ser imprecisa
- Textos grandes a serem substituídos por textos menores podem deixar espaços em branco

## Personalização

Para personalizar os caminhos de origem e destino, modifique as seguintes linhas no script:

```python
caminho_origem = "report.doc"
caminho_destino = "report_replicado.doc"
``` 