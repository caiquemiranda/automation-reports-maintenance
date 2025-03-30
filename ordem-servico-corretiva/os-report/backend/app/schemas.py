from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid


class AnexoBase(BaseModel):
    """Esquema base para anexos."""
    nome: str
    descricao: Optional[str] = None
    tipo_conteudo: str
    tamanho: int
    
    class Config:
        orm_mode = True


class AnexoCreate(AnexoBase):
    """Esquema para criação de anexos."""
    # Campos adicionais específicos para criação, se necessário
    pass


class Anexo(AnexoBase):
    """Esquema completo para anexos."""
    id: str
    documento_id: str
    caminho_arquivo: str
    data_upload: datetime
    
    class Config:
        orm_mode = True


class DocumentoBase(BaseModel):
    """Esquema base para documentos."""
    osNumber: str
    manutencaoCorretiva: bool = True
    naoProgramados: bool = False
    
    class Config:
        orm_mode = True


class DocumentoCreate(DocumentoBase):
    """Esquema para criação de documentos."""
    dados: Dict[str, Any]
    codigoManutencao: Optional[str] = None
    dataSolicitacao: Optional[str] = None
    dataExecucao: Optional[str] = None
    nomeEquipamento: Optional[str] = None
    localizacao: Optional[str] = None
    requisitante: Optional[str] = None


class Documento(DocumentoBase):
    """Esquema completo para documentos."""
    id: str
    data_criacao: datetime
    data_atualizacao: Optional[datetime] = None
    dados: Dict[str, Any]
    status: str = "Finalizado"
    codigoManutencao: Optional[str] = None
    dataSolicitacao: Optional[str] = None
    dataExecucao: Optional[str] = None
    nomeEquipamento: Optional[str] = None
    localizacao: Optional[str] = None
    requisitante: Optional[str] = None
    anexos: List[Anexo] = []

    class Config:
        orm_mode = True


class DocumentoFiltro(BaseModel):
    """Esquema para filtrar documentos."""
    osNumber: Optional[str] = None
    codigoManutencao: Optional[str] = None
    nomeEquipamento: Optional[str] = None
    requisitante: Optional[str] = None
    data_inicio: Optional[datetime] = None
    data_fim: Optional[datetime] = None
    status: Optional[str] = None


class DocumentoUpdate(BaseModel):
    """Esquema para atualização parcial de documentos."""
    dados: Optional[Dict[str, Any]] = None
    status: Optional[str] = None
    

class Resposta(BaseModel):
    """Esquema para respostas padronizadas da API."""
    sucesso: bool
    mensagem: str
    dados: Optional[Any] = None 