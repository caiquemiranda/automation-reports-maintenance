@echo off
echo === Script de diagnóstico do sistema ===
echo ========================================

rem Verificar se os containers estão rodando
echo [1] Verificando status dos containers...
docker ps

rem Verificar logs do backend recentes
echo [2] Últimas 20 linhas de log do backend...
docker logs --tail 20 os-report-backend

rem Verificar diretório de dados
echo [3] Verificando diretório de dados...
if exist backend\data (
    echo Diretório backend\data existe
    dir backend\data
) else (
    echo Diretório backend\data NÃO existe!
    mkdir backend\data
    echo Diretório criado.
)

rem Verificar diretório de uploads
echo [4] Verificando diretório de uploads...
if exist backend\uploads (
    echo Diretório backend\uploads existe
    dir backend\uploads
) else (
    echo Diretório backend\uploads NÃO existe!
    mkdir backend\uploads
    echo Diretório criado.
)

rem Verificar o arquivo de banco de dados
echo [5] Verificando banco de dados SQLite...
if exist backend\data\app.db (
    echo Arquivo de banco de dados encontrado: backend\data\app.db
    dir backend\data\app.db
) else (
    echo Arquivo de banco de dados NÃO encontrado: backend\data\app.db
)

rem Chamar o endpoint de diagnóstico
echo [6] Consultando endpoint de diagnóstico...
curl -s http://localhost:8000/api/documentos/system-info

echo [7] Consultando health check...
curl -s http://localhost:8000/api/health

echo === Diagnóstico concluído ===
pause 