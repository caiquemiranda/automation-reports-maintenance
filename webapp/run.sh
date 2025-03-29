#!/bin/bash

# Garantir que o script seja interrompido se ocorrer um erro
set -e

echo "Iniciando o sistema de Relatórios de Manutenção (Versão Web)"
echo "-----------------------------------------------------------"

# Verificar se o Docker está instalado
if ! [ -x "$(command -v docker)" ]; then
  echo "Erro: Docker não está instalado." >&2
  exit 1
fi

# Verificar se o Docker Compose está instalado
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "Erro: Docker Compose não está instalado." >&2
  exit 1
fi

# Construir e iniciar os containers
echo "Construindo e iniciando os containers..."
docker-compose build
docker-compose up -d

# Exibir informações de acesso
echo "-----------------------------------------------------------"
echo "Sistema iniciado com sucesso!"
echo "Acesse o frontend em: http://localhost"
echo "Backend disponível em: http://localhost:5000/api/health"
echo ""
echo "Para parar o sistema, execute: docker-compose down"
echo "-----------------------------------------------------------" 