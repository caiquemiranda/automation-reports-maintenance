import os
from pydantic import BaseSettings
from typing import Optional
from pathlib import Path

class Settings(BaseSettings):
    """Configurações da aplicação."""
    
    # Base
    APP_NAME: str = "Maintenance Reports API"
    API_PREFIX: str = "/api"
    DEBUG: bool = True
    
    # Database
    DATABASE_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
    DATABASE_URL: str = f"sqlite:///{DATABASE_DIR}/maintenance_reports.db"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "development_secret_key")
    
    # CORS
    CORS_ORIGINS: list = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Carregar configurações
settings = Settings()

# Garantir que o diretório de dados existe
os.makedirs(settings.DATABASE_DIR, exist_ok=True) 