#!/bin/bash

# Script para limpar containers e dados do SQLite

echo "=== Limpando containers e dados do Sistema de Relatórios de Manutenção ==="

# Parar e remover os containers
echo "Parando e removendo containers Docker..."
docker-compose down

# Remover os volumes (opcional)
read -p "Deseja remover todos os volumes? [s/N]: " remove_volumes
if [[ $remove_volumes == "s" || $remove_volumes == "S" ]]; then
    echo "Removendo volumes..."
    docker-compose down -v
fi

# Remover o banco de dados SQLite
echo "Removendo banco de dados SQLite..."
rm -f data/maintenance_reports.db
mkdir -p data

echo "Limpando arquivos temporários..."
find . -name "*.pyc" -delete
find . -name "__pycache__" -delete

echo "=== Limpeza concluída ==="
echo "Para reiniciar a aplicação, execute: ./run.sh" 