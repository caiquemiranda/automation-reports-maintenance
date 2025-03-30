from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import logging
from dotenv import load_dotenv

from .routers import documentos
from . import models, crud
from .database import engine, get_db

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Carregar variáveis de ambiente
load_dotenv()

# Criar tabelas no banco de dados
try:
    models.Base.metadata.create_all(bind=engine)
    logger.info("Tabelas do banco de dados criadas com sucesso")
except Exception as e:
    logger.error(f"Erro ao criar tabelas no banco de dados: {e}")

# Configurações da API
api_prefix = os.getenv("API_PREFIX", "/api")
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

logger.info(f"Prefixo da API: {api_prefix}")
logger.info(f"CORS origens permitidas: {cors_origins}")

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
async def health_check(db: Session = Depends(get_db)):
    """Endpoint de verificação de saúde da API e do banco de dados."""
    try:
        # Verificar se consegue executar uma consulta simples no banco de dados
        test_record = crud.get_documentos(db, skip=0, limit=1)
        logger.info("Health check: Conexão com banco de dados OK")
        
        return {
            "status": "ok",
            "message": "API está funcionando corretamente",
            "database": "connected",
            "database_records_found": len(test_record),
            "database_location": os.getenv("DATABASE_URL", "default")
        }
    except Exception as e:
        logger.error(f"Health check: Erro ao conectar ao banco de dados: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro de conexão com o banco de dados: {str(e)}"
        ) 