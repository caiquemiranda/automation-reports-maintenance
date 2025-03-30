from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import os
import shutil
from datetime import datetime

from .. import schemas, models, crud
from ..database import get_db

# Configuração de diretórios
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)

router = APIRouter(
    prefix="/documentos",
    tags=["documentos"],
    responses={404: {"description": "Documento não encontrado"}}
)


@router.get("/", response_model=List[schemas.Documento])
def listar_documentos(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """Lista todos os documentos com paginação."""
    documentos = crud.get_documentos(db, skip=skip, limit=limit)
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
    # Verifica se já existe um documento com o mesmo número de OS
    db_documento = crud.get_documento_by_os_number(db, os_number=documento.osNumber)
    if db_documento:
        raise HTTPException(status_code=400, detail="Já existe um documento com este número de OS")
    
    # Cria o documento
    return crud.criar_documento(db=db, documento=documento)


@router.put("/{documento_id}", response_model=schemas.Documento)
def atualizar_documento(documento_id: str, documento: schemas.DocumentoUpdate, db: Session = Depends(get_db)):
    """Atualiza um documento existente."""
    db_documento = crud.atualizar_documento(db, documento_id=documento_id, documento_update=documento)
    if db_documento is None:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    return db_documento


@router.delete("/{documento_id}", response_model=schemas.Resposta)
def excluir_documento(documento_id: str, db: Session = Depends(get_db)):
    """Exclui um documento e seus anexos."""
    sucesso = crud.excluir_documento(db, documento_id=documento_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    return {"sucesso": True, "mensagem": "Documento excluído com sucesso", "dados": None}


@router.post("/{documento_id}/anexos", response_model=schemas.Anexo)
async def adicionar_anexo(
    documento_id: str, 
    arquivo: UploadFile = File(...), 
    descricao: Optional[str] = Form(None), 
    db: Session = Depends(get_db)
):
    """Adiciona um anexo a um documento existente."""
    # Verifica se o documento existe
    db_documento = crud.get_documento(db, documento_id=documento_id)
    if db_documento is None:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    
    # Cria diretório específico para o documento se não existir
    documento_dir = os.path.join(UPLOADS_DIR, documento_id)
    if not os.path.exists(documento_dir):
        os.makedirs(documento_dir)
    
    # Define o caminho do arquivo
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    nome_arquivo = f"{timestamp}_{arquivo.filename}"
    caminho_destino = os.path.join(documento_dir, nome_arquivo)
    
    # Salva o arquivo no sistema de arquivos
    try:
        with open(caminho_destino, "wb") as buffer:
            shutil.copyfileobj(arquivo.file, buffer)
    except Exception as e:
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
        return anexo
    except Exception as e:
        # Remove o arquivo se houver erro na criação do anexo
        if os.path.exists(caminho_destino):
            os.remove(caminho_destino)
        raise HTTPException(status_code=500, detail=f"Erro ao criar anexo: {str(e)}")


@router.delete("/{documento_id}/anexos/{anexo_id}", response_model=schemas.Resposta)
def excluir_anexo(documento_id: str, anexo_id: str, db: Session = Depends(get_db)):
    """Exclui um anexo específico de um documento."""
    # Verifica se o documento existe
    db_documento = crud.get_documento(db, documento_id=documento_id)
    if db_documento is None:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    
    # Exclui o anexo
    sucesso = crud.excluir_anexo(db, anexo_id=anexo_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Anexo não encontrado")
    
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