from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .config import settings
from .api import api_router
from .database import Base, engine

# Criar as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

def create_app() -> FastAPI:
    """
    Cria a aplicação FastAPI.
    
    Returns:
        Aplicação FastAPI configurada
    """
    # Criar o aplicativo
    app = FastAPI(
        title=settings.APP_NAME,
        description="API para gerenciamento de relatórios de manutenção",
        version="1.0.0",
    )
    
    # Configurar CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Incluir routers
    app.include_router(api_router, prefix=settings.API_PREFIX)
    
    # Garantir que o diretório de dados existe
    os.makedirs(settings.DATABASE_DIR, exist_ok=True)
    
    return app 