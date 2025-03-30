@echo off
REM Script para reconstruir e reiniciar os containers Docker no Windows

echo Parando os containers...
docker-compose down

echo Garantindo que os diretorios de dados existam...
if not exist "backend\data" mkdir backend\data
if not exist "backend\uploads" mkdir backend\uploads

echo Ajustando permissoes...
attrib +w backend\data
attrib +w backend\uploads

echo Reconstruindo os containers...
docker-compose build --no-cache

echo Iniciando os servicos...
docker-compose up -d

echo Verificando logs do backend (Ctrl+C para sair)...
docker-compose logs -f backend 