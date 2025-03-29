from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from .config import settings

# Criar o diretório para o banco de dados se ele não existir
os.makedirs(os.path.dirname(settings.DATABASE_URL), exist_ok=True)

# Criar conexão com o banco de dados
engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False}
)

# Criar fábrica de sessões
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos
Base = declarative_base()

# Dependency
def get_db():
    """
    Dependency para injetar sessão do banco de dados nas rotas.
    Garante que a sessão é fechada após a requisição.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 