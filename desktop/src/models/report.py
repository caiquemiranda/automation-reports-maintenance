from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship

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

# Data Models
@dataclass
class Part:
    """Classe que representa uma peça utilizada no relatório de manutenção."""
    name: str
    quantity: int
    notes: str = ""
    
    def to_dict(self):
        """Converte o objeto para dicionário."""
        return {
            "name": self.name,
            "quantity": self.quantity,
            "notes": self.notes
        }
    
    @classmethod
    def from_dict(cls, data):
        """Cria um objeto Part a partir de um dicionário."""
        return cls(
            name=data.get("name", ""),
            quantity=data.get("quantity", 0),
            notes=data.get("notes", "")
        )
    
    @classmethod
    def from_db(cls, db_part: PartDB):
        """Cria um objeto Part a partir de um objeto PartDB."""
        return cls(
            name=db_part.name,
            quantity=db_part.quantity,
            notes=db_part.notes or ""
        )

@dataclass
class MaintenanceReport:
    """Classe que representa um relatório de manutenção."""
    equipment: str
    date: str
    technician: str
    service_description: str
    parts_used: List[Part] = field(default_factory=list)
    observations: str = ""
    id: Optional[int] = None
    
    def __post_init__(self):
        """Validação após inicialização."""
        if not self.date:
            self.date = datetime.now().strftime("%Y-%m-%d")
    
    def add_part(self, part: Part):
        """Adiciona uma peça ao relatório."""
        self.parts_used.append(part)
    
    def remove_part(self, index: int):
        """Remove uma peça do relatório pelo índice."""
        if 0 <= index < len(self.parts_used):
            self.parts_used.pop(index)
    
    def to_dict(self):
        """Converte o objeto para dicionário."""
        result = {
            "equipment": self.equipment,
            "date": self.date,
            "technician": self.technician,
            "service_description": self.service_description,
            "parts_used": [part.to_dict() for part in self.parts_used],
            "observations": self.observations
        }
        if self.id is not None:
            result["id"] = self.id
        return result
    
    @classmethod
    def from_dict(cls, data):
        """Cria um objeto MaintenanceReport a partir de um dicionário."""
        parts = [Part.from_dict(part) for part in data.get("parts_used", [])]
        return cls(
            id=data.get("id"),
            equipment=data.get("equipment", ""),
            date=data.get("date", datetime.now().strftime("%Y-%m-%d")),
            technician=data.get("technician", ""),
            service_description=data.get("service_description", ""),
            parts_used=parts,
            observations=data.get("observations", "")
        )
    
    @classmethod
    def from_db(cls, db_report: MaintenanceReportDB):
        """Cria um objeto MaintenanceReport a partir de um objeto MaintenanceReportDB."""
        parts = [Part.from_db(part) for part in db_report.parts_used]
        return cls(
            id=db_report.id,
            equipment=db_report.equipment,
            date=db_report.date,
            technician=db_report.technician,
            service_description=db_report.service_description,
            parts_used=parts,
            observations=db_report.observations or ""
        ) 