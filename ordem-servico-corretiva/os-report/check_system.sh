#!/bin/bash

echo "=== Script de diagnóstico do sistema ==="
echo "========================================"

# Verificar se os containers estão rodando
echo -e "\n[1] Verificando status dos containers..."
docker ps

# Verificar logs do backend recentes
echo -e "\n[2] Últimas 20 linhas de log do backend..."
docker logs --tail 20 os-report-backend

# Verificar diretório de dados
echo -e "\n[3] Verificando diretório de dados..."
if [ -d "./backend/data" ]; then
    echo "Diretório backend/data existe"
    ls -la ./backend/data
else
    echo "Diretório backend/data NÃO existe!"
    mkdir -p ./backend/data
    echo "Diretório criado."
fi

# Verificar diretório de uploads
echo -e "\n[4] Verificando diretório de uploads..."
if [ -d "./backend/uploads" ]; then
    echo "Diretório backend/uploads existe"
    ls -la ./backend/uploads
else
    echo "Diretório backend/uploads NÃO existe!"
    mkdir -p ./backend/uploads
    echo "Diretório criado."
fi

# Verificar o arquivo de banco de dados
echo -e "\n[5] Verificando banco de dados SQLite..."
DB_FILE="./backend/data/app.db"
if [ -f "$DB_FILE" ]; then
    echo "Arquivo de banco de dados encontrado: $DB_FILE"
    echo "Tamanho: $(du -h $DB_FILE | cut -f1)"
    echo "Permissões: $(ls -la $DB_FILE)"
    
    # Se sqlite3 estiver instalado, verificar tabelas
    if command -v sqlite3 &> /dev/null; then
        echo "Tabelas no banco de dados:"
        sqlite3 $DB_FILE "SELECT name FROM sqlite_master WHERE type='table';"
        
        echo "Contagem de registros na tabela documentos:"
        sqlite3 $DB_FILE "SELECT COUNT(*) FROM documentos;"
    else
        echo "sqlite3 não está instalado. Não é possível verificar o conteúdo do banco de dados."
    fi
else
    echo "Arquivo de banco de dados NÃO encontrado: $DB_FILE"
fi

# Chamar o endpoint de diagnóstico
echo -e "\n[6] Consultando endpoint de diagnóstico..."
curl -s http://localhost:8000/api/documentos/system-info | json_pp

echo -e "\n[7] Consultando health check..."
curl -s http://localhost:8000/api/health | json_pp

echo -e "\n=== Diagnóstico concluído ===" 