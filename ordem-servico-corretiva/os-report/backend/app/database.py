from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import sys
import logging
from dotenv import load_dotenv

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Carregar variáveis de ambiente
load_dotenv()

# Garantir que o diretório de dados existe
data_dir = os.path.abspath("./data")
if not os.path.exists(data_dir):
    try:
        os.makedirs(data_dir, exist_ok=True)
        os.chmod(data_dir, 0o777)  # Dar permissões totais ao diretório
        logger.info(f"Diretório de dados criado: {data_dir}")
    except Exception as e:
        logger.error(f"ERRO: Não foi possível criar o diretório de dados: {e}")
        sys.exit(1)
else:
    logger.info(f"Diretório de dados encontrado: {data_dir}")

# URL de conexão com o banco de dados
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/app.db")
db_path = os.path.join(data_dir, "app.db")
logger.info(f"Caminho completo do banco de dados: {db_path}")
logger.info(f"URL de conexão com o banco de dados: {DATABASE_URL}")

# Verificar se o diretório tem permissões de escrita
try:
    test_file = os.path.join(data_dir, "test_write.txt")
    with open(test_file, "w") as f:
        f.write("Teste de escrita")
    os.remove(test_file)
    logger.info(f"Teste de escrita no diretório de dados bem-sucedido: {data_dir}")
except Exception as e:
    logger.error(f"ERRO: O diretório de dados não tem permissão de escrita: {e}")
    sys.exit(1)

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