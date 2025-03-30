from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Garantir que o diretório de dados existe
data_dir = os.path.abspath("./data")
if not os.path.exists(data_dir):
    os.makedirs(data_dir, exist_ok=True)
    print(f"Diretório de dados criado: {data_dir}")
else:
    print(f"Diretório de dados encontrado: {data_dir}")

# URL de conexão com o banco de dados
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/app.db")
print(f"Usando banco de dados: {DATABASE_URL}")

# Criar engine do SQLAlchemy
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Criar sessão local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos declarativos
Base = declarative_base()

# Função para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 