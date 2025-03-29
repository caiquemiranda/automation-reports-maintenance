from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class Part(BaseModel):
    name: str
    quantity: int
    notes: Optional[str] = None

class MaintenanceReport(BaseModel):
    equipment: str
    date: str
    technician: str
    service_description: str
    parts_used: List[Part]
    observations: Optional[str] = None 