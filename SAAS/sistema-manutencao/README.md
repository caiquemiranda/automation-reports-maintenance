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
cd sistema-manutencao
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
