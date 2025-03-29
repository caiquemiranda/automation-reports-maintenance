# Sistema de Relatórios de Manutenção

Sistema para geração de relatórios de manutenção com exportação para formato Word.

## Estrutura do Projeto

Este projeto consiste em duas aplicações:

### Aplicação Web

Uma aplicação web completa com frontend React e backend Python/Flask:

- **Frontend**: Interface de usuário moderna desenvolvida com React para criação e geração de relatórios
- **Backend**: API REST usando Flask que processa os dados e gera documentos Word

### Aplicação Desktop

Uma aplicação desktop simples desenvolvida com Python e Flet que permite a criação de relatórios offline.

## Funcionalidades Principais

- Criação de relatórios de manutenção detalhados
- Adição de equipamentos e descrição dos serviços realizados
- Registro de peças utilizadas nos reparos
- Exportação para documentos Word formatados
- Interface intuitiva e responsiva (versão web)
- Funcionamento offline (versão desktop)
- Armazenamento local de relatórios com SQLite
- Sincronização de dados entre aplicações web e desktop

## Tecnologias Utilizadas

### Aplicação Web
- **Backend**: Python, FastAPI, SQLAlchemy, python-docx
- **Frontend**: React, Formik, Axios

### Aplicação Desktop
- Python, Flet, SQLAlchemy, SQLite

## Como Executar

### Aplicação Web

#### Usando Docker (Recomendado)
```bash
cd webapp
chmod +x run.sh
./run.sh
```

#### Limpando Dados e Containers
```bash
cd webapp
chmod +x cleanup.sh
./cleanup.sh
```

#### Manualmente
**Backend**
```bash
cd webapp/backend
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

**Frontend**
```bash
cd webapp/frontend
npm install
npm start
```

### Aplicação Desktop

#### Usando Docker
```bash
cd desktop
chmod +x run.sh
./run.sh
```

#### Manualmente
```bash
cd desktop
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Banco de Dados

O sistema utiliza SQLite para armazenamento de dados, tanto na versão web quanto na desktop:

- **Localização dos dados**:
  - Aplicação Web: `webapp/backend/data/maintenance_reports.db`
  - Aplicação Desktop: `desktop/data/maintenance_reports.db`

- **Sincronização**: A aplicação desktop pode sincronizar seus dados com a API web quando online.

- **Schemas de banco**:
  - Tabela `reports`: Armazena informações dos relatórios de manutenção
  - Tabela `parts`: Armazena peças utilizadas em cada relatório

- **Migrações**: A aplicação web utiliza Alembic para gerenciamento de migrações.

## Estrutura do Projeto (Backend)

```
webapp/backend/
├── app/
│   ├── __init__.py           # Configuração e inicialização do aplicativo
│   ├── api/                  # Endpoints da API
│   │   ├── __init__.py
│   │   └── routes.py         # Definição das rotas
│   ├── models/               # Modelos de dados
│   │   ├── __init__.py
│   │   └── maintenance_report.py # Modelos SQLAlchemy e Pydantic
│   ├── repositories/         # Repositórios para acesso ao banco
│   │   ├── __init__.py
│   │   └── report_repository.py # Repository pattern para relatórios
│   ├── services/             # Serviços da aplicação
│   │   ├── __init__.py
│   │   └── document_service.py # Serviço para geração de documentos
│   ├── database.py           # Configuração do SQLAlchemy
│   ├── utils/                # Utilitários
│   │   └── __init__.py
│   └── config.py             # Configurações do aplicativo
├── alembic/                  # Migrações de banco de dados
├── data/                     # Diretório para armazenamento do SQLite
├── run.py                    # Ponto de entrada para execução
└── requirements.txt          # Dependências
```

## Estrutura do Projeto (Desktop)

```
desktop/
├── app.py                    # Ponto de entrada simples
├── data/                     # Banco de dados SQLite local
├── src/
│   ├── database/             # Configuração do banco SQLite
│   │   ├── __init__.py
│   │   └── database.py       # Configuração do SQLAlchemy
│   ├── repositories/         # Repositórios de dados
│   │   ├── __init__.py
│   │   └── report_repository.py # Acesso ao banco de dados
│   ├── ui/                   # Componentes da interface
│   │   ├── __init__.py
│   │   ├── app_ui.py         # Interface principal
│   │   ├── dialogs.py        # Diálogos da aplicação
│   │   └── sections.py       # Seções do formulário
│   ├── models/               # Modelos de dados
│   │   ├── __init__.py
│   │   └── report.py         # Modelo SQLAlchemy e dataclass
│   ├── services/             # Serviços
│   │   ├── __init__.py
│   │   └── report_service.py # Serviço para gerenciamento de relatórios
│   └── utils/                # Utilitários
│       ├── __init__.py
│       └── helpers.py        # Funções auxiliares
└── requirements.txt          # Dependências
```

## Licença

Este projeto está licenciado sob a licença MIT.
