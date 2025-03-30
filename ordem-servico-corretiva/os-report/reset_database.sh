#!/bin/bash

echo "Script para limpar e reinstalar o banco de dados"
echo "================================================"

# Parar os containers
echo "Parando os containers..."
docker-compose down

# Limpar o banco de dados
echo "Removendo banco de dados antigo..."
rm -f backend/data/app.db*

# Criar diretório de dados se não existir
echo "Verificando diretório de dados..."
mkdir -p backend/data

# Configurar permissões
echo "Configurando permissões..."
chmod -R 777 backend/data

# Verificar permissões
echo "Permissões do diretório:"
ls -la backend/data

# Reiniciar containers
echo "Reiniciando containers..."
docker-compose up -d --build

# Esperar inicialização
echo "Aguardando inicialização (10s)..."
sleep 10

# Verificar status
echo "Verificando status..."
docker ps

# Verificar logs
echo "Últimas 20 linhas de log do backend:"
docker logs --tail 20 os-report-backend

echo ""
echo "Verificando se o banco foi criado:"
ls -la backend/data

echo ""
echo "Processo concluído!"
echo "Acesse o aplicativo em: http://localhost:3000" 