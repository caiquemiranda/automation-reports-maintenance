# Ordem de Serviço Corretiva - IBSystems

Este projeto implementa um sistema de Ordem de Serviço Corretiva para a IBSystems. A aplicação permite criar, editar e imprimir ordens de serviço para manutenção corretiva de equipamentos.

## Funcionalidades

- Preenchimento dinâmico de informações da OS
- Campos editáveis in-line
- Upload de imagens como anexos
- Impressão da OS
- Interface amigável para preenchimento rápido

## Como executar o projeto

1. Certifique-se de ter o Node.js instalado (versão 14 ou superior)
2. Clone este repositório
3. Instale as dependências:
   ```
   npm install
   ```
4. Execute o projeto em modo de desenvolvimento:
   ```
   npm start
   ```
5. Acesse a aplicação em: http://localhost:3000

## Estrutura do Projeto

```
src/
├── components/
│   └── common/           # Componentes reutilizáveis
│       ├── ActionButton.js
│       ├── EditableField.js
├── contexts/             # Contextos para gerenciamento de estados
│   └── OrdemServicoContext.js
├── hooks/                # Hooks personalizados
│   └── useDocumentActions.js
├── pages/                # Páginas da aplicação
│   └── OrdemServico/     # Página principal da OS
│       ├── components/   # Componentes específicos da OS
│       └── index.js      # Componente principal da página
├── App.js                # Componente raiz
└── index.js              # Ponto de entrada
```

## Tecnologias utilizadas

- React.js
- Context API para gerenciamento de estados
- CSS em módulos para estilos isolados
- HTML5 semântico

## Como imprimir a OS

1. Preencha todos os campos necessários
2. Clique no botão "Imprimir" no topo da página
3. Configure a impressora conforme necessário
4. Confirme a impressão

## Como salvar a OS

A funcionalidade de salvar ainda será implementada em versões futuras.

## Boas práticas implementadas

- Componentes altamente coesos e com baixo acoplamento
- Uso de Context API para gerenciamento de estado global
- Componentes reutilizáveis para partes comuns da interface
- CSS modularizado em arquivos separados para cada componente
- Hooks personalizados para lógica de negócio
- Organização em pastas seguindo padrões da comunidade React

## Customização

O projeto pode ser facilmente customizado ajustando os valores iniciais no OrdemServicoContext, ou modificando os estilos CSS conforme necessário.

---

Desenvolvido para IBSystems - Intelligent Building 