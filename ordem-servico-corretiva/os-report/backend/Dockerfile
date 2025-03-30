FROM python:3.9-slim

WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar os arquivos de requisitos
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o código da aplicação
COPY . .

# Criar diretório para uploads e banco de dados com permissões adequadas
RUN mkdir -p /app/uploads
RUN mkdir -p /app/data
RUN chmod -R 777 /app/data
RUN chmod -R 777 /app/uploads

# Garantir que todos arquivos SQLite futuros terão permissão de escrita
RUN touch /app/data/app.db && chmod 666 /app/data/app.db

# Expor a porta que o servidor vai utilizar
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["python", "run.py"] 