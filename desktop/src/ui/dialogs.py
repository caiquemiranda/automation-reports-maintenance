import flet as ft
from typing import Callable, Optional

class DialogHelper:
    """Classe utilitária para exibir diálogos na aplicação."""
    
    @staticmethod
    def show_message_dialog(
        page: ft.Page, 
        title: str, 
        message: str, 
        on_close: Optional[Callable] = None
    ) -> None:
        """
        Exibe um diálogo de mensagem.
        
        Args:
            page: Página Flet
            title: Título do diálogo
            message: Mensagem a ser exibida
            on_close: Callback a ser chamado quando o diálogo for fechado
        """
        def close_dlg(e):
            dlg.open = False
            page.update()
            if on_close:
                on_close(e)
        
        dlg = ft.AlertDialog(
            title=ft.Text(title),
            content=ft.Text(message),
            actions=[
                ft.TextButton("OK", on_click=close_dlg),
            ],
            actions_alignment=ft.MainAxisAlignment.END,
        )
        
        page.dialog = dlg
        dlg.open = True
        page.update()
    
    @staticmethod
    def show_error_dialog(
        page: ft.Page, 
        message: str, 
        title: str = "Erro", 
        on_close: Optional[Callable] = None
    ) -> None:
        """
        Exibe um diálogo de erro.
        
        Args:
            page: Página Flet
            message: Mensagem de erro
            title: Título do diálogo
            on_close: Callback a ser chamado quando o diálogo for fechado
        """
        DialogHelper.show_message_dialog(page, title, message, on_close)
    
    @staticmethod
    def show_success_dialog(
        page: ft.Page, 
        message: str, 
        title: str = "Sucesso", 
        on_close: Optional[Callable] = None
    ) -> None:
        """
        Exibe um diálogo de sucesso.
        
        Args:
            page: Página Flet
            message: Mensagem de sucesso
            title: Título do diálogo
            on_close: Callback a ser chamado quando o diálogo for fechado
        """
        DialogHelper.show_message_dialog(page, title, message, on_close)
    
    @staticmethod
    def show_confirmation_dialog(
        page: ft.Page, 
        title: str, 
        message: str, 
        on_confirm: Callable, 
        on_cancel: Optional[Callable] = None,
        confirm_text: str = "Sim",
        cancel_text: str = "Não"
    ) -> None:
        """
        Exibe um diálogo de confirmação.
        
        Args:
            page: Página Flet
            title: Título do diálogo
            message: Mensagem a ser exibida
            on_confirm: Callback a ser chamado quando o usuário confirmar
            on_cancel: Callback a ser chamado quando o usuário cancelar
            confirm_text: Texto do botão de confirmação
            cancel_text: Texto do botão de cancelamento
        """
        def handle_confirm(e):
            dlg.open = False
            page.update()
            on_confirm(e)
        
        def handle_cancel(e):
            dlg.open = False
            page.update()
            if on_cancel:
                on_cancel(e)
        
        dlg = ft.AlertDialog(
            title=ft.Text(title),
            content=ft.Text(message),
            actions=[
                ft.TextButton(cancel_text, on_click=handle_cancel),
                ft.TextButton(confirm_text, on_click=handle_confirm),
            ],
            actions_alignment=ft.MainAxisAlignment.END,
        )
        
        page.dialog = dlg
        dlg.open = True
        page.update() 