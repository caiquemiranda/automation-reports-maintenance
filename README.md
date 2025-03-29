# Sistema de Relatórios de Manutenção

Sistema para geração de relatórios de manutenção com exportação para formato Word.

## Estrutura do Projeto

Este projeto consiste em duas aplicações:

### Aplicação Web

Uma aplicação web completa com frontend React e backend Python/Flask:

- **Frontend**: Interface de usuário moderna desenvolvida com React para criação e geração de relatórios
- **Backend**: API REST usando Flask que processa os dados e gera documentos Word

### Aplicação Desktop

Uma aplicação desktop simples desenvolvida com Python e Tkinter que permite a criação de relatórios offline.

## Funcionalidades Principais

- Criação de relatórios de manutenção detalhados
- Adição de equipamentos e descrição dos serviços realizados
- Registro de peças utilizadas nos reparos
- Exportação para documentos Word formatados
- Interface intuitiva e responsiva (versão web)
- Funcionamento offline (versão desktop)

## Tecnologias Utilizadas

### Aplicação Web
- **Backend**: Python, Flask, python-docx
- **Frontend**: React, Formik, Axios

### Aplicação Desktop
- Python, Tkinter

## Como Executar

### Aplicação Web

#### Backend
```bash
cd webapp/backend
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

#### Frontend
```bash
cd webapp/frontend
npm install
npm start
```

### Aplicação Desktop
```bash
cd desktop
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Licença

Este projeto está licenciado sob a licença MIT.
