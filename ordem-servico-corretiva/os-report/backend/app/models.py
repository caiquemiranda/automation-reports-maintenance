from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from .database import Base

def generate_uuid():
    """Gera um UUID para uso como ID primário."""
    return str(uuid.uuid4())

class Documento(Base):
    """Modelo para armazenar documentos de Ordem de Serviço."""
    __tablename__ = "documentos"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    osNumber = Column(String, index=True)
    manutencaoCorretiva = Column(Boolean, default=True)
    naoProgramados = Column(Boolean, default=False)
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())
    data_atualizacao = Column(DateTime(timezone=True), onupdate=func.now())
    dados = Column(JSON)
    
    # Campos principais extraídos para facilitar busca e filtragem
    codigoManutencao = Column(String, index=True, nullable=True)
    dataSolicitacao = Column(String, nullable=True)
    dataExecucao = Column(String, nullable=True)
    nomeEquipamento = Column(String, nullable=True)
    localizacao = Column(String, nullable=True)
    requisitante = Column(String, nullable=True)
    status = Column(String, default="Finalizado")
    
    # Relacionamentos
    anexos = relationship("Anexo", back_populates="documento", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Documento(id={self.id}, osNumber={self.osNumber})>"


class Anexo(Base):
    """Modelo para armazenar anexos de documentos."""
    __tablename__ = "anexos"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    documento_id = Column(String, ForeignKey("documentos.id"))
    nome = Column(String)
    descricao = Column(String, nullable=True)
    tipo_conteudo = Column(String)
    tamanho = Column(Integer)
    caminho_arquivo = Column(String)
    data_upload = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relacionamentos
    documento = relationship("Documento", back_populates="anexos") 