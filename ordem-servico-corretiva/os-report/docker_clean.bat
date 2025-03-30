@echo off
REM Script para limpar todos os recursos Docker (containers, imagens, volumes, networks)
REM AVISO: Este script remove TODOS os recursos Docker do sistema!

echo ========================================================
echo ATENCAO: Este script ira remover TODOS os seguintes recursos Docker:
echo - Containers (parados e em execucao)
echo - Imagens
echo - Volumes
echo - Networks
echo - Build Cache
echo ========================================================
echo.
echo Este processo NAO PODE SER DESFEITO e pode afetar outros projetos Docker!
echo.

set /p CONFIRMA="Tem certeza que deseja continuar? (s/N): "
if NOT "%CONFIRMA%" == "s" if NOT "%CONFIRMA%" == "S" (
    echo Operacao cancelada pelo usuario.
    goto :eof
)

echo.
echo Iniciando limpeza do Docker...
echo.

REM Passo 1: Parar e remover todos os containers
echo Parando todos os containers...
for /f "usebackq" %%i in (`docker ps -a -q`) do (
    docker stop %%i 2>nul || echo Nenhum container para parar.
)
echo Removendo todos os containers...
for /f "usebackq" %%i in (`docker ps -a -q`) do (
    docker rm %%i 2>nul || echo Nenhum container para remover.
)

REM Passo 2: Remover todas as imagens
echo Removendo todas as imagens Docker...
for /f "usebackq" %%i in (`docker images -a -q`) do (
    docker rmi --force %%i 2>nul || echo Nenhuma imagem para remover.
)

REM Passo 3: Remover todos os volumes
echo Removendo todos os volumes Docker...
for /f "usebackq" %%i in (`docker volume ls -q`) do (
    docker volume rm %%i 2>nul || echo Nenhum volume para remover.
)

REM Passo 4: Remover build cache
echo Removendo cache de construcao Docker...
docker builder prune -f 2>nul || echo Nenhum cache de construcao para remover.

REM Passo 5: Limpeza do sistema Docker
echo Executando limpeza do sistema Docker...
docker system prune -a -f --volumes

echo.
echo ========================================================
echo Limpeza concluida! Todos os recursos Docker foram removidos.
echo Para reiniciar seus containers, execute 'docker-compose up -d'
echo ======================================================== 