from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from .routers import documentos
from . import models
from .database import engine

# Carregar variáveis de ambiente
load_dotenv()

# Criar tabelas no banco de dados
models.Base.metadata.create_all(bind=engine)

# Configurações da API
api_prefix = os.getenv("API_PREFIX", "/api")
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

# Instância da aplicação FastAPI
app = FastAPI(
    title="API Ordem de Serviço",
    description="API para gerenciamento de Ordens de Serviço Corretivas",
    version="1.0.0",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas
app.include_router(documentos.router, prefix=api_prefix)

@app.get("/")
async def root():
    """Rota raiz da API."""
    return {
        "mensagem": "API de Ordem de Serviço Corretiva",
        "documentacao": "/docs"
    }

@app.get(f"{api_prefix}/health")
async def health_check():
    """Endpoint de verificação de saúde da API."""
    return {
        "status": "ok",
        "message": "API está funcionando corretamente"
    } 