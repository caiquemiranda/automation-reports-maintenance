@echo off
REM Script para limpar containers e dados do SQLite para Windows

echo === Limpando containers e dados do Sistema de Relatórios de Manutenção ===

REM Parar e remover os containers
echo Parando e removendo containers Docker...
docker-compose down

REM Opção para remover volumes
set /p remove_volumes="Deseja remover todos os volumes? [s/N]: "
if /i "%remove_volumes%"=="s" (
    echo Removendo volumes...
    docker-compose down -v
)

REM Remover o banco de dados SQLite
echo Removendo banco de dados SQLite...
if exist data\maintenance_reports.db del /f /q data\maintenance_reports.db
if not exist data mkdir data

echo Limpando arquivos temporários...
for /r %%i in (*.pyc) do del /f /q "%%i"
for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d"

echo === Limpeza concluída ===
echo Para reiniciar a aplicação, execute: run.bat 