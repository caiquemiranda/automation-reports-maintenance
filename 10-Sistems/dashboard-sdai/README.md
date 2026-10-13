# IBSystems · SDAI

Sistema de relatórios e monitoramento de detecção de incêndio a partir do
histórico dos painéis TSW (Simplex), por cliente.

- **SDAI Analytics**: painel de cada cliente com alarmes, falhas de dispositivo, supervisão e falhas de sistema, filtros na URL, drill-down e comparação com o período anterior.
  - **Linha do tempo de semana até 1 minuto.** Clique numa barra para aproximar ou arraste para selecionar um trecho. "Afastar" volta um nível. O período aceita hora (ex.: 17/09 das 07:30 às 12:15).
  - **Filtro de dispositivo.** Com um dispositivo, o painel de análise mostra:
    - o calendário de todo o histórico (clique no dia para ver minuto a minuto);
    - o tempo entre ocorrências, que indica comportamento intermitente;
    - a maior rajada em 1 h;
    - quem "falha junto".
    Com vários dispositivos, eles aparecem lado a lado numa linha do tempo.
  - **Investigação de falhas** (aba).
    - Detecta episódios: cascata no laço (3+ dispositivos sem resposta em até 2 min), falha de placa, falha de terra e nó fora da rede.
    - Mostra quem deu sinal **antes** de cada episódio no mesmo nó (janela de 1 h a 72 h), com a linha do tempo do episódio.
    - Ranqueia os suspeitos que aparecem antes de mais episódios.
- **Relatórios**: resumo mês a mês de cada cliente (base do relatório gerencial).
- **Banco de dados**: histórico armazenado por cliente → site (painel). Mostra integridade, prévia, todos os registros e o envio de log novo, que grava só o que é novo.

Clientes: Vinci Airports, Vedacit, Bridgestone, Bayer e Boulevard Shopping.
**Como analisar os dados (passo a passo para técnicos e analistas): [docs/como-analisar.md](docs/como-analisar.md).**
Guia de UX e data viz do projeto: [docs/guia-ux.md](docs/guia-ux.md).

## Rodando

Requer **Node ≥ 22.13** (usa o SQLite embutido no Node, sem dependência nativa).

**Um comando só** (instala as dependências na 1ª vez, sobe backend + dashboard e abre o navegador):

```bash
npm run app
```

No Windows também dá para dar **dois cliques em `iniciar.cmd`**. Ctrl+C (ou fechar a janela) encerra tudo.

| Comando | O que faz |
|---|---|
| `npm run app` | desenvolvimento: backend (porta 3001) + dashboard Vite (5173, ou a próxima livre); recarrega ao salvar |
| `npm run app:prod` | compila o dashboard e serve tudo pelo backend em http://127.0.0.1:3001 |
| `npm run app -- --no-open` | não abre o navegador |
| `npm run app -- --check` | sobe tudo, confere que dashboard e API respondem, e encerra |

Se o backend já estiver rodando, o script reaproveita o que está no ar. Rodar as
partes separadas continua possível: `npm run server` (API) e `npm run dev` (dashboard).

Variáveis: `PORT` (3001), `HOST` (127.0.0.1; use `0.0.0.0` para expor na rede, **não há login**),
`SDAI_DB` (caminho do banco, padrão `db/sdai.sqlite`).

### Banco pela linha de comando

```bash
npm run db:import -- --client bayer data/log.txt   # importa só o que é novo (aceita vários arquivos)
npm run db:check -- --client bayer                 # integridade: buracos na sequência do TSW
npm run db:stats                                   # clientes, sites e totais
```

Opções do import: `--site <id>` para um arquivo sem cabeçalho num cliente com vários sites, e
`--novo-site` para confirmar o cadastro de um painel novo do cliente.

## Clientes, sites e painéis

O cabeçalho do log identifica o painel (`MONSANTO · 212TSW02`), e cada painel
pertence a um único cliente:

- **1º log de um cliente**: o site é cadastrado automaticamente a partir do cabeçalho.
- **Painel novo num cliente que já tem site** (ex.: outro aeroporto da Vinci): o sistema pede confirmação antes de cadastrar.
- **Log de um painel de outro cliente**: bloqueado, nada é importado. Isso evita misturar o histórico de clientes.
- **Arquivo sem cabeçalho** (cortado à mão): vai direto para o site, se o cliente tiver um só; se tiver vários, o sistema pergunta qual.

## Como a deduplicação funciona

Todo registro do log vai para o banco (inclusive os operacionais). A análise do
que aparece no dashboard é feita na leitura (`src/lib/classify.js`).

- **Identidade de um evento** = nº de sequência do TSW + data/hora + nó + descrição.
  - O nº sozinho não serve: o TSW recomeça a numeração a cada volume do histórico.
  - O conteúdo sozinho também não: há eventos legítimos idênticos no mesmo segundo
    (vários `TROUBLE GLOBAL ACKNOWLEDGE`), diferenciados só pelo nº.
- **Reimportar** o mesmo log ou um log que se sobrepõe ao anterior: os existentes são ignorados.
- **Evento cortado** no fim de um arquivo (sem a linha de tipo/estado) é completado quando o próximo log chegar; nunca é "rebaixado".
- **Renumeração** do TSW (mesmos eventos com outro nº) é detectada pelo conteúdo, e o arquivo é realinhado antes de comparar.
- **Integridade**: dentro de um volume o TSW numera em sequência, então todo buraco
  na sequência é um registro que nunca chegou. A importação e `db:check` mostram isso.

Tabelas:
- `clients`;
- `sites` (um por painel);
- `events` (um registro por evento, único por site, com o bloco original em `raw` para reprocessar no futuro);
- `imports` (histórico: arquivo, lidos, novos, existentes, avisos).

Um banco da versão anterior (sem clientes) é migrado sozinho, e o histórico vai para a Bayer.

## Testes

```bash
npm test                 # parser, classificação, agregações, ingestão no banco e API
npm run test:incremental # corta data/log.txt em 10 partes (data/partes/) e alimenta um banco novo
npm run validate         # confere o parser contra data/log.txt e o CSV do etl.py
```

Cenários de ingestão testados com o log real (21.193 eventos):
- 10 partes em ordem;
- fora de ordem e repetidas;
- downloads acumulados;
- janelas sobrepostas;
- cortes no meio de eventos;
- log renumerado;
- novo volume.

## Estrutura

```
server/
  app.js           API HTTP (node:http, sem framework) + arquivos de dist/
  index.js         sobe o servidor
  db.js            schema SQLite (clientes → sites → eventos), consultas, integridade, migração
  ingest.js        importação incremental (dedup, completar, renumeração, volumes, site pelo cabeçalho)
  cli.js           db:import / db:check / db:stats
src/
  App.jsx          layout (sidebar + topo) e rotas
  pages/           ClientsGrid, AnalyticsPage, InvestigationPage, ReportsPage, DatabasePage, DbEventsPage
  components/      layout/ (Sidebar, Topbar), Dashboard e seus blocos, UploadDialog, ui/*
  lib/
    parser.js      .txt do TSW -> eventos  ← usado pelo front e pelo backend
    classify.js    regra de negócio: estado/tipo -> categoria   ← edite aqui para mudar a classificação
    aggregate.js   filtros (com hora), KPIs, série temporal em escalas (semana → 1 min), mapa de calor, reincidência
    device.js      perfil de um dispositivo: calendário, intervalos, rajadas, quem falha junto
    investigate.js episódios (cascata/placa/terra/nó) e precursores/suspeitos
    router.js      roteador mínimo (History API); filterParams.js filtros ⇄ URL
    api.js         cliente da API (com cache por cliente)
  assets/brand/    logo IBSystems em SVG (vetorizada da imagem original) e ícone "iB"
docs/guia-ux.md    guia de UX/data viz
data/etl.py        mesma gramática em Python/pandas (uso offline / análise)
```

## Rotas

| Tela | Endereço |
|---|---|
| Cards de clientes de cada área | `/analytics`, `/relatorios`, `/banco` |
| Painel do cliente (filtros na URL: `?de=&hde=&ate=&hate=&dev=&cat=&no=&site=&estado=&q=&op=1&escala=`) | `/analytics/bayer` |
| Análise de um dispositivo num dia | `/analytics/bayer?de=2026-09-17&ate=2026-09-17&dev=13:M1-38-0` |
| Investigação de falhas (`?de=&ate=&tipo=&ant=24h&no=&ep=`) | `/analytics/bayer/investigacao` |
| Resumo mensal | `/relatorios/bayer` |
| Banco do cliente (`?upload=1` abre o envio de log) | `/banco/bayer` |
| Todos os registros (paginado no servidor) | `/banco/bayer/eventos` |

## API

| Rota | O que faz |
|---|---|
| `GET /api/clients` | clientes com sites, totais, período e última importação |
| `GET /api/clients/:cliente` | idem + resumo de integridade |
| `GET /api/clients/:cliente/events?from=&to=` | todos os eventos (colunar), para o Analytics |
| `GET /api/clients/:cliente/events/page?page=&size=&q=&site=&order=` | página de registros com busca |
| `GET /api/clients/:cliente/imports` | histórico de importações |
| `POST /api/clients/:cliente/imports` | corpo = texto do log. Cabeçalhos: `X-File-Name`, `X-Site-Id`, `X-Create-Site: 1`. Conflitos respondem 409 com `code` (`other-client`, `unknown-panel`, `site-required`) |
| `GET /api/clients/:cliente/integrity` | volumes, buracos na sequência e conflitos por site |

## Categorias

| Categoria | Critério |
|---|---|
| Alarme de incêndio | estado `FIRE ALARM` |
| Falha de dispositivo | `NO ANSWER`, `BAD ANSWER`, `HEAD MISSING`, `WRONG DEVICE` |
| Supervisão anormal | tipo `SUPERVISORY MONITOR` com estado `ABNORMAL` |
| Falha de sistema | demais estados de trouble (rede, terra, energia, circuito aberto, desabilitação, sujeira…) e CRASH/SHUTDOWN do TSW |
| Operacional | ON/OFF, acknowledge, reset, silenciar, pontos de utilidade e o pseudo-ponto agregado `SYSTEM PSEUDO STATUS` (oculto por padrão) |

## Formato do log

Cada evento é um bloco de 2–5 linhas (descrição, data + nó, tipo + estado). O
parser trata descrições quebradas em várias linhas, data sem nó, `NODE 0` sem
parênteses, detalhes livres (operador/licença/áudio), a linha de crash do SO e
cabeçalhos/`VOLUME:` repetidos no meio do arquivo. Data/hora são "relógio de
parede" (o log não tem fuso), então não há conversão.
