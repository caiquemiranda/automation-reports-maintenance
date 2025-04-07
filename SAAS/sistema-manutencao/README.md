# Sistema de Gestão de Manutenção Industrial - ManutençãoPRO

Um sistema completo para gerenciamento de ordens de serviço de manutenção industrial, com suporte a ordens corretivas e planejadas, registro de atividades técnicas e geração de relatórios.

## Características

- Dashboard com visão geral das manutenções
- Gestão de Ordens de Serviço Corretivas
- Gestão de Ordens de Serviço Planejadas
- Calendário de manutenções
- Relatórios (mensal, por técnico, por equipamento)
- Mapa de sensores e equipamentos

## Tecnologias Utilizadas

- React.js
- Material UI
- Styled Components
- React Router
- Date-fns

## Requisitos

- Node.js (v14 ou superior)
- npm (v6 ou superior)

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/caiquemiranda/automation-reports-maintenance
cd SAAS/sistema-manutencao/
```

2. Instale as dependências:

```bash
npm install
```

3. Instale as bibliotecas necessárias:

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install styled-components
npm install react-router-dom
npm install date-fns @mui/x-date-pickers
```

## Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
npm start
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## Executando com Docker

Se você estiver enfrentando problemas para executar o projeto localmente, você pode usar Docker para executá-lo em um ambiente isolado.

### Requisitos

- Docker
- Docker Compose

### Executando com Docker Compose

1. No diretório do projeto, execute:

```bash
docker-compose up --build
```

Se encontrar erros relacionados ao date-fns ou outras bibliotecas, tente:

```bash
# Remover os containers existentes
docker-compose down

# Remover a pasta node_modules local, se existir
rm -rf node_modules

# Reconstruir a imagem sem usar o cache
docker-compose build --no-cache

# Iniciar o container
docker-compose up
```

2. Para reconstruir a imagem (após alterações no Dockerfile):

```bash
docker-compose up --build
```

3. Para executar em segundo plano:

```bash
docker-compose up -d
```

4. Para parar os containers:

```bash
docker-compose down
```

### Solução de Problemas

Se encontrar erros de incompatibilidade entre bibliotecas:

1. Verifique se as versões no package.json estão corretas:
   - Para compatibilidade garantida, use:
     - date-fns: 2.28.0 (exatamente esta versão)
     - @mui/x-date-pickers: 5.0.0-beta.7 (exatamente esta versão)

2. Para problemas com o date-fns e @mui/x-date-pickers:
   - Se você encontrar o erro: `Package path ./_lib/format/longFormatters is not exported from package`
   - Reconstrua o container com:
     ```bash
     docker-compose down
     docker-compose build --no-cache
     docker-compose up
     ```

3. Em alguns casos, pode ser necessário limpar completamente:
   ```bash
   # Remover todos os containers Docker
   docker-compose down
   
   # Remover a pasta node_modules local e o cache do npm
   rm -rf node_modules
   npm cache clean --force
   
   # Reconstruir a imagem sem usar o cache
   docker-compose build --no-cache
   
   # Iniciar o container
   docker-compose up
   ```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── Layout.js     # Layout principal com Sidebar e Header
│   ├── Sidebar.js    # Menu lateral de navegação
│   └── ...
├── pages/            # Páginas do sistema
│   ├── Dashboard.js  # Página inicial
│   ├── corretiva/    # Páginas de OS Corretiva
│   ├── planejada/    # Páginas de OS Planejada
│   └── relatorios/   # Páginas de Relatórios
├── App.js            # Configuração de rotas
└── index.js          # Ponto de entrada
```

## Fluxo de Trabalho

### OS Corretiva

1. Acesse "OS Corretiva" > "Nova"
2. Preencha as informações do equipamento, problema e prioridade
3. Selecione o técnico responsável
4. Adicione materiais necessários
5. Após a execução, registre o diagnóstico, ação tomada e peças utilizadas
6. Anexe fotos ou documentos relevantes
7. Finalize com a assinatura digital

### OS Planejada

1. Acesse "OS Planejada" > "Nova"
2. Selecione o equipamento, tipo de manutenção e periodicidade
3. Defina a data programada
4. Configure o checklist de atividades
5. Adicione os materiais previstos
6. Consulte o histórico de manutenções anteriores
7. Salve a ordem de serviço

## Consultas e Relatórios

- Utilize a seção "OS Corretiva" > "Consulta" para visualizar e filtrar ordens corretivas
- Acesse "OS Planejada" > "Calendário" para ver o cronograma de manutenções
- Gere relatórios através do menu "Relatórios", com opções por período, técnico ou equipamento

## Contribuição

Para contribuir com o projeto:

1. Crie um fork do repositório
2. Crie um branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.
