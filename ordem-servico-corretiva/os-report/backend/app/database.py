from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import sys
import logging
import sqlite3
import shutil
import json
from dotenv import load_dotenv

# Configurar logging
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=getattr(logging, log_level))
logger = logging.getLogger(__name__)

# Carregar variáveis de ambiente
load_dotenv()

# Definir diretórios importantes
ROOT_DIR = os.path.abspath(".")
DATA_DIR = os.path.join(ROOT_DIR, "data")
UPLOADS_DIR = os.path.join(ROOT_DIR, "uploads")
DB_PATH = os.path.join(DATA_DIR, "app.db")

logger.info(f"Diretório raiz: {ROOT_DIR}")
logger.info(f"Diretório de dados: {DATA_DIR}")
logger.info(f"Diretório de uploads: {UPLOADS_DIR}")
logger.info(f"Caminho do banco de dados: {DB_PATH}")

# Garantir que os diretórios existam
for directory in [DATA_DIR, UPLOADS_DIR]:
    if not os.path.exists(directory):
        try:
            os.makedirs(directory, exist_ok=True)
            os.chmod(directory, 0o777)  # Dar permissões totais
            logger.info(f"Diretório criado: {directory}")
        except Exception as e:
            logger.error(f"ERRO: Não foi possível criar o diretório {directory}: {e}")
            sys.exit(1)
    else:
        try:
            # Garantir permissões adequadas
            os.chmod(directory, 0o777)
            logger.info(f"Permissões atualizadas no diretório: {directory}")
        except Exception as e:
            logger.error(f"ERRO ao atualizar permissões de {directory}: {e}")

# Backup do banco de dados atual se existir
if os.path.exists(DB_PATH):
    try:
        backup_path = f"{DB_PATH}.bak"
        shutil.copy2(DB_PATH, backup_path)
        logger.info(f"Backup do banco de dados criado: {backup_path}")
        
        # Testar leitura do banco
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Verificar integridade
            cursor.execute("PRAGMA integrity_check")
            result = cursor.fetchone()
            logger.info(f"Verificação de integridade: {result[0]}")
            
            # Listar tabelas
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [row[0] for row in cursor.fetchall()]
            logger.info(f"Tabelas encontradas: {tables}")
            
            # Contar registros em cada tabela
            for table in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                logger.info(f"Tabela '{table}': {count} registros")
                
                # Mostrar amostra dos primeiros registros
                if count > 0 and table == 'documentos':
                    cursor.execute(f"SELECT id, osNumber, nomeEquipamento FROM {table} LIMIT 3")
                    rows = cursor.fetchall()
                    for row in rows:
                        logger.info(f"Documento: {row}")
                        
            conn.close()
        except Exception as e:
            logger.error(f"Erro ao testar banco existente: {e}")
    except Exception as e:
        logger.error(f"ERRO ao criar backup: {e}")
else:
    logger.info(f"Banco de dados não encontrado, será criado: {DB_PATH}")
    try:
        # Garantir que o diretório pai exista
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        
        # Criar banco vazio
        conn = sqlite3.connect(DB_PATH)
        conn.close()
        
        # Definir permissões
        os.chmod(DB_PATH, 0o666)
        logger.info(f"Banco de dados vazio criado: {DB_PATH}")
    except Exception as e:
        logger.error(f"ERRO ao criar banco de dados vazio: {e}")

# URL de conexão com o banco de dados - Usar URI para poder definir opções avançadas
# Modo rwc (read-write-create): abre para leitura e escrita, cria se não existir
db_uri = f"sqlite:///{DB_PATH}?mode=rwc&cache=shared&uri=true"
logger.info(f"URL de conexão com o banco de dados: {db_uri}")

# Verificar se o diretório tem permissões de escrita
try:
    test_file = os.path.join(DATA_DIR, "test_write.txt")
    with open(test_file, "w") as f:
        f.write("Teste de escrita")
    os.remove(test_file)
    logger.info(f"Teste de escrita bem-sucedido: {DATA_DIR}")
except Exception as e:
    logger.error(f"ERRO: O diretório não tem permissão de escrita: {e}")
    sys.exit(1)

# Criar engine do SQLAlchemy
engine = create_engine(
    db_uri, 
    connect_args={"check_same_thread": False}
)

# Configuração adicional para assegurar que as transações serão salvas
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")  # Modo Write-Ahead Log para maior confiabilidade
    cursor.execute("PRAGMA synchronous=NORMAL")  # Balanceia performance e confiabilidade
    cursor.execute("PRAGMA foreign_keys=ON")  # Ativa restrições de chave estrangeira
    cursor.close()

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