# Imagem base simplificada
FROM node:16-alpine

# Diretório de trabalho
WORKDIR /app

# Configurar ambiente
ENV BROWSER=none
ENV WDS_SOCKET_PORT=3000
ENV NODE_ENV=development

# Copiar package.json
COPY package.json ./

# Instalar dependências
RUN npm install --legacy-peer-deps

# Copiar todo o código fonte
COPY . .

# Porta que o app usa
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"] 