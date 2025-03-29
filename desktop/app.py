#flet-code
import flet as ft
import json
import os
import requests
from datetime import datetime
import tempfile
import subprocess
from src.ui import MaintenanceReportApp
from src.database import engine, Base

def main(page: ft.Page):
    """
    Função principal que inicializa a aplicação.
    
    Args:
        page: Página do Flet
    """
    # Inicializar banco de dados
    Base.metadata.create_all(bind=engine)
    
    # Inicializar aplicação
    app = MaintenanceReportApp(page)

if __name__ == "__main__":
    ft.app(target=main)