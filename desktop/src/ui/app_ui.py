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
        
        # Lista de relatórios
        self.reports_list_view = ft.ListView(expand=1, spacing=10, padding=20)
        
        # Construir a interface
        self._build_ui()
        
        # Carregar relatórios existentes
        self._load_saved_reports()
    
    def _configure_page(self) -> None:
        """Configura as propriedades da página."""
        self.page.title = "Sistema de Relatórios de Manutenção - Desktop"
        self.page.theme_mode = ft.ThemeMode.LIGHT
        self.page.padding = 20
        self.page.window_width = 1000
        self.page.window_height = 750
    
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
        
        # Abas
        tabs = ft.Tabs(
            selected_index=0,
            animation_duration=300,
            tabs=[
                ft.Tab(
                    text="Novo Relatório",
                    content=self._build_new_report_tab()
                ),
                ft.Tab(
                    text="Relatórios Salvos",
                    content=self._build_saved_reports_tab()
                ),
            ],
            expand=True
        )
        
        # Adicionar elementos à página
        self.page.add(
            title,
            ft.Divider(),
            tabs
        )
    
    def _build_new_report_tab(self) -> ft.Container:
        """
        Constrói a aba de novo relatório.
        
        Returns:
            Container com o conteúdo da aba
        """
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
            self.save_report
        )
        
        return ft.Container(
            content=ft.Column([
                general_info_section,
                ft.Container(height=10),
                service_description_section,
                ft.Container(height=10),
                parts_section,
                ft.Container(height=10),
                observations_section,
                ft.Container(height=10),
                actions_section
            ]),
            padding=ft.padding.all(10)
        )
    
    def _build_saved_reports_tab(self) -> ft.Container:
        """
        Constrói a aba de relatórios salvos.
        
        Returns:
            Container com o conteúdo da aba
        """
        # Botões de ação
        actions_row = ft.Row([
            ft.ElevatedButton(
                text="Atualizar Lista",
                icon=ft.icons.REFRESH,
                on_click=self._load_saved_reports
            ),
            ft.ElevatedButton(
                text="Sincronizar com API Web",
                icon=ft.icons.SYNC,
                on_click=self._sync_with_api
            ),
            ft.ElevatedButton(
                text="Importar da API Web",
                icon=ft.icons.DOWNLOAD,
                on_click=self._import_from_api
            )
        ])
        
        # Pesquisa
        search_row = ft.Row([
            ft.TextField(
                label="Pesquisar relatórios",
                width=400,
                prefix_icon=ft.icons.SEARCH,
                on_change=self._search_reports,
                hint_text="Digite equipamento, técnico ou descrição..."
            )
        ])
        
        return ft.Container(
            content=ft.Column([
                actions_row,
                search_row,
                ft.Divider(),
                ft.Text("Relatórios Salvos", size=16, weight=ft.FontWeight.BOLD),
                self.reports_list_view
            ]),
            padding=ft.padding.all(10)
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
    
    def save_report(self, e) -> None:
        """
        Salva o relatório no banco de dados.
        
        Args:
            e: Evento do Flet
        """
        report = self._get_current_report()
        
        # Validar o relatório
        is_valid, error_msg = ReportService.validate_report(report)
        if not is_valid:
            DialogHelper.show_error_dialog(self.page, error_msg)
            return
        
        # Salvar no banco de dados
        try:
            saved_report = ReportService.create_report(report)
            
            # Mostrar mensagem de sucesso
            DialogHelper.show_success_dialog(
                self.page, 
                f"Relatório salvo com sucesso (ID: {saved_report.id})",
                on_close=lambda e: self.clear_form()
            )
            
            # Atualizar lista de relatórios
            self._load_saved_reports()
            
        except Exception as ex:
            DialogHelper.show_error_dialog(
                self.page, 
                f"Ocorreu um erro ao salvar o relatório: {str(ex)}"
            )
    
    def _load_saved_reports(self, e=None) -> None:
        """
        Carrega os relatórios salvos no banco de dados.
        
        Args:
            e: Evento do Flet (opcional)
        """
        try:
            # Obter relatórios
            reports = ReportService.get_all_reports()
            
            # Limpar lista
            self.reports_list_view.controls.clear()
            
            # Adicionar relatórios à lista
            for report in reports:
                self._add_report_to_list(report)
            
            # Atualizar a interface
            self.page.update()
            
        except Exception as ex:
            DialogHelper.show_error_dialog(
                self.page, 
                f"Ocorreu um erro ao carregar os relatórios: {str(ex)}"
            )
    
    def _add_report_to_list(self, report: MaintenanceReport) -> None:
        """
        Adiciona um relatório à lista de relatórios salvos.
        
        Args:
            report: Relatório de manutenção
        """
        card = ft.Card(
            content=ft.Container(
                content=ft.Column([
                    ft.ListTile(
                        leading=ft.Icon(ft.icons.DESCRIPTION),
                        title=ft.Text(f"Equipamento: {report.equipment}"),
                        subtitle=ft.Text(f"Data: {report.date} | Técnico: {report.technician}")
                    ),
                    ft.Row([
                        ft.ElevatedButton(
                            "Visualizar",
                            icon=ft.icons.VISIBILITY,
                            on_click=lambda e, r=report: self._view_report(r)
                        ),
                        ft.OutlinedButton(
                            "Editar",
                            icon=ft.icons.EDIT,
                            on_click=lambda e, r=report: self._edit_report(r)
                        ),
                        ft.OutlinedButton(
                            "Exportar PDF",
                            icon=ft.icons.PICTURE_AS_PDF,
                            on_click=lambda e, r=report: self._export_to_pdf(r)
                        ),
                        ft.OutlinedButton(
                            "Excluir",
                            icon=ft.icons.DELETE,
                            on_click=lambda e, r=report: self._confirm_delete_report(r)
                        )
                    ], alignment=ft.MainAxisAlignment.END)
                ]),
                padding=10
            )
        )
        self.reports_list_view.controls.append(card)
    
    def _view_report(self, report: MaintenanceReport) -> None:
        """
        Exibe os detalhes de um relatório.
        
        Args:
            report: Relatório de manutenção
        """
        # Construir conteúdo dos detalhes
        details = ft.Column([
            ft.Text(f"ID: {report.id}", weight=ft.FontWeight.BOLD),
            ft.Text(f"Equipamento: {report.equipment}"),
            ft.Text(f"Data: {report.date}"),
            ft.Text(f"Técnico: {report.technician}"),
            ft.Divider(),
            ft.Text("Descrição do Serviço:", weight=ft.FontWeight.BOLD),
            ft.Text(report.service_description),
            ft.Divider(),
            ft.Text("Peças Utilizadas:", weight=ft.FontWeight.BOLD)
        ])
        
        # Adicionar peças
        for part in report.parts_used:
            details.controls.append(
                ft.Text(f"- {part.name}: {part.quantity} unidade(s) {part.notes}")
            )
        
        # Adicionar observações, se houver
        if report.observations:
            details.controls.extend([
                ft.Divider(),
                ft.Text("Observações:", weight=ft.FontWeight.BOLD),
                ft.Text(report.observations)
            ])
        
        # Mostrar diálogo
        DialogHelper.show_custom_dialog(
            self.page,
            "Detalhes do Relatório",
            details,
            width=800
        )
    
    def _edit_report(self, report: MaintenanceReport) -> None:
        """
        Carrega um relatório para edição.
        
        Args:
            report: Relatório de manutenção
        """
        # Carregar dados no formulário
        self.equipment.value = report.equipment
        self.date.value = report.date
        self.technician.value = report.technician
        self.service_description.value = report.service_description
        self.observations.value = report.observations
        
        # Limpar e recarregar peças
        self.parts = []
        self.parts_data_table.rows.clear()
        
        for part in report.parts_used:
            part_dict = {"name": part.name, "quantity": part.quantity, "notes": part.notes}
            self.parts.append(part_dict)
            
            self.parts_data_table.rows.append(
                ft.DataRow(
                    cells=[
                        ft.DataCell(ft.Text(part.name)),
                        ft.DataCell(ft.Text(str(part.quantity))),
                        ft.DataCell(ft.Text(part.notes)),
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
        
        # Atualizar a interface e mudar para a aba de edição
        self.page.update()
        
        # Mudar para a primeira aba (novo relatório)
        self.page.controls[2].selected_index = 0
        self.page.update()
        
        # Mostrar botão de atualização
        DialogHelper.show_info_dialog(
            self.page,
            f"Editando relatório com ID {report.id}. Faça as alterações necessárias e salve-o novamente."
        )
    
    def _confirm_delete_report(self, report: MaintenanceReport) -> None:
        """
        Confirma a exclusão de um relatório.
        
        Args:
            report: Relatório de manutenção
        """
        DialogHelper.show_confirmation_dialog(
            self.page,
            "Confirmar Exclusão",
            f"Tem certeza que deseja excluir o relatório do equipamento '{report.equipment}'?",
            on_confirm=lambda e, r=report: self._delete_report(r),
            confirm_text="Excluir",
            cancel_text="Cancelar"
        )
    
    def _delete_report(self, report: MaintenanceReport) -> None:
        """
        Exclui um relatório do banco de dados.
        
        Args:
            report: Relatório de manutenção
        """
        try:
            success = ReportService.delete_report(report.id)
            
            if success:
                DialogHelper.show_success_dialog(
                    self.page,
                    "Relatório excluído com sucesso!",
                    on_close=lambda e: self._load_saved_reports()
                )
            else:
                DialogHelper.show_error_dialog(
                    self.page,
                    "Não foi possível excluir o relatório."
                )
        except Exception as ex:
            DialogHelper.show_error_dialog(
                self.page,
                f"Ocorreu um erro ao excluir o relatório: {str(ex)}"
            )
    
    def _export_to_pdf(self, report: MaintenanceReport) -> None:
        """
        Exporta um relatório para PDF.
        
        Args:
            report: Relatório de manutenção
        """
        def pick_files_result(e: ft.FilePickerResultEvent) -> None:
            if e.path:
                file_path = e.path
                try:
                    success = ReportService.export_to_pdf(report.id, file_path)
                    
                    if success:
                        DialogHelper.show_success_dialog(
                            self.page,
                            f"Relatório exportado para {file_path}",
                            on_close=lambda e: self._ask_to_open_file(file_path)
                        )
                    else:
                        DialogHelper.show_error_dialog(
                            self.page,
                            "Não foi possível exportar o relatório."
                        )
                        
                except Exception as ex:
                    DialogHelper.show_error_dialog(
                        self.page,
                        f"Ocorreu um erro ao exportar o relatório: {str(ex)}"
                    )
        
        # Criar e exibir o picker de arquivos
        save_file_dialog = ft.FilePicker(on_result=pick_files_result)
        self.page.overlay.append(save_file_dialog)
        self.page.update()
        
        # Configurar e abrir o diálogo
        save_file_dialog.save_file(
            allowed_extensions=["pdf"],
            file_name=f"relatorio_{report.equipment}_{report.date}.pdf"
        )
    
    def _search_reports(self, e) -> None:
        """
        Pesquisa relatórios com base no termo de busca.
        
        Args:
            e: Evento do Flet
        """
        search_term = e.control.value.strip()
        
        if search_term:
            # Pesquisar relatórios
            reports = ReportService.search_reports(search_term)
        else:
            # Carregar todos os relatórios
            reports = ReportService.get_all_reports()
        
        # Atualizar lista
        self.reports_list_view.controls.clear()
        for report in reports:
            self._add_report_to_list(report)
        
        self.page.update()
    
    def _sync_with_api(self, e) -> None:
        """
        Sincroniza os relatórios locais com a API web.
        
        Args:
            e: Evento do Flet
        """
        try:
            success = ReportService.sync_with_api()
            
            if success:
                DialogHelper.show_success_dialog(
                    self.page,
                    "Relatórios sincronizados com sucesso!"
                )
            else:
                DialogHelper.show_error_dialog(
                    self.page,
                    "Não foi possível sincronizar os relatórios."
                )
        except Exception as ex:
            DialogHelper.show_error_dialog(
                self.page,
                f"Ocorreu um erro ao sincronizar os relatórios: {str(ex)}"
            )
    
    def _import_from_api(self, e) -> None:
        """
        Importa relatórios da API web.
        
        Args:
            e: Evento do Flet
        """
        try:
            success = ReportService.import_from_api()
            
            if success:
                DialogHelper.show_success_dialog(
                    self.page,
                    "Relatórios importados com sucesso!",
                    on_close=lambda e: self._load_saved_reports()
                )
            else:
                DialogHelper.show_error_dialog(
                    self.page,
                    "Não foi possível importar os relatórios."
                )
        except Exception as ex:
            DialogHelper.show_error_dialog(
                self.page,
                f"Ocorreu um erro ao importar os relatórios: {str(ex)}"
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