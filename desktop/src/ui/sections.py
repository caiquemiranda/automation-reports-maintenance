import flet as ft
from typing import Callable, List, Dict, Any

class FormSection:
    """Classe base para seções de formulário."""
    
    @staticmethod
    def create_section(title: str, content: ft.Control, width: int = 800) -> ft.Container:
        """
        Cria uma seção de formulário.
        
        Args:
            title: Título da seção
            content: Conteúdo da seção
            width: Largura da seção
            
        Returns:
            Container da seção
        """
        return ft.Container(
            content=ft.Column([
                ft.Text(title, size=18, weight=ft.FontWeight.BOLD),
                content
            ]),
            padding=10,
            border=ft.border.all(1, ft.colors.BLACK12),
            border_radius=5,
            width=width
        )

class GeneralInfoSection:
    """Seção de informações gerais do relatório."""
    
    @staticmethod
    def create(
        equipment: ft.TextField,
        date: ft.TextField,
        technician: ft.TextField
    ) -> ft.Container:
        """
        Cria a seção de informações gerais.
        
        Args:
            equipment: Campo de texto para o equipamento
            date: Campo de texto para a data
            technician: Campo de texto para o técnico
            
        Returns:
            Container da seção
        """
        content = ft.Column([
            ft.Row([equipment], alignment=ft.MainAxisAlignment.START),
            ft.Row([date], alignment=ft.MainAxisAlignment.START),
            ft.Row([technician], alignment=ft.MainAxisAlignment.START)
        ])
        
        return FormSection.create_section("Informações Gerais", content)

class ServiceDescriptionSection:
    """Seção de descrição do serviço."""
    
    @staticmethod
    def create(description: ft.TextField) -> ft.Container:
        """
        Cria a seção de descrição do serviço.
        
        Args:
            description: Campo de texto para a descrição
            
        Returns:
            Container da seção
        """
        return FormSection.create_section("Descrição do Serviço", description)

class PartsSection:
    """Seção de peças utilizadas."""
    
    @staticmethod
    def create(
        part_name: ft.TextField,
        part_quantity: ft.TextField,
        part_notes: ft.TextField,
        parts_table: ft.DataTable,
        add_part_callback: Callable
    ) -> ft.Container:
        """
        Cria a seção de peças utilizadas.
        
        Args:
            part_name: Campo de texto para o nome da peça
            part_quantity: Campo de texto para a quantidade
            part_notes: Campo de texto para as observações
            parts_table: Tabela de peças
            add_part_callback: Callback para adicionar peça
            
        Returns:
            Container da seção
        """
        content = ft.Column([
            ft.Row([
                part_name,
                part_quantity,
                part_notes,
                ft.IconButton(
                    icon=ft.icons.ADD_CIRCLE,
                    icon_color=ft.colors.BLUE,
                    tooltip="Adicionar Peça",
                    on_click=add_part_callback
                )
            ]),
            ft.Container(content=parts_table, margin=ft.margin.only(top=10))
        ])
        
        return FormSection.create_section("Peças Utilizadas", content)

class ObservationsSection:
    """Seção de observações adicionais."""
    
    @staticmethod
    def create(observations: ft.TextField) -> ft.Container:
        """
        Cria a seção de observações adicionais.
        
        Args:
            observations: Campo de texto para as observações
            
        Returns:
            Container da seção
        """
        return FormSection.create_section("Observações Adicionais", observations)

class ActionsSection:
    """Seção de botões de ação."""
    
    @staticmethod
    def create(
        clear_callback: Callable,
        generate_callback: Callable
    ) -> ft.Row:
        """
        Cria a seção de botões de ação.
        
        Args:
            clear_callback: Callback para limpar o formulário
            generate_callback: Callback para gerar o relatório
            
        Returns:
            Container da seção
        """
        return ft.Row([
            ft.ElevatedButton("Limpar", on_click=clear_callback),
            ft.ElevatedButton("Gerar Relatório", on_click=generate_callback)
        ], alignment=ft.MainAxisAlignment.END) 