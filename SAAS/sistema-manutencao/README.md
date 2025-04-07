# Sistema de Manutenção Industrial Simplificado

Um sistema de gerenciamento de ordens de serviço para manutenção industrial.

## Características

- Dashboard com visão geral
- Gerenciamento de Ordens de Serviço Corretivas
- Consulta de Ordens de Serviço

## Tecnologias Utilizadas

- React.js
- Material UI
- Styled Components
- React Router

## Executando com Docker (Simplificado)

### Requisitos

- Docker
- Docker Compose

### Como Executar

1. No diretório do projeto, execute:

```bash
docker-compose up
```

2. Acesse o aplicativo manualmente no navegador:
   - http://localhost:3000

3. Para parar os containers:

```bash
docker-compose down
```

### Solução de Problemas

Se você não conseguir acessar o aplicativo em http://localhost:3000, verifique:

1. Se o container está em execução:
```bash
docker ps
```

2. Os logs do container para identificar erros:
```bash
docker logs sistema-manutencao
```

3. Se houver problemas, tente recriar o container:
```bash
# Remover containers existentes
docker-compose down

# Reconstruir sem cache
docker-compose build --no-cache

# Iniciar novamente
docker-compose up
```

## Estrutura do Projeto (Simplificada)

```
src/
├── components/       # Componentes reutilizáveis
│   ├── Layout.js     # Layout principal
│   ├── Sidebar.js    # Menu lateral
│   └── ...
├── pages/            # Páginas do sistema
│   ├── Dashboard.js  # Página inicial
│   └── corretiva/    # Páginas de OS Corretiva
├── App.js            # Configuração de rotas
└── index.js          # Ponto de entrada
```

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.
