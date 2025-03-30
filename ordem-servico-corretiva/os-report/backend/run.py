import uvicorn
import os
import sys
from dotenv import load_dotenv
from app.database import create_db_and_tables  # Importar função de criação do banco

def check_data_directory():
    """Verifica se o diretório de dados existe e tem permissões de escrita."""
    data_dir = os.path.abspath("./data")
    
    # Verificar se o diretório existe
    if not os.path.exists(data_dir):
        try:
            os.makedirs(data_dir, exist_ok=True)
            print(f"Diretório de dados criado: {data_dir}")
        except Exception as e:
            print(f"ERRO: Não foi possível criar o diretório de dados: {e}")
            sys.exit(1)
    else:
        print(f"Diretório de dados encontrado: {data_dir}")
    
    # Verificar permissões de escrita
    try:
        test_file = os.path.join(data_dir, "test_write.txt")
        with open(test_file, "w") as f:
            f.write("Teste de escrita")
        os.remove(test_file)
        print(f"Teste de escrita no diretório de dados bem-sucedido: {data_dir}")
    except Exception as e:
        print(f"ERRO: O diretório de dados não tem permissão de escrita: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Carregar variáveis de ambiente
    load_dotenv()
    
    # Verificar diretório de dados
    check_data_directory()
    
    # Inicializar banco de dados - ADICIONADO
    try:
        print("Inicializando banco de dados e criando tabelas...")
        create_db_and_tables()
        print("Banco de dados inicializado com sucesso!")
    except Exception as e:
        print(f"ERRO ao inicializar banco de dados: {e}")
        sys.exit(1)
    
    # Recuperar configurações
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    reload = os.getenv("RELOAD", "True").lower() == "true"
    
    print(f"Iniciando servidor na porta {port}...")
    
    # Iniciar o servidor
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload
    ) 