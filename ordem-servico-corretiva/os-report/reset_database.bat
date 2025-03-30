@echo off
echo Script para limpar e reinstalar o banco de dados
echo ================================================

rem Parar os containers
echo Parando os containers...
docker-compose down

rem Limpar o banco de dados
echo Removendo banco de dados antigo...
del /Q backend\data\app.db*

rem Criar diretório de dados se não existir
echo Verificando diretório de dados...
if not exist backend\data mkdir backend\data

rem Reiniciar containers
echo Reiniciando containers...
docker-compose up -d --build

rem Esperar inicialização
echo Aguardando inicialização (10s)...
timeout /t 10 /nobreak

rem Verificar status
echo Verificando status...
docker ps

rem Verificar logs
echo Últimas 20 linhas de log do backend:
docker logs --tail 20 os-report-backend

echo.
echo Verificando se o banco foi criado:
dir backend\data

echo.
echo Processo concluído!
echo Acesse o aplicativo em: http://localhost:3000
pause 