# Ordem de Serviço Corretiva

Este projeto consiste em uma aplicação para gerenciamento de Ordens de Serviço Corretivas, com frontend em React e backend em FastAPI.

## Estrutura do Projeto

- `src/` - Código fonte do frontend React
- `backend/` - Código fonte do backend FastAPI
- `public/` - Arquivos públicos do frontend

## Requisitos

### Execução Local
- Node.js >= 14
- npm >= 6
- Python >= 3.8
- pip

### Execução com Docker
- Docker
- Docker Compose

## Execução com Docker

### Construir e iniciar os containers
```bash
docker-compose up -d --build
```

### Parar os containers
```bash
docker-compose down
```

### Ver logs dos containers
```bash
# Todos os containers
docker-compose logs -f

# Container específico
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Acessar a aplicação
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Documentação da API: http://localhost:8000/docs

## Execução Local

### Instalação Frontend

```bash
# Instala as dependências do frontend
npm install
```

### Instalação Backend

```bash
# Instala as dependências do backend
npm run install-backend
```

### Desenvolvimento (Frontend + Backend)

```bash
# Inicia tanto o frontend quanto o backend
npm run dev
```

### Frontend apenas

```bash
# Inicia apenas o frontend
npm start
```

### Backend apenas

```bash
# Inicia apenas o backend
npm run start-backend
```

## Build para Produção

```bash
# Gera a build de produção do frontend
npm run build
```

## Funcionalidades

- Criação e edição de ordens de serviço
- Upload de anexos com imagens
- Salvamento de documentos no banco de dados
- Visualização de documentos em modo somente leitura
- Impressão de documentos

## API Backend

A API está disponível em `http://localhost:8000/api` e a documentação interativa em `http://localhost:8000/docs`.

### Principais endpoints:

- `GET /api/documentos` - Lista todos os documentos
- `GET /api/documentos/{id}` - Obtém um documento específico
- `POST /api/documentos` - Cria um novo documento
- `PUT /api/documentos/{id}` - Atualiza um documento existente
- `DELETE /api/documentos/{id}` - Exclui um documento
- `POST /api/documentos/{id}/anexos` - Adiciona um anexo a um documento

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
