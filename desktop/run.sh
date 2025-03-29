#!/bin/bash

# Garantir que o script seja interrompido se ocorrer um erro
set -e

echo "Iniciando o sistema de Relatórios de Manutenção (Versão Desktop)"
echo "-------------------------------------------------------------"

# Verificar se o Docker está instalado
if ! [ -x "$(command -v docker)" ]; then
  echo "Erro: Docker não está instalado." >&2
  exit 1
fi

# Construir a imagem Docker
echo "Construindo a imagem..."
docker build -t maintenance-reports-desktop .

# Verificar o sistema operacional
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "Executando no Linux..."
    xhost +local:docker
    docker run --rm -it \
      -e DISPLAY=$DISPLAY \
      -v /tmp/.X11-unix:/tmp/.X11-unix \
      maintenance-reports-desktop
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Executando no macOS..."
    xhost +localhost
    IP=$(ifconfig en0 | grep inet | awk '$1=="inet" {print $2}')
    docker run --rm -it \
      -e DISPLAY=$IP:0 \
      -v /tmp/.X11-unix:/tmp/.X11-unix \
      maintenance-reports-desktop
elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    echo "Executando no Windows..."
    echo "Nota: Para executar aplicações GUI no Docker no Windows, é necessário instalar um servidor X11."
    echo "Uma alternativa é usar o WSL2 com um servidor X11 como o VcXsrv."
    
    # Exemplo para Windows com WSL2 e VcXsrv
    # DISPLAY=$(grep -m 1 nameserver /etc/resolv.conf | awk '{print $2}'):0.0
    # docker run --rm -it -e DISPLAY=$DISPLAY maintenance-reports-desktop
    
    # Por agora, apenas executamos sem interface gráfica
    docker run --rm -it maintenance-reports-desktop
fi

echo "-------------------------------------------------------------"
echo "Aplicação finalizada!"
echo "-------------------------------------------------------------" 