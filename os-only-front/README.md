# Ordem de Serviço Corretiva - IBSystems

Este projeto implementa um sistema de Ordem de Serviço Corretiva para a IBSystems. A aplicação permite criar, editar e imprimir ordens de serviço para manutenção corretiva de equipamentos.

## Funcionalidades

- Preenchimento dinâmico de informações da OS
- Campos editáveis in-line
- Upload de imagens como anexos
- Impressão da OS
- Interface amigável para preenchimento rápido

## Como executar o projeto

### Ambiente com restrições de segurança

Se você estiver em um ambiente com restrições de segurança que não permitem a execução de scripts npm, você pode:

1. Instalar o Live Server no VS Code (se disponível)
2. Abrir o arquivo `public/index.html` com o Live Server
3. Ou simplesmente abrir o arquivo `public/index.html` em um navegador

### Ambiente sem restrições

1. Certifique-se de ter o Node.js instalado (versão 14 ou superior)
2. Execute os seguintes comandos para permitir a execução de scripts (como administrador):
   ```
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Instale as dependências:
   ```
   npm install
   ```
4. Execute o projeto em modo de desenvolvimento:
   ```
   npm start
   ```
5. Acesse a aplicação em: http://localhost:3000

## Resolução de problemas

Se você encontrar o erro `'react-scripts' não é reconhecido como um comando interno`, isso significa que:

1. As dependências não foram instaladas corretamente (execute `npm install`)
2. Pode haver restrições de segurança no PowerShell (execute `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`)
3. Como alternativa, use a abordagem "Ambiente com restrições de segurança" acima

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