import uvicorn
import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    # Porta padrão 5000, mas pode ser definida por variável de ambiente
    port = int(os.getenv("PORT", 5000))
    
    # Executar com Uvicorn
    uvicorn.run(
        "run:app", 
        host="0.0.0.0", 
        port=port, 
        reload=True,
        log_level="info"
    ) 