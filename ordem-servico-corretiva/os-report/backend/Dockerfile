FROM python:3.9-slim

WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Copiar os arquivos de requisitos
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Criar diretório para uploads e banco de dados com permissões adequadas
RUN mkdir -p /app/uploads && chmod -R 777 /app/uploads
RUN mkdir -p /app/data && chmod -R 777 /app/data

# Copiar o código da aplicação
COPY . .

# Garantir permissões no diretório de dados após copiar o código
RUN chmod -R 777 /app/data
RUN chmod -R 777 /app/uploads

# Testar criação do banco SQLite e verificar permissões
RUN touch /app/data/app.db && chmod 666 /app/data/app.db && \
    sqlite3 /app/data/app.db "PRAGMA journal_mode=WAL;" && \
    echo "Teste de permissões" > /app/data/test.txt && \
    rm /app/data/test.txt

# Expor a porta que o servidor vai utilizar
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["python", "run.py"] 