import os
import sqlite3
import json
import datetime

def json_serializer(obj):
    """Serializa objetos para JSON que normalmente não seriam serializáveis."""
    if isinstance(obj, (datetime.datetime, datetime.date)):
        return obj.isoformat()
    raise TypeError(f"Tipo não serializável: {type(obj)}")

def test_database():
    """Testa o banco de dados SQLite e imprime informações sobre ele."""
    print("\n===== VERIFICAÇÃO DO BANCO DE DADOS =====")
    
    # Caminho do banco de dados
    db_path = os.path.join(os.path.abspath("./data"), "app.db")
    
    # Verificar se o arquivo existe
    if not os.path.exists(db_path):
        print(f"O arquivo de banco de dados não existe: {db_path}")
        return False
    
    # Tamanho do arquivo
    size = os.path.getsize(db_path)
    print(f"Tamanho do banco de dados: {size} bytes")
    
    # Conectar ao banco de dados
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row  # Para acessar colunas pelo nome
        cursor = conn.cursor()
        
        # Verificar integridade
        cursor.execute("PRAGMA integrity_check")
        integrity = cursor.fetchone()[0]
        print(f"Verificação de integridade: {integrity}")
        
        # Listar tabelas
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        print(f"Tabelas encontradas: {', '.join(tables)}")
        
        # Para cada tabela, mostrar contagem e alguns registros
        for table in tables:
            print(f"\n--- Tabela: {table} ---")
            
            # Contar registros
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"Número de registros: {count}")
            
            if count > 0:
                # Mostrar estrutura
                cursor.execute(f"PRAGMA table_info({table})")
                columns = [f"{row[1]} ({row[2]})" for row in cursor.fetchall()]
                print(f"Colunas: {', '.join(columns)}")
                
                # Mostrar alguns registros
                cursor.execute(f"SELECT * FROM {table} LIMIT 5")
                rows = cursor.fetchall()
                
                print("Primeiros registros:")
                for row in rows:
                    row_dict = {k: row[k] for k in row.keys()}
                    # Tentar serializar JSON
                    if 'dados' in row_dict and row_dict['dados']:
                        try:
                            row_dict['dados'] = json.loads(row_dict['dados'])
                        except:
                            pass
                    print(json.dumps(row_dict, indent=2, default=json_serializer))
        
        conn.close()
        return True
    
    except Exception as e:
        print(f"Erro ao acessar o banco de dados: {e}")
        return False
        
if __name__ == "__main__":
    test_database() 