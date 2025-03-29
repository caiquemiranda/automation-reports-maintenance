from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from typing import List
import os

from ..database import get_db
from ..models.maintenance_report import (
    MaintenanceReport, 
    MaintenanceReportCreate, 
    MaintenanceReportResponse
)
from ..repositories import ReportRepository
from ..services import DocumentService

router = APIRouter()

@router.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    """
    Endpoint para verificar se a API está funcionando.
    """
    return {"status": "online", "service": "maintenance-reports-api"}

@router.post("/reports", response_model=MaintenanceReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(report: MaintenanceReportCreate, db: Session = Depends(get_db)):
    """
    Cria um novo relatório de manutenção.
    """
    # Converter para o modelo compatível
    compat_report = MaintenanceReport(**report.dict())
    
    # Criar no banco de dados
    db_report = ReportRepository.create_report(db, compat_report)
    return db_report

@router.get("/reports", response_model=List[MaintenanceReportResponse])
def get_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Obtém todos os relatórios de manutenção.
    """
    reports = ReportRepository.get_reports(db, skip=skip, limit=limit)
    return reports

@router.get("/reports/{report_id}", response_model=MaintenanceReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    """
    Obtém um relatório de manutenção pelo ID.
    """
    db_report = ReportRepository.get_report(db, report_id)
    if db_report is None:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return db_report

@router.delete("/reports/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(report_id: int, db: Session = Depends(get_db)):
    """
    Exclui um relatório de manutenção pelo ID.
    """
    success = ReportRepository.delete_report(db, report_id)
    if not success:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.put("/reports/{report_id}", response_model=MaintenanceReportResponse)
def update_report(report_id: int, report: MaintenanceReportCreate, db: Session = Depends(get_db)):
    """
    Atualiza um relatório de manutenção.
    """
    # Converter para o modelo compatível
    compat_report = MaintenanceReport(**report.dict())
    
    # Atualizar no banco de dados
    db_report = ReportRepository.update_report(db, report_id, compat_report)
    if db_report is None:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return db_report

@router.post("/generate-report")
def generate_report(report: MaintenanceReportCreate, db: Session = Depends(get_db)):
    """
    Endpoint para gerar um relatório de manutenção em formato Word.
    
    Espera um JSON com os dados do relatório no corpo da requisição.
    Retorna um arquivo Word gerado a partir dos dados do relatório.
    """
    temp_filename = None
    try:
        # Converter para o modelo compatível
        compat_report = MaintenanceReport(**report.dict())
        
        # Gerar documento usando o serviço
        temp_filename = DocumentService.generate_report_document(compat_report)
        
        # Enviar o arquivo para o cliente
        filename = f'relatorio_{report.equipment}_{report.date}.docx'
        
        # Salvar no banco se configurado para isso
        try:
            ReportRepository.create_report(db, compat_report)
        except Exception:
            # Ignorar erros ao salvar no banco, priorizar o download do documento
            pass
        
        # Ler o arquivo para a resposta
        with open(temp_filename, "rb") as f:
            content = f.read()
        
        # Limpar arquivo temporário
        DocumentService.cleanup_temp_file(temp_filename)
        
        # Configurar a resposta
        headers = {
            'Content-Disposition': f'attachment; filename="{filename}"',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
        
        return Response(
            content=content,
            headers=headers
        )
        
    except Exception as e:
        if temp_filename:
            DocumentService.cleanup_temp_file(temp_filename)
        raise HTTPException(status_code=400, detail=str(e)) 