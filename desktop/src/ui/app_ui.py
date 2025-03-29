import flet as ft
from typing import List, Dict, Any, Optional, Callable
import json
from datetime import datetime

from ..models.report import MaintenanceReport, Part
from ..services.report_service import ReportService
from ..utils.helpers import get_current_date, safe_execute
from .dialogs import DialogHelper
from .sections import (
    GeneralInfoSection, 
    ServiceDescriptionSection, 
    PartsSection, 
    ObservationsSection,
    ActionsSection
)

class MaintenanceReportApp:
    """Classe principal da interface do aplicativo de relatórios de manutenção."""
    
    def __init__(self, page: ft.Page):
        """
        Inicializa a aplicação.
        
        Args:
            page: Página Flet
        """
        self.page = page
        self._configure_page()
        
        # Campos do formulário
        self.equipment = ft.TextField(label="Equipamento", width=400)
        self.date = ft.TextField(label="Data", value=get_current_date(), width=200)
        self.technician = ft.TextField(label="Técnico", width=400)
        self.service_description = ft.TextField(
            label="Descrição do Serviço", 
            multiline=True, 
            min_lines=4, 
            max_lines=8, 
            width=800
        )
        self.observations = ft.TextField(
            label="Observações Adicionais", 
            multiline=True, 
            min_lines=3, 
            max_lines=5, 
            width=800
        )
        
        # Campos para peças
        self.part_name = ft.TextField(label="Nome da Peça", width=300)
        self.part_quantity = ft.TextField(label="Quantidade", width=100, value="1")
        self.part_notes = ft.TextField(label="Observações", width=300)
        
        # Lista de peças
        self.parts = []
        self.parts_data_table = self._create_parts_table()
        
        # Serviço de relatórios
        self.report_service = ReportService()
        
        # Construir a interface
        self._build_ui()
    
    def _configure_page(self) -> None:
        """Configura as propriedades da página."""
        self.page.title = "Sistema de Relatórios de Manutenção - Desktop"
        self.page.theme_mode = ft.ThemeMode.LIGHT
        self.page.padding = 20
        self.page.window_width = 900
        self.page.window_height = 700
    
    def _create_parts_table(self) -> ft.DataTable:
        """
        Cria a tabela de peças.
        
        Returns:
            Tabela de peças
        """
        return ft.DataTable(
            columns=[
                ft.DataColumn(ft.Text("Nome")),
                ft.DataColumn(ft.Text("Quantidade")),
                ft.DataColumn(ft.Text("Observações")),
                ft.DataColumn(ft.Text("Ações"))
            ],
            width=800
        )
    
    def _build_ui(self) -> None:
        """Constrói a interface do usuário."""
        # Título
        title = ft.Text("Relatório de Manutenção", size=24, weight=ft.FontWeight.BOLD)
        
        # Seções do formulário
        general_info_section = GeneralInfoSection.create(
            self.equipment, self.date, self.technician
        )
        
        service_description_section = ServiceDescriptionSection.create(
            self.service_description
        )
        
        parts_section = PartsSection.create(
            self.part_name, 
            self.part_quantity, 
            self.part_notes, 
            self.parts_data_table, 
            self.add_part
        )
        
        observations_section = ObservationsSection.create(
            self.observations
        )
        
        actions_section = ActionsSection.create(
            self.clear_form, 
            self.generate_report
        )
        
        # Adicionar elementos à página
        self.page.add(
            title,
            ft.Divider(),
            general_info_section,
            ft.Container(height=10),
            service_description_section,
            ft.Container(height=10),
            parts_section,
            ft.Container(height=10),
            observations_section,
            ft.Container(height=10),
            actions_section
        )
    
    def _get_current_report(self) -> MaintenanceReport:
        """
        Obtém o relatório atual com base nos dados do formulário.
        
        Returns:
            Relatório de manutenção
        """
        parts_list = [Part(**part) for part in self.parts]
        
        return MaintenanceReport(
            equipment=self.equipment.value.strip(),
            date=self.date.value.strip(),
            technician=self.technician.value.strip(),
            service_description=self.service_description.value.strip(),
            parts_used=parts_list,
            observations=self.observations.value.strip()
        )
    
    def add_part(self, e) -> None:
        """
        Adiciona uma peça ao relatório.
        
        Args:
            e: Evento do Flet
        """
        try:
            name = self.part_name.value.strip()
            quantity_str = self.part_quantity.value.strip()
            notes = self.part_notes.value.strip()
            
            if not name:
                DialogHelper.show_error_dialog(self.page, "Digite o nome da peça")
                return
            
            try:
                quantity = int(quantity_str)
                if quantity <= 0:
                    DialogHelper.show_error_dialog(self.page, "Quantidade deve ser maior que zero")
                    return
            except ValueError:
                DialogHelper.show_error_dialog(self.page, "Quantidade deve ser um número inteiro")
                return
            
            # Adicionar à lista
            part = {"name": name, "quantity": quantity, "notes": notes}
            self.parts.append(part)
            
            # Adicionar à tabela
            self.parts_data_table.rows.append(
                ft.DataRow(
                    cells=[
                        ft.DataCell(ft.Text(name)),
                        ft.DataCell(ft.Text(str(quantity))),
                        ft.DataCell(ft.Text(notes)),
                        ft.DataCell(
                            ft.IconButton(
                                icon=ft.icons.DELETE,
                                icon_color=ft.colors.RED_500,
                                tooltip="Remover",
                                data=len(self.parts) - 1,
                                on_click=self.remove_part
                            )
                        )
                    ]
                )
            )
            
            # Limpar campos
            self.part_name.value = ""
            self.part_quantity.value = "1"
            self.part_notes.value = ""
            self.page.update()
            
        except Exception as e:
            DialogHelper.show_error_dialog(self.page, f"Ocorreu um erro: {str(e)}")
    
    def remove_part(self, e) -> None:
        """
        Remove uma peça do relatório.
        
        Args:
            e: Evento do Flet
        """
        idx = e.control.data
        if 0 <= idx < len(self.parts):
            self.parts.pop(idx)
            self.parts_data_table.rows.pop(idx)
            
            # Atualizar índices dos botões de remoção
            for i, row in enumerate(self.parts_data_table.rows):
                row.cells[-1].content.data = i
            
            self.page.update()
    
    def clear_form(self, e=None) -> None:
        """
        Limpa o formulário.
        
        Args:
            e: Evento do Flet (opcional)
        """
        self.equipment.value = ""
        self.date.value = get_current_date()
        self.technician.value = ""
        self.service_description.value = ""
        self.observations.value = ""
        
        # Limpar lista de peças
        self.parts = []
        self.parts_data_table.rows.clear()
        
        self.page.update()
    
    def generate_report(self, e) -> None:
        """
        Gera um relatório com base nos dados do formulário.
        
        Args:
            e: Evento do Flet
        """
        report = self._get_current_report()
        
        # Validar o relatório
        is_valid, error_msg = ReportService.validate_report(report)
        if not is_valid:
            DialogHelper.show_error_dialog(self.page, error_msg)
            return
        
        # Pedir ao usuário onde salvar o arquivo
        def pick_files_result(e: ft.FilePickerResultEvent) -> None:
            if e.path:
                file_path = e.path
                try:
                    # Salvar como JSON
                    ReportService.save_report_to_file(report, file_path)
                    
                    # Mostrar mensagem de sucesso
                    DialogHelper.show_success_dialog(
                        self.page, 
                        f"Relatório salvo em {file_path}", 
                        on_close=lambda e: self._ask_to_open_file(file_path)
                    )
                    
                except Exception as ex:
                    DialogHelper.show_error_dialog(
                        self.page, 
                        f"Ocorreu um erro ao salvar o arquivo: {str(ex)}"
                    )
        
        # Criar e exibir o picker de arquivos
        save_file_dialog = ft.FilePicker(on_result=pick_files_result)
        self.page.overlay.append(save_file_dialog)
        self.page.update()
        
        # Configurar e abrir o diálogo
        save_file_dialog.save_file(
            allowed_extensions=["json"],
            file_name=f"relatorio_{report.equipment}_{report.date}.json"
        )
    
    def _ask_to_open_file(self, file_path: str) -> None:
        """
        Pergunta ao usuário se deseja abrir o arquivo salvo.
        
        Args:
            file_path: Caminho do arquivo
        """
        DialogHelper.show_confirmation_dialog(
            self.page,
            "Abrir Arquivo",
            "Deseja abrir o arquivo salvo?",
            on_confirm=lambda e: self._open_file(file_path),
            confirm_text="Sim",
            cancel_text="Não"
        )
    
    def _open_file(self, file_path: str) -> None:
        """
        Abre um arquivo com o aplicativo padrão do sistema.
        
        Args:
            file_path: Caminho do arquivo
        """
        try:
            ReportService.open_file(file_path)
        except Exception as e:
            DialogHelper.show_error_dialog(
                self.page, 
                f"Não foi possível abrir o arquivo: {str(e)}"
            ) 