#!/bin/bash
# Script para corrigir problemas com o banco de dados SQLite

echo "========================================================"
echo "Iniciando correção do banco de dados..."
echo "========================================================"

# Verificar se o container está rodando
echo "Verificando se o container está rodando..."
if ! docker ps | grep -q os-report-backend; then
    echo "ERRO: O container os-report-backend não está em execução!"
    echo "Por favor, inicie o container com 'docker-compose up -d' antes de executar este script."
    exit 1
fi

# Parar o container para realizar as operações com segurança
echo "Parando o container para realizar a correção..."
docker stop os-report-backend

# Backup do banco de dados atual (se existir)
echo "Criando backup do banco de dados atual..."
docker exec -it os-report-backend sh -c "if [ -f /app/data/app.db ]; then cp /app/data/app.db /app/data/app.db.backup-$(date +%Y%m%d%H%M%S); fi"

# Remover arquivos problemáticos
echo "Removendo arquivos problemáticos do banco de dados..."
docker exec -it os-report-backend sh -c "rm -f /app/data/app.db?* /app/data/app.db-*"

# Corrigir permissões do diretório data
echo "Corrigindo permissões do diretório data..."
docker exec -it os-report-backend sh -c "chmod -R 777 /app/data"

# Corrigir permissões do diretório uploads
echo "Corrigindo permissões do diretório uploads..."
docker exec -it os-report-backend sh -c "chmod -R 777 /app/uploads"

# Iniciar o container novamente
echo "Iniciando o container novamente..."
docker start os-report-backend

# Verificar se o banco de dados foi recriado corretamente
echo "Aguardando 5 segundos para o serviço iniciar..."
sleep 5
echo "Verificando se o banco de dados foi recriado corretamente..."
docker exec -it os-report-backend sh -c "ls -la /app/data"

echo "========================================================"
echo "Correção concluída!"
echo "Verifique os logs do container com 'docker logs os-report-backend'"
echo "========================================================" 