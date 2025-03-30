from sqlalchemy.orm import Session
from sqlalchemy import desc, or_, and_
from typing import List, Dict, Any, Optional
from datetime import datetime
import os
import uuid

from . import models, schemas


def get_documento(db: Session, documento_id: str):
    """Obtém um documento pelo ID."""
    return db.query(models.Documento).filter(models.Documento.id == documento_id).first()


def get_documento_by_os_number(db: Session, os_number: str):
    """Obtém um documento pelo número da OS."""
    return db.query(models.Documento).filter(models.Documento.osNumber == os_number).first()


def get_documentos(db: Session, skip: int = 0, limit: int = 100):
    """Obtém uma lista de documentos com paginação."""
    return db.query(models.Documento).order_by(desc(models.Documento.data_criacao)).offset(skip).limit(limit).all()


def filtrar_documentos(db: Session, filtro: schemas.DocumentoFiltro, skip: int = 0, limit: int = 100):
    """Filtra documentos de acordo com os critérios informados."""
    query = db.query(models.Documento)
    
    if filtro.osNumber:
        query = query.filter(models.Documento.osNumber.ilike(f"%{filtro.osNumber}%"))
    
    if filtro.codigoManutencao:
        query = query.filter(models.Documento.codigoManutencao.ilike(f"%{filtro.codigoManutencao}%"))
    
    if filtro.nomeEquipamento:
        query = query.filter(models.Documento.nomeEquipamento.ilike(f"%{filtro.nomeEquipamento}%"))
    
    if filtro.requisitante:
        query = query.filter(models.Documento.requisitante.ilike(f"%{filtro.requisitante}%"))
    
    if filtro.status:
        query = query.filter(models.Documento.status == filtro.status)
    
    if filtro.data_inicio and filtro.data_fim:
        query = query.filter(
            and_(
                models.Documento.data_criacao >= filtro.data_inicio,
                models.Documento.data_criacao <= filtro.data_fim
            )
        )
    
    return query.order_by(desc(models.Documento.data_criacao)).offset(skip).limit(limit).all()


def criar_documento(db: Session, documento: schemas.DocumentoCreate):
    """Cria um novo documento no banco de dados."""
    # Extrai dados relevantes para facilitar a busca
    codigoManutencao = None
    dataSolicitacao = None
    dataExecucao = None
    nomeEquipamento = None
    localizacao = None
    requisitante = None
    
    if 'formData' in documento.dados:
        form_data = documento.dados['formData']
        if 'codigoManutencao' in form_data:
            codigoManutencao = form_data['codigoManutencao']
        if 'dataSolicitacao' in form_data:
            dataSolicitacao = form_data['dataSolicitacao']
        if 'dataExecucao' in form_data:
            dataExecucao = form_data['dataExecucao']
        if 'nomeEquipamento' in form_data:
            nomeEquipamento = form_data['nomeEquipamento']
        if 'localizacao' in form_data:
            localizacao = form_data['localizacao']
        if 'requisitante' in form_data:
            requisitante = form_data['requisitante']
    
    # Cria o objeto do documento
    db_documento = models.Documento(
        osNumber=documento.osNumber,
        manutencaoCorretiva=documento.manutencaoCorretiva,
        naoProgramados=documento.naoProgramados,
        dados=documento.dados,
        codigoManutencao=codigoManutencao or documento.codigoManutencao,
        dataSolicitacao=dataSolicitacao or documento.dataSolicitacao,
        dataExecucao=dataExecucao or documento.dataExecucao,
        nomeEquipamento=nomeEquipamento or documento.nomeEquipamento,
        localizacao=localizacao or documento.localizacao,
        requisitante=requisitante or documento.requisitante
    )
    
    db.add(db_documento)
    db.commit()
    db.refresh(db_documento)
    return db_documento


def atualizar_documento(db: Session, documento_id: str, documento_update: schemas.DocumentoUpdate):
    """Atualiza um documento existente."""
    db_documento = get_documento(db, documento_id)
    if not db_documento:
        return None
    
    update_data = documento_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_documento, key, value)
    
    db.commit()
    db.refresh(db_documento)
    return db_documento


def excluir_documento(db: Session, documento_id: str):
    """Exclui um documento do banco de dados."""
    db_documento = get_documento(db, documento_id)
    if not db_documento:
        return False
    
    # Exclui os anexos primeiro
    for anexo in db_documento.anexos:
        # Remove os arquivos físicos associados ao anexo
        if os.path.exists(anexo.caminho_arquivo):
            os.remove(anexo.caminho_arquivo)
        db.delete(anexo)
    
    db.delete(db_documento)
    db.commit()
    return True


def criar_anexo(db: Session, documento_id: str, anexo: schemas.AnexoCreate, caminho_arquivo: str):
    """Cria um novo anexo para um documento."""
    db_anexo = models.Anexo(
        documento_id=documento_id,
        nome=anexo.nome,
        descricao=anexo.descricao,
        tipo_conteudo=anexo.tipo_conteudo,
        tamanho=anexo.tamanho,
        caminho_arquivo=caminho_arquivo
    )
    
    db.add(db_anexo)
    db.commit()
    db.refresh(db_anexo)
    return db_anexo


def excluir_anexo(db: Session, anexo_id: str):
    """Exclui um anexo do banco de dados."""
    db_anexo = db.query(models.Anexo).filter(models.Anexo.id == anexo_id).first()
    if not db_anexo:
        return False
    
    # Remove o arquivo físico
    if os.path.exists(db_anexo.caminho_arquivo):
        os.remove(db_anexo.caminho_arquivo)
    
    db.delete(db_anexo)
    db.commit()
    return True 