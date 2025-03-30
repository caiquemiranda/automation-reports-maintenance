from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import json
import os
import shutil
import logging
from datetime import datetime

from .. import schemas, models, crud
from ..database import get_db

# Configuração de logging
logger = logging.getLogger(__name__)

# Configuração de diretórios
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
UPLOADS_DIR = os.path.join(ROOT_DIR, "uploads")
DATA_DIR = os.path.join(ROOT_DIR, "data")

logger.info(f"Diretório raiz: {ROOT_DIR}")
logger.info(f"Diretório de uploads: {UPLOADS_DIR}")
logger.info(f"Diretório de dados: {DATA_DIR}")

# Verificar e criar diretórios se não existirem
for directory in [UPLOADS_DIR, DATA_DIR]:
    if not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)
        os.chmod(directory, 0o777)  # Permissões totais
        logger.info(f"Diretório criado: {directory}")

router = APIRouter(
    prefix="/documentos",
    tags=["documentos"],
    responses={404: {"description": "Documento não encontrado"}}
)

@router.get("/system-info", response_model=Dict[str, Any])
async def system_info():
    """Retorna informações do sistema para diagnóstico."""
    # Informações sobre os diretórios
    dirs_info = {}
    for name, path in [("root", ROOT_DIR), ("uploads", UPLOADS_DIR), ("data", DATA_DIR)]:
        if os.path.exists(path):
            try:
                # Listar conteúdo do diretório
                contents = os.listdir(path)
                # Obter tamanho total do diretório
                size = sum(os.path.getsize(os.path.join(path, f)) for f in contents if os.path.isfile(os.path.join(path, f)))
                # Permissões
                stats = os.stat(path)
                
                dirs_info[name] = {
                    "path": path,
                    "exists": True,
                    "items_count": len(contents),
                    "items": contents[:10],  # Limitar a 10 itens
                    "size_bytes": size,
                    "permissions": oct(stats.st_mode),
                }
            except Exception as e:
                dirs_info[name] = {
                    "path": path,
                    "exists": True,
                    "error": str(e)
                }
        else:
            dirs_info[name] = {
                "path": path,
                "exists": False
            }
    
    # Verificar banco de dados SQLite
    db_path = os.path.join(DATA_DIR, "app.db")
    db_info = {"path": db_path, "exists": os.path.exists(db_path)}
    
    if db_info["exists"]:
        try:
            # Tamanho do arquivo
            db_info["size_bytes"] = os.path.getsize(db_path)
            # Permissões
            stats = os.stat(db_path)
            db_info["permissions"] = oct(stats.st_mode)
            # Testar conexão
            import sqlite3
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            # Verificar tabelas
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [row[0] for row in cursor.fetchall()]
            db_info["tables"] = tables
            # Contar registros
            for table in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                db_info[f"{table}_count"] = cursor.fetchone()[0]
            conn.close()
        except Exception as e:
            db_info["error"] = str(e)
    
    return {
        "timestamp": datetime.now().isoformat(),
        "directories": dirs_info,
        "database": db_info,
        "environment": {
            "python_version": os.sys.version,
            "platform": os.sys.platform,
        }
    }

@router.get("/", response_model=List[schemas.Documento])
def listar_documentos(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """Lista todos os documentos com paginação."""
    documentos = crud.get_documentos(db, skip=skip, limit=limit)
    # Log para diagnóstico
    logger.info(f"Recuperados {len(documentos)} documentos do banco de dados")
    return documentos


@router.get("/{documento_id}", response_model=schemas.Documento)
def obter_documento(documento_id: str, db: Session = Depends(get_db)):
    """Obtém um documento específico pelo ID."""
    db_documento = crud.get_documento(db, documento_id=documento_id)
    if db_documento is None:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    return db_documento


@router.post("/", response_model=schemas.Documento)
def criar_documento(documento: schemas.DocumentoCreate, db: Session = Depends(get_db)):
    """Cria um novo documento."""
    logger.info(f"Tentando criar documento: OS-{documento.osNumber}")
    
    # Verifica se já existe um documento com o mesmo número de OS
    db_documento = crud.get_documento_by_os_number(db, os_number=documento.osNumber)
    if db_documento:
        raise HTTPException(status_code=400, detail=f"Já existe um documento com o número de OS {documento.osNumber}")
    
    # Cria o documento
    try:
        result = crud.criar_documento(db=db, documento=documento)
        logger.info(f"Documento criado com sucesso: ID={result.id}, OS={result.osNumber}")
        return result
    except Exception as e:
        logger.error(f"Erro ao criar documento: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao criar documento: {str(e)}")


@router.put("/{documento_id}", response_model=schemas.Documento)
def atualizar_documento(documento_id: str, documento: schemas.DocumentoUpdate, db: Session = Depends(get_db)):
    """Atualiza um documento existente."""
    logger.info(f"Tentando atualizar documento: ID={documento_id}")
    
    db_documento = crud.atualizar_documento(db, documento_id=documento_id, documento_update=documento)
    if db_documento is None:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
        
    logger.info(f"Documento atualizado com sucesso: ID={documento_id}")
    return db_documento


@router.delete("/{documento_id}", response_model=schemas.Resposta)
def excluir_documento(documento_id: str, db: Session = Depends(get_db)):
    """Exclui um documento e seus anexos."""
    logger.info(f"Tentando excluir documento: ID={documento_id}")
    
    sucesso = crud.excluir_documento(db, documento_id=documento_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
        
    logger.info(f"Documento excluído com sucesso: ID={documento_id}")
    return {"sucesso": True, "mensagem": "Documento excluído com sucesso", "dados": None}


@router.post("/{documento_id}/anexos", response_model=schemas.Anexo)
async def adicionar_anexo(
    documento_id: str, 
    arquivo: UploadFile = File(...), 
    descricao: Optional[str] = Form(None), 
    db: Session = Depends(get_db)
):
    """Adiciona um anexo a um documento existente."""
    logger.info(f"Tentando adicionar anexo: documento={documento_id}, arquivo={arquivo.filename}")
    
    # Verifica se o documento existe
    db_documento = crud.get_documento(db, documento_id=documento_id)
    if db_documento is None:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    
    # Cria diretório específico para o documento se não existir
    documento_dir = os.path.join(UPLOADS_DIR, documento_id)
    if not os.path.exists(documento_dir):
        os.makedirs(documento_dir, exist_ok=True)
        os.chmod(documento_dir, 0o777)  # Permissões totais
        logger.info(f"Diretório de anexos criado: {documento_dir}")
    
    # Define o caminho do arquivo
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    nome_arquivo = f"{timestamp}_{arquivo.filename}"
    caminho_destino = os.path.join(documento_dir, nome_arquivo)
    
    # Salva o arquivo no sistema de arquivos
    try:
        with open(caminho_destino, "wb") as buffer:
            shutil.copyfileobj(arquivo.file, buffer)
        
        # Garantir permissões
        os.chmod(caminho_destino, 0o666)
        logger.info(f"Arquivo salvo: {caminho_destino}")
    except Exception as e:
        logger.error(f"Erro ao salvar arquivo: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao salvar o arquivo: {str(e)}")
    
    # Cria o anexo no banco de dados
    anexo_data = schemas.AnexoCreate(
        nome=arquivo.filename,
        descricao=descricao,
        tipo_conteudo=arquivo.content_type,
        tamanho=os.path.getsize(caminho_destino)
    )
    
    try:
        anexo = crud.criar_anexo(db=db, documento_id=documento_id, anexo=anexo_data, caminho_arquivo=caminho_destino)
        logger.info(f"Anexo criado com sucesso: ID={anexo.id}")
        return anexo
    except Exception as e:
        # Remove o arquivo se houver erro na criação do anexo
        if os.path.exists(caminho_destino):
            os.remove(caminho_destino)
        logger.error(f"Erro ao criar anexo no banco de dados: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao criar anexo: {str(e)}")


@router.get("/{documento_id}/anexos/{anexo_id}/download")
async def baixar_anexo(documento_id: str, anexo_id: str, db: Session = Depends(get_db)):
    """Faz o download de um anexo específico."""
    logger.info(f"Tentando baixar anexo: documento={documento_id}, anexo={anexo_id}")
    
    # Verifica se o documento existe
    db_documento = crud.get_documento(db, documento_id=documento_id)
    if db_documento is None:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    
    # Busca o anexo
    anexo = None
    for a in db_documento.anexos:
        if a.id == anexo_id:
            anexo = a
            break
    
    if anexo is None:
        raise HTTPException(status_code=404, detail="Anexo não encontrado")
    
    if not os.path.exists(anexo.caminho_arquivo):
        logger.error(f"Arquivo não encontrado: {anexo.caminho_arquivo}")
        raise HTTPException(status_code=404, detail="Arquivo físico não encontrado")
    
    return FileResponse(
        path=anexo.caminho_arquivo,
        filename=anexo.nome,
        media_type=anexo.tipo_conteudo
    )


@router.delete("/{documento_id}/anexos/{anexo_id}", response_model=schemas.Resposta)
def excluir_anexo(documento_id: str, anexo_id: str, db: Session = Depends(get_db)):
    """Exclui um anexo específico de um documento."""
    logger.info(f"Tentando excluir anexo: documento={documento_id}, anexo={anexo_id}")
    
    # Verifica se o documento existe
    db_documento = crud.get_documento(db, documento_id=documento_id)
    if db_documento is None:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    
    # Exclui o anexo
    sucesso = crud.excluir_anexo(db, anexo_id=anexo_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Anexo não encontrado")
    
    logger.info(f"Anexo excluído com sucesso: ID={anexo_id}")
    return {"sucesso": True, "mensagem": "Anexo excluído com sucesso", "dados": None}


@router.post("/filtrar", response_model=List[schemas.Documento])
def filtrar_documentos(
    filtro: schemas.DocumentoFiltro,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """Filtra documentos de acordo com os critérios especificados."""
    documentos = crud.filtrar_documentos(db, filtro=filtro, skip=skip, limit=limit)
    return documentos 