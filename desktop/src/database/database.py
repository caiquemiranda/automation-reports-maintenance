from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from pathlib import Path

# Definir o caminho para o banco de dados SQLite
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = os.path.join(BASE_DIR, "data")
DATABASE_URL = f"sqlite:///{DATA_DIR}/maintenance_reports.db"

# Criar diretório de dados se não existir
os.makedirs(DATA_DIR, exist_ok=True)

# Criar engine
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Criar fábrica de sessão
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos
Base = declarative_base()

def get_db():
    """Obtém uma sessão do banco de dados."""
    db = SessionLocal()
    try:
        return db
    finally:
        db.close() 