from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime

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

@dataclass
class MaintenanceReport:
    """Classe que representa um relatório de manutenção."""
    equipment: str
    date: str
    technician: str
    service_description: str
    parts_used: List[Part] = field(default_factory=list)
    observations: str = ""
    
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
        return {
            "equipment": self.equipment,
            "date": self.date,
            "technician": self.technician,
            "service_description": self.service_description,
            "parts_used": [part.to_dict() for part in self.parts_used],
            "observations": self.observations
        }
    
    @classmethod
    def from_dict(cls, data):
        """Cria um objeto MaintenanceReport a partir de um dicionário."""
        parts = [Part.from_dict(part) for part in data.get("parts_used", [])]
        return cls(
            equipment=data.get("equipment", ""),
            date=data.get("date", datetime.now().strftime("%Y-%m-%d")),
            technician=data.get("technician", ""),
            service_description=data.get("service_description", ""),
            parts_used=parts,
            observations=data.get("observations", "")
        ) 