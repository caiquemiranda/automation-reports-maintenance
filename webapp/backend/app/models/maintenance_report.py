from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from ..database import Base

# SQLAlchemy Models
class PartDB(Base):
    """Modelo SQLAlchemy para peças utilizadas."""
    __tablename__ = "parts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    quantity = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)
    report_id = Column(Integer, ForeignKey("reports.id", ondelete="CASCADE"))
    
    # Relacionamento
    report = relationship("MaintenanceReportDB", back_populates="parts_used")

class MaintenanceReportDB(Base):
    """Modelo SQLAlchemy para relatórios de manutenção."""
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    equipment = Column(String(255), nullable=False)
    date = Column(String(10), nullable=False)
    technician = Column(String(255), nullable=False)
    service_description = Column(Text, nullable=False)
    observations = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Relacionamentos
    parts_used = relationship("PartDB", back_populates="report", cascade="all, delete-orphan")

# Pydantic Models for API
class Part(BaseModel):
    """Modelo Pydantic para peças utilizadas."""
    name: str
    quantity: int
    notes: Optional[str] = None
    
    class Config:
        orm_mode = True

class MaintenanceReportBase(BaseModel):
    """Modelo base para relatório de manutenção."""
    equipment: str
    date: str
    technician: str
    service_description: str
    observations: Optional[str] = None

class MaintenanceReportCreate(MaintenanceReportBase):
    """Modelo para criação de relatório de manutenção."""
    parts_used: List[Part]

class MaintenanceReportResponse(MaintenanceReportBase):
    """Modelo para resposta de relatório de manutenção."""
    id: int
    parts_used: List[Part]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

# Modelo completo para compatibilidade
class MaintenanceReport(MaintenanceReportBase):
    """Modelo completo para compatibilidade com código existente."""
    parts_used: List[Part] = []
    
    class Config:
        orm_mode = True 