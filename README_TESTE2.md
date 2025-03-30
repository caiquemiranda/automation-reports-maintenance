# Replicação e Modificação Avançada de Documentos DOC

Este script (`teste2.py`) permite replicar arquivos de documentos DOC de forma segura e modificar seu conteúdo substituindo marcadores específicos, mantendo a formatação original do documento.

## Características Principais

- **Cópia Exata**: Replica o documento com precisão binária
- **Substituição de Marcadores**: Identifica e substitui marcadores predefinidos no documento
- **Preservação de Formatação**: Mantém a formatação original do documento
- **Múltiplos Métodos**: Oferece diferentes abordagens para garantir compatibilidade
- **Verificação de Integridade**: Verifica se as operações foram realizadas corretamente
- **Backups Automáticos**: Cria cópias de segurança para evitar perda de dados

## Marcadores Suportados

O script pode identificar e substituir os seguintes marcadores no documento:

- `[Data da Solicitação]`
- `[Data de Execução]`
- `[Localização]`
- `[O.S]`
- `[SERVIÇO A REALIZAR]`
- `[OBSERVAÇÃO]`

## Métodos de Modificação

O script oferece dois métodos principais para modificar documentos .doc:

1. **Usando Microsoft Word (COM/Automation)**: 
   - Utiliza a API do Word via biblioteca `pywin32`
   - Oferece máxima compatibilidade e preservação de formatação
   - Requer Microsoft Word instalado na máquina

2. **Método Alternativo (Conversão DOCX)**:
   - Converte temporariamente para DOCX, modifica e converte de volta
   - Utiliza LibreOffice ou Microsoft Word para as conversões
   - Funciona mesmo sem Microsoft Word

## Requisitos

- Python 3.6+
- Para o método Word: biblioteca `pywin32` (`pip install pywin32`)
- Para o método alternativo: 
  - biblioteca `python-docx` (`pip install python-docx`)
  - LibreOffice (opcional, mas recomendado) ou Microsoft Word

## Como Usar

1. Prepare o documento modelo:
   - Crie um documento Word (.doc) com o conteúdo desejado
   - Insira os marcadores (ex: `[Data da Solicitação]`, `[Localização]`, etc.) onde deseja que os valores sejam substituídos
   - Salve o documento como `report.doc` na mesma pasta do script

2. Execute o script:
   ```
   python teste2.py
   ```

3. Siga as instruções no terminal:
   - O script primeiro cria uma cópia exata do documento
   - Em seguida, solicita os valores para cada marcador
   - Depois, pergunta qual método usar para a modificação
   - Após a modificação, verifica se ela foi bem-sucedida
   - Finalmente, pergunta se deseja substituir o arquivo original

## Fluxo de Funcionamento

```
┌─────────────────┐
│ Arquivo Original│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cópia Exata    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Valores para    │
│   Marcadores    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Método Word    │ ou  │Método Alternativo│
└────────┬────────┘     └────────┬─────────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌────────────────────┐
         │ Documento Modificado│
         └────────────────────┘
```

## Exemplos de Uso

### Exemplo: Preenchimento de relatório
- Documento original com marcadores como `[Data da Solicitação]`, `[Localização]`, etc.
- Ao executar o script:
  - Informar "15/05/2023" para `[Data da Solicitação]`
  - Informar "N1-L01-MZ-112" para `[Localização]`
  - Informar "OS-12345" para `[O.S]`
  - Informar "Substituição do módulo danificado" para `[SERVIÇO A REALIZAR]`
  - Informar "Equipamento em funcionamento após manutenção" para `[OBSERVAÇÃO]`

## Notas Importantes

- **Sempre trabalhe com uma cópia**: O script cria automaticamente uma cópia de trabalho
- **Faça um backup antes de modificar**: Ative a opção de backup quando solicitado
- **Formatos específicos**: Este script foi otimizado para arquivos .doc
- **Documentos complexos**: Alguns documentos com formatação complexa podem requerer o método Word
- **Marcadores sensíveis a maiúsculas/minúsculas**: Os marcadores devem estar exatamente como definidos

## Solução de Problemas

Se encontrar problemas:

1. **Documento corrompido**: Use apenas o método de cópia exata
2. **Marcadores não encontrados**: Verifique se os marcadores no documento estão exatamente como `[Data da Solicitação]`, etc.
3. **Erros com Word**: Certifique-se de que o Microsoft Word está instalado e funcionando
4. **Erros com LibreOffice**: Verifique se o LibreOffice está instalado corretamente 