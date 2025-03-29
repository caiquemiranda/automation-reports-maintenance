import json
import os
import subprocess
from typing import Dict, Any, Optional, List
import requests
from ..models.report import MaintenanceReport, Part
from ..repositories import ReportRepository
from ..database import get_db
from datetime import datetime

class ReportService:
    """Serviço para gerenciar relatórios de manutenção."""
    
    API_URL = "http://localhost:5000/api"
    
    @staticmethod
    def get_all_reports() -> List[MaintenanceReport]:
        """
        Obtém todos os relatórios cadastrados.
        
        Returns:
            Lista de relatórios
        """
        with get_db() as db:
            return ReportRepository.get_reports(db)
    
    @staticmethod
    def get_report_by_id(report_id: int) -> Optional[MaintenanceReport]:
        """
        Obtém um relatório pelo ID.
        
        Args:
            report_id: ID do relatório
            
        Returns:
            Relatório encontrado ou None
        """
        with get_db() as db:
            return ReportRepository.get_report(db, report_id)
    
    @staticmethod
    def create_report(report: MaintenanceReport) -> MaintenanceReport:
        """
        Cria um novo relatório.
        
        Args:
            report: Dados do relatório
            
        Returns:
            Relatório criado
        """
        # Validar data
        if not report.date:
            report.date = datetime.now().date()
            
        with get_db() as db:
            return ReportRepository.create_report(db, report)
    
    @staticmethod
    def update_report(report_id: int, report: MaintenanceReport) -> Optional[MaintenanceReport]:
        """
        Atualiza um relatório existente.
        
        Args:
            report_id: ID do relatório
            report: Novos dados do relatório
            
        Returns:
            Relatório atualizado ou None se não encontrado
        """
        with get_db() as db:
            return ReportRepository.update_report(db, report_id, report)
    
    @staticmethod
    def delete_report(report_id: int) -> bool:
        """
        Exclui um relatório.
        
        Args:
            report_id: ID do relatório
            
        Returns:
            True se o relatório foi excluído, False caso contrário
        """
        with get_db() as db:
            return ReportRepository.delete_report(db, report_id)
    
    @staticmethod
    def search_reports(term: str) -> List[MaintenanceReport]:
        """
        Pesquisa relatórios por termo.
        
        Args:
            term: Termo de pesquisa (equipamento, técnico, etc.)
            
        Returns:
            Lista de relatórios que correspondem ao termo
        """
        term = term.lower()
        all_reports = ReportService.get_all_reports()
        
        return [
            report for report in all_reports 
            if term in report.equipment.lower() or
               term in report.technician.lower() or
               term in report.service_description.lower() or
               (report.observations and term in report.observations.lower())
        ]
    
    @staticmethod
    def filter_reports_by_date(start_date: datetime, end_date: datetime) -> List[MaintenanceReport]:
        """
        Filtra relatórios por intervalo de data.
        
        Args:
            start_date: Data inicial
            end_date: Data final
            
        Returns:
            Lista de relatórios dentro do intervalo de data
        """
        all_reports = ReportService.get_all_reports()
        
        return [
            report for report in all_reports 
            if start_date.date() <= report.date <= end_date.date()
        ]
    
    @staticmethod
    def validate_report(report: MaintenanceReport) -> tuple[bool, Optional[str]]:
        """
        Valida um relatório de manutenção.
        
        Args:
            report: O relatório a ser validado
            
        Returns:
            Tupla (é_válido, mensagem_erro)
        """
        if not report.equipment:
            return False, "Digite o nome do equipamento"
        
        if not report.date:
            return False, "Digite a data"
        
        if not report.technician:
            return False, "Digite o nome do técnico"
        
        if not report.service_description:
            return False, "Digite a descrição do serviço"
        
        if not report.parts_used:
            return False, "Adicione pelo menos uma peça"
        
        return True, None
    
    @staticmethod
    def save_report_to_file(report: MaintenanceReport, file_path: str) -> None:
        """
        Salva um relatório em um arquivo JSON.
        
        Args:
            report: O relatório a ser salvo
            file_path: Caminho do arquivo
            
        Raises:
            IOError: Se houver erro ao salvar o arquivo
        """
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(report.to_dict(), f, ensure_ascii=False, indent=4)
        except Exception as e:
            raise IOError(f"Erro ao salvar o arquivo: {str(e)}")
    
    @staticmethod
    def load_report_from_file(file_path: str) -> MaintenanceReport:
        """
        Carrega um relatório de um arquivo JSON.
        
        Args:
            file_path: Caminho do arquivo
            
        Returns:
            O relatório carregado
            
        Raises:
            IOError: Se houver erro ao carregar o arquivo
        """
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            return MaintenanceReport.from_dict(data)
        except Exception as e:
            raise IOError(f"Erro ao carregar o arquivo: {str(e)}")
    
    @staticmethod
    def open_file(file_path: str) -> None:
        """
        Abre um arquivo com o aplicativo padrão do sistema.
        
        Args:
            file_path: Caminho do arquivo
            
        Raises:
            IOError: Se houver erro ao abrir o arquivo
        """
        try:
            if os.name == "nt":  # Windows
                os.startfile(file_path)
            else:  # Unix/Linux/Mac
                subprocess.call(["xdg-open", file_path])
        except Exception as e:
            raise IOError(f"Erro ao abrir o arquivo: {str(e)}")
    
    @classmethod
    def generate_report_doc(cls, report: MaintenanceReport) -> bytes:
        """
        Gera um documento Word a partir de um relatório utilizando a API.
        
        Args:
            report: O relatório para gerar o documento
            
        Returns:
            Os bytes do documento Word
            
        Raises:
            ConnectionError: Se houver erro na comunicação com a API
            Exception: Outros erros durante a geração do documento
        """
        try:
            response = requests.post(
                f"{cls.API_URL}/generate-report", 
                json=report.to_dict(),
                timeout=30,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code != 200:
                error_msg = response.json().get("error", "Erro desconhecido")
                raise Exception(f"Erro na API: {error_msg}")
            
            return response.content
        except requests.RequestException as e:
            raise ConnectionError(f"Erro de conexão com a API: {str(e)}")
        except Exception as e:
            raise Exception(f"Erro ao gerar documento: {str(e)}")
    
    @staticmethod
    def sync_with_api() -> bool:
        """
        Sincroniza os relatórios locais com a API web.
        
        Returns:
            True se a sincronização foi bem-sucedida, False caso contrário
        """
        try:
            # Obter relatórios locais
            local_reports = ReportService.get_all_reports()
            
            # Enviar para a API
            for report in local_reports:
                try:
                    # Tentar enviar o relatório para a API
                    response = requests.post(
                        f"{ReportService.API_URL}/reports",
                        json=report.to_dict()
                    )
                    response.raise_for_status()
                except requests.RequestException as e:
                    print(f"Erro ao sincronizar relatório {report.id}: {str(e)}")
            
            return True
        except Exception as e:
            print(f"Erro na sincronização: {str(e)}")
            return False
    
    @staticmethod
    def export_to_pdf(report_id: int, output_path: str) -> bool:
        """
        Exporta um relatório para PDF.
        
        Args:
            report_id: ID do relatório
            output_path: Caminho de saída do PDF
            
        Returns:
            True se a exportação foi bem-sucedida, False caso contrário
        """
        try:
            report = ReportService.get_report_by_id(report_id)
            if not report:
                return False
                
            # TODO: Implementar a geração de PDF com uma biblioteca adequada
            # Por enquanto, apenas simula a exportação
            with open(output_path, "w") as f:
                f.write(f"Relatório de Manutenção #{report.id}\n")
                f.write(f"Equipamento: {report.equipment}\n")
                f.write(f"Data: {report.date}\n")
                f.write(f"Técnico: {report.technician}\n")
                f.write(f"Descrição do Serviço: {report.service_description}\n")
                if report.observations:
                    f.write(f"Observações: {report.observations}\n")
                f.write("\nPeças Utilizadas:\n")
                for part in report.parts_used:
                    f.write(f"- {part.name}: {part.quantity} unidade(s)")
                    if part.notes:
                        f.write(f" ({part.notes})")
                    f.write("\n")
            
            return True
        except Exception as e:
            print(f"Erro ao exportar para PDF: {str(e)}")
            return False
    
    @staticmethod
    def import_from_api() -> bool:
        """
        Importa relatórios da API web.
        
        Returns:
            True se a importação foi bem-sucedida, False caso contrário
        """
        try:
            # Obter relatórios da API
            response = requests.get(f"{ReportService.API_URL}/reports")
            response.raise_for_status()
            api_reports = response.json()
            
            # Salvar localmente
            with get_db() as db:
                for report_data in api_reports:
                    # Converter para modelo de domínio
                    report = MaintenanceReport.from_dict(report_data)
                    
                    # Verificar se já existe localmente
                    existing_report = ReportRepository.get_report(db, report.id) if report.id else None
                    
                    if existing_report:
                        # Atualizar existente
                        ReportRepository.update_report(db, existing_report.id, report)
                    else:
                        # Criar novo
                        ReportRepository.create_report(db, report)
            
            return True
        except requests.RequestException as e:
            print(f"Erro ao comunicar com a API: {str(e)}")
            return False
        except Exception as e:
            print(f"Erro na importação: {str(e)}")
            return False 