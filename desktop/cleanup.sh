#!/bin/bash

# Script para limpar dados do SQLite na aplicação desktop

echo "=== Limpando dados da aplicação desktop de Relatórios de Manutenção ==="

# Remover o banco de dados SQLite
echo "Removendo banco de dados SQLite..."
rm -f data/maintenance_reports.db
mkdir -p data

echo "Limpando arquivos temporários..."
find . -name "*.pyc" -delete
find . -name "__pycache__" -delete

echo "=== Limpeza concluída ==="
echo "Aplicação reiniciada com um banco de dados limpo." 