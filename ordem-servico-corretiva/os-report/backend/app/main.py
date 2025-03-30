from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import logging
import sqlite3
import shutil
from dotenv import load_dotenv

from .routers import documentos
from . import models, crud
from .database import engine, get_db

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Carregar variáveis de ambiente
load_dotenv()

# Verificar se o arquivo do banco de dados existe
db_path = os.path.join(os.path.abspath("./data"), "app.db")
db_dir = os.path.dirname(db_path)

logger.info(f"Diretório do banco de dados: {db_dir}")
logger.info(f"Caminho completo do banco de dados: {db_path}")

# Garantir que o diretório de dados exista e tenha permissões corretas
if not os.path.exists(db_dir):
    try:
        os.makedirs(db_dir, exist_ok=True)
        os.chmod(db_dir, 0o777)  # Permissões totais
        logger.info(f"Diretório de dados criado: {db_dir}")
    except Exception as e:
        logger.error(f"ERRO ao criar diretório de dados: {e}")

# Verificar permissões do diretório
try:
    stats = os.stat(db_dir)
    logger.info(f"Permissões do diretório: {oct(stats.st_mode)}")
except Exception as e:
    logger.error(f"ERRO ao verificar permissões: {e}")

# Verificar se o banco existe
if os.path.exists(db_path):
    logger.info(f"Banco de dados encontrado: {db_path}")
    try:
        # Testar a conexão
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("PRAGMA integrity_check")
        result = cursor.fetchone()
        if result[0] == "ok":
            logger.info("Verificação de integridade do banco de dados: OK")
        else:
            logger.warning(f"Verificação de integridade do banco de dados falhou: {result[0]}")
        
        # Verificar tabelas existentes
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        logger.info(f"Tabelas encontradas: {tables}")
        
        conn.close()
    except Exception as e:
        logger.error(f"Erro ao verificar o banco de dados: {e}")
else:
    logger.info(f"Arquivo de banco de dados não encontrado, será criado: {db_path}")

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
        "documentacao": "/docs",
        "banco_de_dados": db_path
    }

@app.get(f"{api_prefix}/health")
async def health_check(db: Session = Depends(get_db)):
    """Endpoint de verificação de saúde da API e do banco de dados."""
    try:
        # Verificar se consegue executar uma consulta simples no banco de dados
        test_record = crud.get_documentos(db, skip=0, limit=1)
        logger.info("Health check: Conexão com banco de dados OK")
        
        # Verificar o arquivo do banco de dados
        db_exists = os.path.exists(db_path)
        db_size = os.path.getsize(db_path) if db_exists else 0
        
        # Verificar permissões
        permissions = "N/A"
        if db_exists:
            try:
                stats = os.stat(db_path)
                permissions = oct(stats.st_mode)
            except:
                permissions = "Error"
        
        # Verificar se há documentos
        doc_count = len(test_record)
        
        return {
            "status": "ok",
            "message": "API está funcionando corretamente",
            "database": {
                "connected": True,
                "records_found": doc_count,
                "file_exists": db_exists,
                "file_size": db_size,
                "file_path": db_path,
                "file_permissions": permissions,
                "dir_path": db_dir,
                "url": os.getenv("DATABASE_URL", "default")
            }
        }
    except Exception as e:
        logger.error(f"Health check: Erro ao conectar ao banco de dados: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro de conexão com o banco de dados: {str(e)}"
        ) 