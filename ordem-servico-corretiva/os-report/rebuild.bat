@echo off
REM Script para reconstruir e reiniciar os containers Docker no Windows

echo Parando os containers...
docker-compose down

echo Reconstruindo os containers...
docker-compose build --no-cache

echo Iniciando os servicos...
docker-compose up -d

echo Verificando logs do backend (Ctrl+C para sair)...
docker-compose logs -f backend 