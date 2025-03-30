# Diagnóstico e Solução de Problemas

Este documento contém instruções para diagnosticar e resolver problemas comuns no sistema de Ordens de Serviço.

## Problemas Comuns e Soluções

### 1. Diferentes URLs salvando no mesmo documento

**Problema**: URLs diferentes estavam apontando para o mesmo documento.

**Solução**: Melhoramos o sistema para garantir que cada ordem de serviço tenha uma URL única baseada no número da OS e no ID do documento.

### 2. Dados não sendo salvos no banco de dados

**Problema**: O banco de dados SQLite (app.db) não estava salvando os dados corretamente.

**Solução**: 
- Corrigimos as permissões do diretório de dados
- Ajustamos a configuração do Docker Compose para persistir corretamente os volumes
- Melhoramos as opções de conexão do SQLite
- Criamos scripts de reinicialização do banco (reset_database.sh e reset_database.bat)

### 3. Imagens não aparecendo na pasta uploads

**Problema**: Os uploads de imagens não estavam sendo armazenados corretamente.

**Solução**:
- Verificamos e corrigimos as permissões do diretório de uploads
- Adicionamos logs detalhados para rastrear o processo de upload
- Implementamos um endpoint de diagnóstico para verificar o sistema

## Como usar as ferramentas de diagnóstico

### Script de diagnóstico

1. Para Windows: execute `check_system.bat`
2. Para Linux/Mac: execute `./check_system.sh`

Estes scripts verificarão:
- Se os containers Docker estão em execução
- Os logs recentes do backend
- A existência e permissões dos diretórios de dados e uploads
- O status do banco de dados SQLite
- O estado geral do sistema através de endpoints de diagnóstico

### Endpoint de diagnóstico

Acesse `http://localhost:8000/api/documentos/system-info` em seu navegador para ver informações detalhadas sobre:
- Diretórios do sistema
- Contagem de arquivos
- Status do banco de dados
- Permissões

### Reinicialização do banco de dados

Se necessário, você pode reiniciar o banco de dados:

1. Para Windows: execute `reset_database.bat`
2. Para Linux/Mac: execute `./reset_database.sh`

## Logs do sistema

Para verificar logs detalhados:

```
docker logs os-report-backend
```

Para logs contínuos:

```
docker logs -f os-report-backend
```

## Verificação manual do banco de dados

Se você tiver o SQLite instalado, pode verificar o banco de dados diretamente:

```
sqlite3 backend/data/app.db
```

Comandos úteis do SQLite:
- `.tables` - Lista todas as tabelas
- `SELECT * FROM documentos;` - Lista todos os documentos
- `SELECT * FROM anexos;` - Lista todos os anexos
- `.quit` - Sai do SQLite 