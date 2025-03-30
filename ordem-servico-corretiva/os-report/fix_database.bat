@echo off
REM Script para corrigir problemas com o banco de dados SQLite

echo ========================================================
echo Iniciando correcao do banco de dados...
echo ========================================================

REM Verificar se o container está rodando
echo Verificando se o container esta rodando...
docker ps | findstr "os-report-backend" > nul
if errorlevel 1 (
    echo ERRO: O container os-report-backend nao esta em execucao!
    echo Por favor, inicie o container com 'docker-compose up -d' antes de executar este script.
    exit /b 1
)

REM Parar o container para realizar as operações com segurança
echo Parando o container para realizar a correcao...
docker stop os-report-backend

REM Backup do banco de dados atual (se existir)
echo Criando backup do banco de dados atual...
for /f "tokens=1-5 delims=/: " %%d in ("%date% %time%") do (
    set datestamp=%%f%%e%%d%%g
)
docker exec os-report-backend sh -c "if [ -f /app/data/app.db ]; then cp /app/data/app.db /app/data/app.db.backup-%datestamp%; fi"

REM Remover arquivos problemáticos
echo Removendo arquivos problematicos do banco de dados...
docker exec os-report-backend sh -c "rm -f /app/data/app.db?* /app/data/app.db-*"

REM Corrigir permissões do diretório data
echo Corrigindo permissoes do diretorio data...
docker exec os-report-backend sh -c "chmod -R 777 /app/data"

REM Corrigir permissões do diretório uploads
echo Corrigindo permissoes do diretorio uploads...
docker exec os-report-backend sh -c "chmod -R 777 /app/uploads"

REM Iniciar o container novamente
echo Iniciando o container novamente...
docker start os-report-backend

REM Verificar se o banco de dados foi recriado corretamente
echo Aguardando 5 segundos para o servico iniciar...
timeout /t 5 /nobreak > nul
echo Verificando se o banco de dados foi recriado corretamente...
docker exec os-report-backend sh -c "ls -la /app/data"

echo ========================================================
echo Correcao concluida!
echo Verifique os logs do container com 'docker logs os-report-backend'
echo ========================================================

pause 