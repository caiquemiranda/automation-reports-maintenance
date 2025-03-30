from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import sys
import logging
import sqlite3
import shutil
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
    # Verificar permissões
    try:
        # Garantir permissões no diretório existente
        os.chmod(data_dir, 0o777)
        logger.info(f"Permissões atualizadas no diretório: {data_dir}")
    except Exception as e:
        logger.error(f"ERRO ao atualizar permissões: {e}")

# Caminho para o banco de dados
db_path = os.path.join(data_dir, "app.db")
logger.info(f"Caminho completo do banco de dados: {db_path}")

# Backup do banco de dados atual se existir
if os.path.exists(db_path):
    try:
        backup_path = f"{db_path}.bak"
        shutil.copy2(db_path, backup_path)
        logger.info(f"Backup do banco de dados criado: {backup_path}")
    except Exception as e:
        logger.error(f"ERRO ao criar backup: {e}")

# Verificar se o arquivo do banco de dados existe e garantir permissões
if os.path.exists(db_path):
    try:
        # Garantir permissões de escrita
        os.chmod(db_path, 0o666)
        logger.info(f"Permissões de banco de dados atualizadas: {db_path}")
        
        # Verificar se o banco pode ser acessado
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("PRAGMA integrity_check")
        logger.info(f"Banco de dados íntegro: {db_path}")
        conn.close()
    except Exception as e:
        logger.error(f"ERRO ao configurar permissões do banco de dados: {e}")
else:
    logger.info(f"O banco de dados será criado em: {db_path}")
    # Criar um banco de dados vazio com permissões corretas
    try:
        conn = sqlite3.connect(db_path)
        conn.close()
        os.chmod(db_path, 0o666)
        logger.info(f"Banco de dados vazio criado: {db_path}")
    except Exception as e:
        logger.error(f"ERRO ao criar banco de dados vazio: {e}")

# URL de conexão com o banco de dados - Usar URI para poder definir opções avançadas
# Modo rwc (read-write-create): abre para leitura e escrita, cria se não existir
db_uri = f"sqlite:///{db_path}?mode=rwc&uri=true"
logger.info(f"URL de conexão com o banco de dados: {db_uri}")

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

# Usar a opção URI=True para SQLite
engine = create_engine(
    db_uri, 
    connect_args={"check_same_thread": False}
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