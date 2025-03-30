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

# Tentar importar SQLModel, mas ter um fallback se não estiver disponível
try:
    from sqlmodel import SQLModel, Session
    SQLMODEL_AVAILABLE = True
    logger.info("SQLModel está disponível e será usado")
except ImportError:
    SQLMODEL_AVAILABLE = False
    logger.warning("SQLModel não está disponível, usando SQLAlchemy diretamente")
    from sqlalchemy.orm import Session

# Carregar variáveis de ambiente
load_dotenv()

# Definir diretórios importantes
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
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

# String de conexão corrigida (sem usar parâmetros URI na string)
db_uri = f"sqlite:///{DB_PATH}"
logger.info(f"URI do banco de dados: {db_uri}")
logger.info(f"Caminho do banco de dados: {DB_PATH}")

# Verifica permissões do diretório de dados
try:
    os.chmod(DATA_DIR, 0o777)
    logger.info(f"Permissões do diretório de dados atualizadas: {DATA_DIR}")
except Exception as e:
    logger.warning(f"Não foi possível atualizar as permissões do diretório de dados: {e}")

# Verificar se o arquivo existe e suas permissões
if os.path.exists(DB_PATH):
    try:
        os.chmod(DB_PATH, 0o666)
        logger.info(f"Permissões do banco de dados atualizadas: {DB_PATH}")
    except Exception as e:
        logger.warning(f"Não foi possível atualizar as permissões do banco de dados: {e}")
else:
    logger.info(f"Arquivo de banco de dados não existe, será criado: {DB_PATH}")

# Instanciar o motor de banco de dados com opções seguras
try:
    # Usando connect_args apenas para SQLite
    connect_args = {"check_same_thread": False}
    engine = create_engine(db_uri, echo=True, connect_args=connect_args)
    logger.info("Motor do banco de dados criado com sucesso")
except Exception as e:
    logger.error(f"Erro ao criar motor do banco de dados: {e}")
    raise

def create_db_and_tables():
    """Cria o banco de dados e as tabelas definidas nos modelos"""
    try:
        logger.info("Criando banco de dados e tabelas")
        
        # Importar os modelos aqui para evitar referência circular
        from . import models
        logger.info(f"Modelos carregados: {dir(models)}")
        
        # Usar SQLModel se disponível, caso contrário usar SQLAlchemy
        if SQLMODEL_AVAILABLE:
            logger.info("Usando SQLModel para criar as tabelas")
            SQLModel.metadata.create_all(engine)
        else:
            logger.info("Usando SQLAlchemy para criar as tabelas")
            models.Base.metadata.create_all(bind=engine)
        
        # Verificação adicional
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("PRAGMA integrity_check")
        integrity = cursor.fetchone()[0]
        logger.info(f"Verificação de integridade após criação: {integrity}")
        
        # Listar tabelas criadas
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        logger.info(f"Tabelas criadas: {', '.join(tables) if tables else 'Nenhuma tabela encontrada'}")
        
        # Fechar conexão
        conn.close()
        
        logger.info("Banco de dados e tabelas criados com sucesso")
        return True
    except Exception as e:
        logger.error(f"Erro ao criar banco de dados e tabelas: {e}")
        raise

def get_session():
    """Retorna uma nova sessão de banco de dados"""
    with Session(engine) as session:
        yield session

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