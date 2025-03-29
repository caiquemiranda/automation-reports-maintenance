from datetime import datetime
import tempfile
from typing import Optional, Callable, Any

def get_current_date() -> str:
    """
    Retorna a data atual formatada como YYYY-MM-DD.
    
    Returns:
        Data atual formatada
    """
    return datetime.now().strftime("%Y-%m-%d")

def create_temp_file(suffix: str = ".tmp") -> str:
    """
    Cria um arquivo temporário e retorna seu caminho.
    
    Args:
        suffix: Extensão do arquivo temporário
        
    Returns:
        Caminho do arquivo temporário
    """
    temp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    temp_path = temp.name
    temp.close()
    return temp_path

def safe_execute(func: Callable, *args, **kwargs) -> tuple[bool, Any, Optional[str]]:
    """
    Executa uma função de forma segura, capturando exceções.
    
    Args:
        func: Função a ser executada
        *args: Argumentos posicionais para a função
        **kwargs: Argumentos nomeados para a função
        
    Returns:
        Tupla (sucesso, resultado, mensagem_erro)
    """
    try:
        result = func(*args, **kwargs)
        return True, result, None
    except Exception as e:
        return False, None, str(e) 