import os
import sys
import glob
import argparse
from datetime import datetime
import subprocess

def main():
    parser = argparse.ArgumentParser(description='Processamento em lote de documentos DOC para HTML e PDF')
    parser.add_argument('input_pattern', help='Padrão glob para arquivos DOC de entrada (ex: "*.doc", "reports/*.doc")')
    parser.add_argument('--output-dir', dest='output_dir', default='output', help='Diretório de saída para arquivos gerados')
    parser.add_argument('--skip-pdf', dest='skip_pdf', action='store_true', help='Pular a geração de PDF')
    
    args = parser.parse_args()
    
    # Criar o diretório de saída se não existir
    if not os.path.exists(args.output_dir):
        os.makedirs(args.output_dir)
        print(f"Diretório de saída criado: {args.output_dir}")
    
    # Encontrar todos os arquivos DOC que correspondem ao padrão
    doc_files = glob.glob(args.input_pattern, recursive=True)
    
    if not doc_files:
        print(f"Nenhum arquivo encontrado com o padrão: {args.input_pattern}")
        sys.exit(1)
    
    print(f"Encontrados {len(doc_files)} arquivos para processamento.")
    
    # Registro do processamento
    log_file = os.path.join(args.output_dir, f"batch_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt")
    
    with open(log_file, 'w', encoding='utf-8') as log:
        log.write(f"Início do processamento em lote: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        log.write(f"Padrão de entrada: {args.input_pattern}\n")
        log.write(f"Diretório de saída: {args.output_dir}\n")
        log.write(f"Número de arquivos: {len(doc_files)}\n\n")
        
        # Processar cada arquivo
        for i, doc_file in enumerate(doc_files, 1):
            file_name = os.path.basename(doc_file)
            file_base = os.path.splitext(file_name)[0]
            
            output_html = os.path.join(args.output_dir, f"{file_base}.html")
            output_css = os.path.join(args.output_dir, f"{file_base}_style.css")
            output_pdf = os.path.join(args.output_dir, f"{file_base}.pdf")
            
            print(f"\n[{i}/{len(doc_files)}] Processando: {file_name}")
            log.write(f"\n[{i}/{len(doc_files)}] Processando: {file_name}\n")
            
            # Construir o comando para a conversão
            cmd = [
                sys.executable,
                'doc_converter_cli.py',
                doc_file,
                '--output-html', output_html,
                '--output-css', output_css,
                '--output-pdf', output_pdf
            ]
            
            if args.skip_pdf:
                cmd.append('--skip-pdf')
            
            # Executar o comando e registrar o resultado
            try:
                result = subprocess.run(cmd, capture_output=True, text=True)
                
                if result.returncode == 0:
                    status = "SUCESSO"
                else:
                    status = "FALHA"
                
                log.write(f"  Status: {status}\n")
                log.write(f"  Saída: {result.stdout}\n")
                
                if result.stderr:
                    log.write(f"  Erro: {result.stderr}\n")
                
                print(f"  Status: {status}")
                
                if status == "SUCESSO":
                    print(f"  HTML: {output_html}")
                    if not args.skip_pdf:
                        print(f"  PDF: {output_pdf}")
                else:
                    print(f"  Erro ao processar o arquivo. Veja o log para detalhes.")
                
            except Exception as e:
                log.write(f"  Erro de execução: {str(e)}\n")
                print(f"  Erro ao executar a conversão: {str(e)}")
        
        log.write(f"\nProcessamento concluído: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    print(f"\nProcessamento em lote concluído. Log salvo em: {log_file}")

if __name__ == "__main__":
    main() 