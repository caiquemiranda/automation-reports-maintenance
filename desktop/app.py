#flet-code
import flet as ft
import json
import os
import requests
from datetime import datetime
import tempfile
import subprocess

class MaintenanceReportApp:
    def __init__(self, page: ft.Page):
        self.page = page
        self.page.title = "Sistema de Relatórios de Manutenção - Desktop"
        self.page.theme_mode = ft.ThemeMode.LIGHT
        self.page.padding = 20
        self.page.window_width = 900
        self.page.window_height = 700
        
        # Variáveis de formulário
        self.equipment = ft.TextField(label="Equipamento", width=400)
        self.date = ft.TextField(label="Data", value=datetime.now().strftime("%Y-%m-%d"), width=200)
        self.technician = ft.TextField(label="Técnico", width=400)
        self.service_description = ft.TextField(label="Descrição do Serviço", multiline=True, min_lines=4, max_lines=8, width=800)
        self.observations = ft.TextField(label="Observações Adicionais", multiline=True, min_lines=3, max_lines=5, width=800)
        
        # Lista de peças utilizadas
        self.parts = []
        self.parts_data_table = ft.DataTable(
            columns=[
                ft.DataColumn(ft.Text("Nome")),
                ft.DataColumn(ft.Text("Quantidade")),
                ft.DataColumn(ft.Text("Observações")),
                ft.DataColumn(ft.Text("Ações"))
            ],
            width=800
        )
        
        # Criar interface
        self.create_ui()
    
    def create_ui(self):
        # Título
        title = ft.Text("Relatório de Manutenção", size=24, weight=ft.FontWeight.BOLD)
        
        # Informações gerais (seção)
        general_info_section = ft.Container(
            content=ft.Column([
                ft.Text("Informações Gerais", size=18, weight=ft.FontWeight.BOLD),
                ft.Row([self.equipment], alignment=ft.MainAxisAlignment.START),
                ft.Row([self.date], alignment=ft.MainAxisAlignment.START),
                ft.Row([self.technician], alignment=ft.MainAxisAlignment.START)
            ]),
            padding=10,
            border=ft.border.all(1, ft.colors.BLACK12),
            border_radius=5,
            width=800
        )
        
        # Descrição do serviço (seção)
        service_description_section = ft.Container(
            content=ft.Column([
                ft.Text("Descrição do Serviço", size=18, weight=ft.FontWeight.BOLD),
                self.service_description
            ]),
            padding=10,
            border=ft.border.all(1, ft.colors.BLACK12),
            border_radius=5,
            width=800
        )
        
        # Campos para adicionar peça
        self.part_name = ft.TextField(label="Nome da Peça", width=300)
        self.part_quantity = ft.TextField(label="Quantidade", width=100, value="1")
        self.part_notes = ft.TextField(label="Observações", width=300)
        
        # Seção de peças utilizadas
        parts_section = ft.Container(
            content=ft.Column([
                ft.Text("Peças Utilizadas", size=18, weight=ft.FontWeight.BOLD),
                ft.Row([
                    self.part_name,
                    self.part_quantity,
                    self.part_notes,
                    ft.IconButton(
                        icon=ft.icons.ADD_CIRCLE,
                        icon_color=ft.colors.BLUE,
                        tooltip="Adicionar Peça",
                        on_click=self.add_part
                    )
                ]),
                ft.Container(content=self.parts_data_table, margin=ft.margin.only(top=10))
            ]),
            padding=10,
            border=ft.border.all(1, ft.colors.BLACK12),
            border_radius=5,
            width=800
        )
        
        # Observações adicionais (seção)
        observations_section = ft.Container(
            content=ft.Column([
                ft.Text("Observações Adicionais", size=18, weight=ft.FontWeight.BOLD),
                self.observations
            ]),
            padding=10,
            border=ft.border.all(1, ft.colors.BLACK12),
            border_radius=5,
            width=800
        )
        
        # Botões de ação
        buttons_row = ft.Row([
            ft.ElevatedButton("Limpar", on_click=self.clear_form),
            ft.ElevatedButton("Gerar Relatório", on_click=self.generate_report)
        ], alignment=ft.MainAxisAlignment.END)
        
        # Montar a interface completa
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
            buttons_row
        )
    
    def add_part(self, e):
        try:
            name = self.part_name.value.strip()
            quantity_str = self.part_quantity.value.strip()
            notes = self.part_notes.value.strip()
            
            if not name:
                self.show_error_dialog("Erro", "Digite o nome da peça")
                return
            
            try:
                quantity = int(quantity_str)
                if quantity <= 0:
                    self.show_error_dialog("Erro", "Quantidade deve ser maior que zero")
                    return
            except ValueError:
                self.show_error_dialog("Erro", "Quantidade deve ser um número inteiro")
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
            self.show_error_dialog("Erro", f"Ocorreu um erro: {str(e)}")
    
    def remove_part(self, e):
        idx = e.control.data
        if 0 <= idx < len(self.parts):
            self.parts.pop(idx)
            self.parts_data_table.rows.pop(idx)
            
            # Atualizar índices dos botões de remoção
            for i, row in enumerate(self.parts_data_table.rows):
                row.cells[-1].content.data = i
            
            self.page.update()
    
    def clear_form(self, e=None):
        self.equipment.value = ""
        self.date.value = datetime.now().strftime("%Y-%m-%d")
        self.technician.value = ""
        self.service_description.value = ""
        self.observations.value = ""
        
        # Limpar lista de peças
        self.parts = []
        self.parts_data_table.rows.clear()
        
        self.page.update()
    
    def generate_report(self, e):
        # Validar dados
        equipment = self.equipment.value.strip()
        date = self.date.value.strip()
        technician = self.technician.value.strip()
        service_description = self.service_description.value.strip()
        observations = self.observations.value.strip()
        
        if not equipment:
            self.show_error_dialog("Erro", "Digite o nome do equipamento")
            return
        
        if not date:
            self.show_error_dialog("Erro", "Digite a data")
            return
        
        if not technician:
            self.show_error_dialog("Erro", "Digite o nome do técnico")
            return
        
        if not service_description:
            self.show_error_dialog("Erro", "Digite a descrição do serviço")
            return
        
        if not self.parts:
            self.show_error_dialog("Erro", "Adicione pelo menos uma peça")
            return
        
        # Montar dados para a API
        report_data = {
            "equipment": equipment,
            "date": date,
            "technician": technician,
            "service_description": service_description,
            "parts_used": self.parts,
            "observations": observations
        }
        
        try:
            # Perguntar onde salvar o arquivo
            def pick_files_result(e: ft.FilePickerResultEvent):
                if e.path:
                    file_path = e.path
                    try:
                        # Salvar como JSON
                        with open(file_path, "w", encoding="utf-8") as f:
                            json.dump(report_data, f, ensure_ascii=False, indent=4)
                        
                        self.show_success_dialog("Sucesso", f"Relatório salvo em {file_path}")
                        
                        # Perguntar se deseja abrir o arquivo
                        def open_file_dialog(e):
                            if e.control.data == "sim":
                                try:
                                    if os.name == "nt":  # Windows
                                        os.startfile(file_path)
                                    else:  # Unix/Linux/Mac
                                        subprocess.call(["xdg-open", file_path])
                                except Exception as ex:
                                    self.show_error_dialog("Erro", f"Não foi possível abrir o arquivo: {str(ex)}")
                            dlg.open = False
                            self.page.update()
                        
                        dlg = ft.AlertDialog(
                            title=ft.Text("Abrir Arquivo"),
                            content=ft.Text("Deseja abrir o arquivo salvo?"),
                            actions=[
                                ft.TextButton("Não", on_click=open_file_dialog, data="nao"),
                                ft.TextButton("Sim", on_click=open_file_dialog, data="sim"),
                            ],
                            actions_alignment=ft.MainAxisAlignment.END,
                        )
                        
                        self.page.dialog = dlg
                        dlg.open = True
                        self.page.update()
                        
                    except Exception as ex:
                        self.show_error_dialog("Erro", f"Ocorreu um erro ao salvar o arquivo: {str(ex)}")
            
            save_file_dialog = ft.FilePicker(on_result=pick_files_result)
            self.page.overlay.append(save_file_dialog)
            self.page.update()
            save_file_dialog.save_file(
                allowed_extensions=["json"],
                file_name=f"relatorio_{equipment}_{date}.json"
            )
            
        except Exception as e:
            self.show_error_dialog("Erro", f"Ocorreu um erro: {str(e)}")
    
    def show_error_dialog(self, title, message):
        """Mostra um diálogo de erro"""
        def close_dlg(e):
            dlg.open = False
            self.page.update()
        
        dlg = ft.AlertDialog(
            title=ft.Text(title),
            content=ft.Text(message),
            actions=[
                ft.TextButton("OK", on_click=close_dlg),
            ],
            actions_alignment=ft.MainAxisAlignment.END,
        )
        
        self.page.dialog = dlg
        dlg.open = True
        self.page.update()
    
    def show_success_dialog(self, title, message):
        """Mostra um diálogo de sucesso"""
        def close_dlg(e):
            dlg.open = False
            self.page.update()
        
        dlg = ft.AlertDialog(
            title=ft.Text(title),
            content=ft.Text(message),
            actions=[
                ft.TextButton("OK", on_click=close_dlg),
            ],
            actions_alignment=ft.MainAxisAlignment.END,
        )
        
        self.page.dialog = dlg
        dlg.open = True
        self.page.update()

def main(page: ft.Page):
    app = MaintenanceReportApp(page)

if __name__ == "__main__":
    ft.app(target=main)