import uvicorn
import os
from dotenv import load_dotenv

if __name__ == "__main__":
    # Carregar variáveis de ambiente
    load_dotenv()
    
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