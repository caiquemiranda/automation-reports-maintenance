@echo off
REM Script para limpar dados do SQLite na aplicação desktop para Windows

echo === Limpando dados da aplicação desktop de Relatórios de Manutenção ===

REM Remover o banco de dados SQLite
echo Removendo banco de dados SQLite...
if exist data\maintenance_reports.db del /f /q data\maintenance_reports.db
if not exist data mkdir data

echo Limpando arquivos temporários...
for /r %%i in (*.pyc) do del /f /q "%%i"
for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d"

echo === Limpeza concluída ===
echo Aplicação reiniciada com um banco de dados limpo. 