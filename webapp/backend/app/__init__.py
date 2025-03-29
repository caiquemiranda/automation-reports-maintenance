from flask import Flask
from flask_cors import CORS
from .config import config_by_name

def create_app(config_name='dev'):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    
    # Habilitar CORS
    CORS(app)
    
    # Registrar blueprints
    from .api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app 