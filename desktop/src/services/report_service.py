import json
import os
import subprocess
from typing import Dict, Any, Optional
import requests
from ..models.report import MaintenanceReport

class ReportService:
    """Serviço para gerenciamento de relatórios de manutenção."""
    
    API_URL = "http://localhost:5000/api"
    
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