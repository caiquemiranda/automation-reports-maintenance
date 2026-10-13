# Guia de UX e visualização de dados · IBSystems SDAI

Guia para o sistema de relatórios e monitoramento de detecção de incêndio
(histórico dos painéis TSW). Contém só o que se aplica aqui e está organizado
em decisões.

**Premissas de produto (respondidas por você)**
- **Acesso:** a V1 é interna. O banco já separa os dados por cliente; o portal do cliente vem depois.
- **Estrutura dos clientes:** há clientes com 1 site e clientes com vários sites ou painéis. Todos usam Simplex/TSW.
- **Perfis:** cada perfil tem uma entrada diferente. O administrador vê tudo e decide quem vê o quê.
- **Público:** diretoria, analistas e técnicos, em desktop, tablet e celular.

---

## 1. Arquitetura da informação e hierarquia visual

### Hierarquia de navegação: no máximo 3 níveis de página
```
Área (SDAI Analytics · Relatórios · Banco de dados)
  └─ Cliente (Bayer, Vinci…)
       └─ Detalhe (só no Banco: "Registros")
           ↳ daqui para baixo é FILTRO, não página: site → mês → categoria → nó → ponto → evento
```
- **Sidebar.** A sidebar mostra as áreas e, dentro de cada uma, os clientes. Assim se vai a qualquer cliente de qualquer área em 1 clique. Os clientes sem dados aparecem com marcador vazado.
- **Breadcrumbs.** Ficam sempre no topo (`Banco de dados › Bayer › Registros`) e respondem "onde estou".
- **A URL é o estado.** Tela + filtros ficam no endereço. Um diretor manda o link de "Bayer · janeiro · alarmes" e o colega vê exatamente o mesmo recorte.

### Ordem de leitura de uma página (do macro ao granular, de cima para baixo)
| Bloco | Pergunta que responde | Espaço (grid de 12 col. no desktop) |
|---|---|---|
| Cabeçalho da página | De quem, de onde, até quando são os dados? | 12 (título + painel + período + "há X dias") |
| Filtros globais | Qual recorte estou vendo? | 12, uma linha |
| 4 KPIs | Quanto? Subiu ou desceu? | 4 × 3 col. |
| Tendência | Como evoluiu? | 7–8 col. |
| Distribuição por nó | Onde concentra? | 4–5 col. |
| Mapa de calor dia × hora | Quando acontece? | 12 |
| Ranking de reincidência | Qual ponto resolver primeiro? | 12 |
| Tabela de eventos | Qual é o evento exato? | 12 |

Regras:
- **No máximo 4 KPIs.** Cada um é uma categoria acionável. O que não gera ação vai para a tabela.
- **Frescor do dado em destaque.** "Último evento há 4 dias" e o alerta "sem log novo há 40 dias" contam tanto quanto qualquer KPI. Dado velho apresentado como atual é o pior erro de um painel de monitoramento.
- **Ações principais à direita do título** ("Subir log", "Imprimir / PDF"). Só existe 1 botão primário por tela.

### Perfis e permissões (próxima etapa: login)
| Perfil | Entra em | Vê | Pode |
|---|---|---|---|
| Administrador | Visão geral de todos os clientes | Tudo | Criar usuários, atribuir clientes e perfis, importar logs, configurar categorias |
| Diretor | Relatórios do(s) seu(s) cliente(s) | Relatórios + Analytics | Exportar PDF |
| Analista | Analytics | Analytics + Banco | Importar logs, exportar CSV |
| Técnico | Falhas ativas (lista priorizada, mobile) | Analytics + lista de falhas | Consultar o histórico de um ponto |

- **O menu mostra só o que o perfil pode abrir.** Não exiba item desabilitado "sem permissão", porque isso só gera ruído.
- **O isolamento por cliente fica no backend.** Toda consulta filtra pelos clientes do usuário. Esconder na interface não é segurança.

---

## 2. Escolha de gráficos e data viz

### Pergunta → componente
| Pergunta | Use | Evite |
|---|---|---|
| Quantos alarmes no período? Mudou? | **Número grande + variação % com seta e texto** ("▲ 23% vs. mês anterior") | Velocímetro/gauge, donut de 1 valor |
| Como evoluiu no tempo? | **Barras empilhadas** por categoria (dia; semana se > 3 meses) | Linha suavizada (inventa valores entre pontos), área 3D |
| Em qual nó/painel concentra? | **Barras horizontais ordenadas** | Pizza (18 nós ficam ilegíveis) |
| Em que dia/hora acontece? | **Mapa de calor** dia × hora, escala de 1 matiz | Escala arco-íris |
| Qual ponto reincide? | **Tabela-ranking com barra embutida** na célula | Gráfico de bolhas |
| Comparar meses | **Tabela mensal** com barras embutidas e variação | Gráfico com 2 eixos Y |
| Comparar clientes (futuro) | **Taxa normalizada** (eventos por 100 dispositivos) | Contagem absoluta entre clientes de tamanhos diferentes |

### Distorções a evitar (específicas destes dados)
- **Eixo Y de barras sempre começa em zero.**
- **Meses parciais** (início e fim do log) ficam marcados como "parcial" e fora da comparação. O relatório já faz isso.
- **Período anterior de mesmo tamanho:** a variação compara janelas iguais, e some quando não há dados antes.
- **Eventos operacionais** (reconhecimentos, resets, sirenes ON/OFF) ficam ocultos por padrão. Eles são 74% do log e afogariam os sinais.
- **Duplicados de painel:** um mesmo incidente aparece em vários nós ao mesmo tempo. Ao contar "incidentes" (próxima melhoria), agrupe por janela de tempo em vez de somar eventos.
- **Horário:** o log usa o relógio do painel e não tem fuso. Diga isso no gráfico e nunca converta.

### Relação dado-tinta (data-ink)
- **Remover:** bordas e sombras dentro de gráficos, linhas verticais de grade, 3D, gradientes, ícones decorativos, rótulo em toda barra.
- **Manter:**
  - grade horizontal clara;
  - legenda só quando há 2 séries ou mais;
  - rótulos diretos quando há até 4 séries;
  - números tabulares, para os dígitos se alinharem;
  - tooltip com os valores exatos;
  - alternativa "Ver tabela".
- **Título informa a pergunta** ("Quando os eventos acontecem"). Quando houver texto de insight, ele vai no subtítulo.
- **Cor só codifica categoria.** Destaque da marca (verde-água) é para a interface, nunca para dado.

---

## 3. Interação, filtros e drill-down

### Filtros
- **Globais** (cliente, período, site, nó, categoria, estado, busca):
  - ficam numa única linha no topo e valem para a página toda;
  - ficam gravados na URL;
  - mostram o contador "N eventos no recorte atual";
  - oferecem "Limpar filtros" quando há algo ativo.
- **Contextuais** valem só para o card onde estão: abas de categoria no ranking, "Ver tabela" num gráfico.
- **Período** tem atalhos (mês, 7 dias, 30 dias, Tudo) e um intervalo personalizado. O "mês" é o recorte mais usado no relatório gerencial.

### Drill-down (do número ao evento, sem se perder)
```
KPI "Alarmes 551" ──clique──► filtro categoria=incêndio
Barra "Nó 13"     ──clique──► filtro nó=13
Mês no Relatório  ──clique──► Analytics com aquele mês
Ponto no ranking  ──clique──► tabela de eventos filtrada pelo endereço
Linha no Banco    ──clique──► bloco original do TSW
```
- **Drill-down é filtro, não troca de página.** O contexto (cabeçalho, KPIs) continua visível.
- **Cada passo entra no histórico:** "voltar" desfaz o último filtro. Digitar na busca não cria entradas.
- **O estado ativo fica visível.** O KPI selecionado ganha borda, o filtro aparece preenchido e o contador mostra o recorte.

### Carregando (loading)
- **Esqueleto com a forma do conteúdo** (cards, gráfico, tabela), nunca uma tela branca com um spinner.
- **Ao paginar ou filtrar, mantenha os dados anteriores** semitransparentes até chegar a resposta, para a tela não piscar.
- **Operações longas dizem o que está acontecendo**, por exemplo "Gravando só os registros novos…".

### Estados vazios e erros (cada um com próximo passo)
| Situação | Mensagem | Ação |
|---|---|---|
| Cliente sem dados | "Ainda não há dados de Vedacit" | Importar o primeiro log |
| Filtro sem resultado | "Nenhum evento corresponde aos filtros" | Limpar filtros / ampliar período |
| Dado desatualizado | "Sem log novo há 40 dias" | Subir log |
| Erro de servidor | Mensagem em linguagem humana | Tentar de novo |
| Importação ambígua | "Painel BSB não cadastrado. É um novo site?" | Confirmar / cancelar |
| Importação perigosa | "Este log pertence à Bayer. Nada foi importado." | Escolher outro arquivo |

---

## 4. Carga cognitiva e acessibilidade

### Cor semântica (validada para daltonismo)
| Categoria | Cor | Ícone | Observação |
|---|---|---|---|
| Alarme de incêndio | vermelho | chama | Vermelho é reservado: só incêndio e erro |
| Supervisão anormal | violeta | medidor | |
| Falha de dispositivo | âmbar | círculo cortado | Texto em âmbar escuro próprio (contraste) |
| Falha de sistema | azul | triângulo | |
| Operacional | cinza | info | Some por padrão |

- **A ordem de empilhamento** (incêndio → supervisão → dispositivo → falha) foi escolhida para que cores vizinhas sejam distinguíveis em protanopia, deuteranopia e tritanopia. Ela foi validada com o validador da skill de dataviz nos modos claro e escuro.
- **Cor nunca sozinha.** Toda categoria leva ícone + texto, e a tabela é o equivalente acessível de cada gráfico.
- **Contraste:** texto ≥ 4,5:1 e elementos gráficos ≥ 3:1. Sobre fundo tingido, o texto usa um tom escuro próprio da categoria.
- **Modo escuro** com tokens próprios, sem inversão automática.

### Tipografia e respiro
- **Família:** uma só (sans do sistema).
- **Escala curta:** 11 · 12 · 13 · 14 · 15 · 20–24 · 32 (KPI).
- **Hierarquia por peso e tamanho**, não por cor. Números sempre tabulares.
- **Dados do TSW em MAIÚSCULAS** (como vêm do painel); a interface usa caixa normal, o que separa "dado" de "sistema".
- **Espaçamento em múltiplos de 4 px:**
  - 16–20 px entre cards;
  - 20 px de margem interna;
  - linhas de tabela de 32–36 px.
- **Densidade:** confortável no dashboard, compacta nas tabelas. Agrupe no máximo cerca de 7 itens por bloco.

### Teclado e leitores de tela
- **Navegação:**
  - tudo é alcançável por teclado, com foco visível;
  - Esc fecha menus e diálogos;
  - "Pular para o conteúdo".
- **Anúncios para leitores de tela:**
  - o contador do recorte é anunciado (`aria-live`);
  - as tabelas informam a ordenação (`aria-sort`);
  - o diálogo prende e devolve o foco.
- **Movimento reduzido** é respeitado (`prefers-reduced-motion`).

---

## 5. Comportamento responsivo

| Largura | Navegação | Grade |
|---|---|---|
| ≥ 1280 px | Sidebar fixa (recolhível em ícones) | KPIs 4 col.; tendência + nós lado a lado |
| 1024–1279 | Sidebar fixa | KPIs 2 col.; gráficos empilhados |
| 768–1023 | Gaveta (☰) | 2 col. |
| < 768 | Gaveta (☰); breadcrumbs só com os 2 últimos níveis | 1 col.; filtros recolhidos atrás de "Filtros (n)" |

- **Prioridade no celular (técnico em campo):** KPIs → ranking de reincidência → eventos. Os gráficos continuam, mas vêm depois.
- **Tabelas largas rolam na horizontal dentro do card** (a página nunca rola de lado).
  - Hoje: a descrição é truncada, com o texto completo no título; colunas secundárias vêm por último.
  - Próximo: na lista de falhas do técnico, usar cartões em vez de tabela, um por ponto com estado, local e "há quanto tempo".
- **Alvos de toque ≥ 36–40 px.** Nada depende só de hover: o tooltip também abre no toque e todo gráfico tem "Ver tabela".

---

## O que já está aplicado × próximos passos

| Item | Status |
|---|---|
| Sidebar áreas → clientes, breadcrumbs, URL como estado | ✅ |
| Cards de clientes com frescor do dado | ✅ |
| Analytics por cliente com drill-down e "voltar" que desfaz | ✅ |
| Relatórios: resumo mensal com meses parciais marcados | ✅ |
| Banco: resumo, integridade, prévia, todos os registros, subir log com salvaguardas | ✅ |
| Paleta validada para daltonismo, modo escuro, teclado, mobile | ✅ |
| Linha do tempo de semana a 1 min, zoom por clique/arraste, período com hora | ✅ |
| Análise de dispositivo (calendário, intermitência, quem falha junto) e comparação | ✅ |
| Investigação de falhas de laço: episódios × quem deu sinal antes | ✅ |
| Login, perfis e permissões por cliente (admin decide) | ⏭ próxima etapa |
| Lista de "falhas ativas" para técnicos (estado atual por ponto) | ⏭ |
| Agrupamento de alarmes em incidentes | ⏭ |
| Relatório mensal em PDF com o layout gerencial da IBSystems | ⏭ |
| Comparação entre clientes por taxa normalizada | ⏭ |
