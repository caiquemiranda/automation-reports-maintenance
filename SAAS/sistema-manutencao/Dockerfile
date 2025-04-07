# Use a imagem Node.js como base
FROM node:16-alpine

# Configurar ambiente
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:$PATH

# Definir diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos de dependências primeiro para aproveitar o cache
COPY package.json package-lock.json* ./

# Instalar dependências com force para garantir compatibilidade
RUN npm install --legacy-peer-deps

# Copiar código-fonte
COPY . .

# Expor porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"] 