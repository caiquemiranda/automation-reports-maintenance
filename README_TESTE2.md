# Replicação e Modificação Avançada de Documentos DOC

Este script (`teste2.py`) permite replicar arquivos de documentos DOC de forma segura e modificar seu conteúdo usando métodos avançados que evitam a corrupção do arquivo.

## Características Principais

- **Cópia Exata**: Replica o documento com precisão binária
- **Modificação Segura**: Utiliza APIs robustas para modificar o conteúdo
- **Múltiplos Métodos**: Oferece diferentes abordagens para garantir compatibilidade
- **Verificação de Integridade**: Verifica se as operações foram realizadas corretamente
- **Backups Automáticos**: Cria cópias de segurança para evitar perda de dados

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

1. Execute o script:
   ```
   python teste2.py
   ```

2. Siga as instruções no terminal:
   - O script primeiro cria uma cópia exata do documento
   - Depois pergunta qual texto substituir e o novo texto
   - Em seguida, pergunta qual método usar para a modificação
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
│ Seleção de Texto│
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

### Exemplo 1: Substituição de texto de serviço
- Texto original: "SERVIÇO: Troca da base, mais o detector de fumaça (N1-L01-215 DF)"
- Novo texto: "SERVIÇO: Susbtituição do modulo danificado (N1-L01-MZ-112)"

### Exemplo 2: Personalizando a substituição
- Escolha a opção para inserir texto personalizado
- Digite o texto exato que deseja substituir
- Digite o novo texto que aparecerá no documento

## Notas Importantes

- **Sempre trabalhe com uma cópia**: O script cria automaticamente uma cópia de trabalho
- **Faça um backup antes de modificar**: Ative a opção de backup quando solicitado
- **Formatos específicos**: Este script foi otimizado para arquivos .doc
- **Documentos complexos**: Alguns documentos com formatação complexa podem requerer o método Word

## Solução de Problemas

Se encontrar problemas:

1. **Documento corrompido**: Use apenas o método de cópia exata (como no `teste.py`)
2. **Texto não encontrado**: Verifique se o texto existe exatamente como digitado
3. **Erros com Word**: Certifique-se de que o Microsoft Word está instalado e funcionando
4. **Erros com LibreOffice**: Verifique se o LibreOffice está instalado corretamente 