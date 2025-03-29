from flask import request, jsonify, send_file
import os
from . import api_bp
from ..models import MaintenanceReport
from ..services import DocumentService

@api_bp.route('/health', methods=['GET'])
def health_check():
    """
    Endpoint para verificar se a API está funcionando.
    """
    return jsonify({"status": "online", "service": "maintenance-reports-api"})

@api_bp.route('/generate-report', methods=['POST'])
def generate_report():
    """
    Endpoint para gerar um relatório de manutenção em formato Word.
    
    Espera um JSON com os dados do relatório no corpo da requisição.
    Retorna um arquivo Word gerado a partir dos dados do relatório.
    """
    temp_filename = None
    try:
        # Extrair dados da requisição
        data = request.json
        report = MaintenanceReport(**data)
        
        # Gerar documento usando o serviço
        temp_filename = DocumentService.generate_report_document(report)
        
        # Enviar o arquivo para o cliente
        return send_file(
            temp_filename,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            as_attachment=True,
            download_name=f'relatorio_{report.equipment}_{report.date}.docx'
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    finally:
        # Limpar o arquivo temporário
        if temp_filename:
            DocumentService.cleanup_temp_file(temp_filename) 