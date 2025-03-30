#!/bin/bash
# Script para reconstruir e reiniciar os containers Docker

echo "Parando os containers..."
docker-compose down

echo "Garantindo que os diretórios de dados existam..."
mkdir -p backend/data
mkdir -p backend/uploads

echo "Ajustando permissões..."
chmod -R 777 backend/data
chmod -R 777 backend/uploads

echo "Removendo volume do banco de dados..."
docker volume rm os-report_db-volume 2>/dev/null || true

echo "Reconstruindo os containers..."
docker-compose build --no-cache

echo "Iniciando os serviços..."
docker-compose up -d

echo "Verificando logs do backend (Ctrl+C para sair)..."
docker-compose logs -f backend 