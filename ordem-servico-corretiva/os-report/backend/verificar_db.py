#!/usr/bin/env python3
"""
Script para verificar a integridade do banco de dados.
Execute este script para diagnosticar problemas com o banco de dados SQLite.
"""

import os
import sqlite3
import sys

def verificar_banco_dados():
    """Verifica o estado do banco de dados e imprime informações diagnósticas."""
    print("\n===== VERIFICAÇÃO DO BANCO DE DADOS =====")
    
    # Determinar o caminho do banco de dados
    db_path = os.path.join(os.path.abspath("./data"), "app.db")
    print(f"Caminho do banco de dados: {db_path}")
    
    # Verificar se o diretório de dados existe
    db_dir = os.path.dirname(db_path)
    if not os.path.exists(db_dir):
        print(f"ERRO: O diretório de dados não existe: {db_dir}")
        return False
    
    # Verificar permissões do diretório
    try:
        stats = os.stat(db_dir)
        print(f"Permissões do diretório: {oct(stats.st_mode)}")
    except Exception as e:
        print(f"ERRO ao verificar permissões do diretório: {e}")
    
    # Verificar se o arquivo do banco de dados existe
    if not os.path.exists(db_path):
        print(f"ERRO: O arquivo de banco de dados não existe: {db_path}")
        return False
    
    # Verificar permissões do arquivo
    try:
        stats = os.stat(db_path)
        print(f"Permissões do arquivo: {oct(stats.st_mode)}")
    except Exception as e:
        print(f"ERRO ao verificar permissões do arquivo: {e}")
    
    # Tamanho do banco de dados
    try:
        size = os.path.getsize(db_path)
        print(f"Tamanho do banco de dados: {size} bytes")
    except Exception as e:
        print(f"ERRO ao verificar tamanho do arquivo: {e}")
        return False
    
    # Tentar conectar ao banco de dados
    try:
        print("\nConectando ao banco de dados...")
        conn = sqlite3.connect(db_path)
        print("Conexão estabelecida com sucesso!")
        
        # Verificar integridade do banco de dados
        cursor = conn.cursor()
        cursor.execute("PRAGMA integrity_check")
        integrity = cursor.fetchone()[0]
        print(f"Verificação de integridade: {integrity}")
        
        # Listar tabelas
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        if tables:
            print(f"\nTabelas encontradas ({len(tables)}):")
            for i, table in enumerate(tables, 1):
                print(f"  {i}. {table}")
                
                # Verificar estrutura da tabela
                cursor.execute(f"PRAGMA table_info({table})")
                columns = cursor.fetchall()
                print(f"     Colunas: {len(columns)}")
                
                # Contar registros
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"     Registros: {count}")
                
                # Mostrar primeiros registros se houver
                if count > 0:
                    cursor.execute(f"SELECT * FROM {table} LIMIT 3")
                    rows = cursor.fetchall()
                    print(f"     Amostra de dados: {rows}")
        else:
            print("\nNenhuma tabela encontrada no banco de dados!")
            
        # Fechar conexão
        conn.close()
        print("\nConexão com o banco de dados fechada.")
        
        return True
    except Exception as e:
        print(f"\nERRO ao acessar o banco de dados: {e}")
        return False

def corrigir_banco_dados():
    """Tenta corrigir problemas comuns com o banco de dados."""
    print("\n===== TENTATIVA DE CORREÇÃO DO BANCO DE DADOS =====")
    
    db_path = os.path.join(os.path.abspath("./data"), "app.db")
    db_dir = os.path.dirname(db_path)
    
    # Criar diretório de dados se não existir
    if not os.path.exists(db_dir):
        print(f"Criando diretório de dados: {db_dir}")
        os.makedirs(db_dir, exist_ok=True)
        try:
            os.chmod(db_dir, 0o777)  # Permissões totais
            print("Permissões do diretório atualizadas.")
        except Exception as e:
            print(f"ERRO ao definir permissões do diretório: {e}")
    
    # Se o banco de dados existe e está corrompido, fazer backup e criar novo
    if os.path.exists(db_path):
        try:
            # Tentar verificar se está corrompido
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("PRAGMA integrity_check")
            integrity = cursor.fetchone()[0]
            conn.close()
            
            if integrity != "ok":
                print(f"Banco de dados corrompido. Criando backup: {db_path}.bak")
                import shutil
                shutil.copy2(db_path, f"{db_path}.bak")
                os.remove(db_path)
                print("Arquivo original removido.")
        except Exception as e:
            print(f"Erro ao verificar banco existente, criando backup: {e}")
            import shutil
            shutil.copy2(db_path, f"{db_path}.bak")
            os.remove(db_path)
            print("Arquivo original removido.")
    
    # Criar novo banco de dados vazio
    if not os.path.exists(db_path):
        print(f"Criando novo banco de dados vazio: {db_path}")
        try:
            conn = sqlite3.connect(db_path)
            conn.close()
            os.chmod(db_path, 0o666)  # Permissões de leitura/escrita
            print("Banco de dados vazio criado com sucesso.")
        except Exception as e:
            print(f"ERRO ao criar banco de dados vazio: {e}")
            return False
    
    print("\nPara recriar as tabelas, execute:")
    print("python run.py")
    print("\nOu para aplicações em execução, reinicie os containers:")
    print("docker-compose restart")
    
    return True

if __name__ == "__main__":
    print("Ferramenta de verificação e reparo do banco de dados")
    print("==================================================")
    
    # Verificar o banco de dados
    verificacao_ok = verificar_banco_dados()
    
    # Se houver problemas, oferecer correção
    if not verificacao_ok:
        resposta = input("\nDeseja tentar corrigir o banco de dados? (s/n): ").lower()
        if resposta == 's':
            if corrigir_banco_dados():
                print("\nOperação de correção concluída. Verifique o banco de dados novamente.")
            else:
                print("\nFalha na operação de correção. Contate o suporte técnico.")
        else:
            print("\nOperação cancelada pelo usuário.")
    else:
        print("\nBanco de dados OK! Nenhuma correção necessária.") 