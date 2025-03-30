#!/bin/bash
# Script para reconstruir e reiniciar os containers Docker

echo "Parando os containers..."
docker-compose down

echo "Removendo volume do banco de dados..."
docker volume rm os-report_db-volume 2>/dev/null || true

echo "Reconstruindo os containers..."
docker-compose build --no-cache

echo "Iniciando os serviços..."
docker-compose up -d

echo "Verificando logs do backend (Ctrl+C para sair)..."
docker-compose logs -f backend 