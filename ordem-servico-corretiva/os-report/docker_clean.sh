#!/bin/bash
# Script para limpar todos os recursos Docker (containers, imagens, volumes, networks)
# AVISO: Este script remove TODOS os recursos Docker do sistema!

echo "========================================================"
echo "ATENÇÃO: Este script irá remover TODOS os seguintes recursos Docker:"
echo "- Containers (parados e em execução)"
echo "- Imagens"
echo "- Volumes"
echo "- Networks"
echo "- Build Cache"
echo "========================================================"
echo ""
echo "Este processo NÃO PODE SER DESFEITO e pode afetar outros projetos Docker!"
echo ""
read -p "Tem certeza que deseja continuar? (s/N): " CONFIRMA

if [[ "$CONFIRMA" != "s" && "$CONFIRMA" != "S" ]]; then
    echo "Operação cancelada pelo usuário."
    exit 0
fi

echo ""
echo "Iniciando limpeza do Docker..."
echo ""

# Passo 1: Parar e remover todos os containers
echo "Parando todos os containers..."
docker stop $(docker ps -a -q) 2>/dev/null || echo "Nenhum container para parar."
echo "Removendo todos os containers..."
docker rm $(docker ps -a -q) 2>/dev/null || echo "Nenhum container para remover."

# Passo 2: Remover todas as imagens
echo "Removendo todas as imagens Docker..."
docker rmi $(docker images -a -q) --force 2>/dev/null || echo "Nenhuma imagem para remover."

# Passo 3: Remover todos os volumes
echo "Removendo todos os volumes Docker..."
docker volume rm $(docker volume ls -q) 2>/dev/null || echo "Nenhum volume para remover."

# Passo 4: Remover todas as networks não padrão
echo "Removendo todas as redes Docker (exceto padrões)..."
docker network rm $(docker network ls | grep -v "bridge\|host\|none" | awk '{print $1}') 2>/dev/null || echo "Nenhuma rede para remover."

# Passo 5: Remover build cache
echo "Removendo cache de construção Docker..."
docker builder prune -f 2>/dev/null || echo "Nenhum cache de construção para remover."

# Passo 6: Limpeza do sistema Docker
echo "Executando limpeza do sistema Docker..."
docker system prune -a -f --volumes

echo ""
echo "========================================================"
echo "Limpeza concluída! Todos os recursos Docker foram removidos."
echo "Para reiniciar seus containers, execute 'docker-compose up -d'"
echo "========================================================"

# Verificar se ainda existem recursos Docker
if [ $(docker ps -a -q | wc -l) -gt 0 ] || [ $(docker images -a -q | wc -l) -gt 0 ] || [ $(docker volume ls -q | wc -l) -gt 0 ]; then
    echo ""
    echo "AVISO: Alguns recursos Docker ainda estão presentes no sistema."
    echo "Você pode precisar executar 'docker system prune -a --volumes' manualmente como superusuário."
fi 