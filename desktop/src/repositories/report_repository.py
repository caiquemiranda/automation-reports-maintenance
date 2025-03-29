from sqlalchemy.orm import Session
from typing import List, Optional
from ..models.report import MaintenanceReportDB, PartDB, MaintenanceReport, Part

class ReportRepository:
    """Repositório para operações de banco de dados com relatórios de manutenção."""
    
    @staticmethod
    def get_reports(db: Session, skip: int = 0, limit: int = 100) -> List[MaintenanceReport]:
        """
        Obtém todos os relatórios.
        
        Args:
            db: Sessão do banco de dados
            skip: Quantidade de registros para pular
            limit: Limite de registros para retornar
            
        Returns:
            Lista de relatórios
        """
        db_reports = db.query(MaintenanceReportDB).offset(skip).limit(limit).all()
        return [MaintenanceReport.from_db(db_report) for db_report in db_reports]
    
    @staticmethod
    def get_report(db: Session, report_id: int) -> Optional[MaintenanceReport]:
        """
        Obtém um relatório pelo ID.
        
        Args:
            db: Sessão do banco de dados
            report_id: ID do relatório
            
        Returns:
            Relatório encontrado ou None
        """
        db_report = db.query(MaintenanceReportDB).filter(MaintenanceReportDB.id == report_id).first()
        if db_report:
            return MaintenanceReport.from_db(db_report)
        return None
    
    @staticmethod
    def create_report(db: Session, report: MaintenanceReport) -> MaintenanceReport:
        """
        Cria um novo relatório.
        
        Args:
            db: Sessão do banco de dados
            report: Dados do relatório
            
        Returns:
            Relatório criado
        """
        # Criar o relatório
        db_report = MaintenanceReportDB(
            equipment=report.equipment,
            date=report.date,
            technician=report.technician,
            service_description=report.service_description,
            observations=report.observations
        )
        
        # Adicionar ao banco e obter ID
        db.add(db_report)
        db.flush()
        
        # Adicionar peças
        for part in report.parts_used:
            db_part = PartDB(
                name=part.name,
                quantity=part.quantity,
                notes=part.notes,
                report_id=db_report.id
            )
            db.add(db_part)
        
        # Commit e retornar
        db.commit()
        db.refresh(db_report)
        
        # Converter para o modelo de domínio
        return MaintenanceReport.from_db(db_report)
    
    @staticmethod
    def delete_report(db: Session, report_id: int) -> bool:
        """
        Exclui um relatório pelo ID.
        
        Args:
            db: Sessão do banco de dados
            report_id: ID do relatório
            
        Returns:
            True se o relatório foi excluído, False caso contrário
        """
        report = db.query(MaintenanceReportDB).filter(MaintenanceReportDB.id == report_id).first()
        if report:
            db.delete(report)
            db.commit()
            return True
        return False
    
    @staticmethod
    def update_report(db: Session, report_id: int, report: MaintenanceReport) -> Optional[MaintenanceReport]:
        """
        Atualiza um relatório.
        
        Args:
            db: Sessão do banco de dados
            report_id: ID do relatório
            report: Novos dados do relatório
            
        Returns:
            Relatório atualizado ou None se não encontrado
        """
        db_report = db.query(MaintenanceReportDB).filter(MaintenanceReportDB.id == report_id).first()
        if not db_report:
            return None
        
        # Atualizar campos do relatório
        db_report.equipment = report.equipment
        db_report.date = report.date
        db_report.technician = report.technician
        db_report.service_description = report.service_description
        db_report.observations = report.observations
        
        # Remover peças existentes
        db.query(PartDB).filter(PartDB.report_id == report_id).delete()
        
        # Adicionar novas peças
        for part in report.parts_used:
            db_part = PartDB(
                name=part.name,
                quantity=part.quantity,
                notes=part.notes,
                report_id=db_report.id
            )
            db.add(db_part)
        
        # Commit e retornar
        db.commit()
        db.refresh(db_report)
        
        # Converter para o modelo de domínio
        return MaintenanceReport.from_db(db_report) 