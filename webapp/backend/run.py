import os
from app import create_app

# Obter o ambiente a partir da variável de ambiente, com padrão 'dev'
config_name = os.getenv('FLASK_ENV', 'dev')
app = create_app(config_name)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 