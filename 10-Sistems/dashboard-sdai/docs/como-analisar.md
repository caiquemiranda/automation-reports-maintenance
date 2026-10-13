# Como analisar os dados no SDAI

Guia prático de investigação usando o que o sistema já mostra: o que olhar
primeiro, como chegar do número geral ao evento exato e como interpretar o que
aparece. Os exemplos usam dados reais da Bayer (nó 13, detector `13:M1-38-0`).

> Os endereços entre crases (ex.: `/analytics/bayer?dev=13:M1-38-0`) podem ser
> colados no navegador depois de `http://localhost:5173`. Todo filtro fica no
> endereço, então qualquer tela pode ser salva nos favoritos ou enviada a um colega.

---

## 1. Antes de analisar: confie no dado

Abra **Banco de dados → cliente** e confira três coisas:

| O que conferir | Onde | Se estiver errado |
|---|---|---|
| **Período coberto** e "último evento há X dias" | cartão *Período coberto* | Se passou de ~35 dias, o cartão do cliente avisa "Sem log novo". Exporte um log novo do TSW antes de tirar conclusões sobre o mês atual. |
| **Integridade** | cartão *Integridade* | "N registros faltando" = buracos na numeração do TSW. A análise fica incompleta nesse trecho: importe um log que cubra o período. |
| **Última importação** | *Histórico de importações* | Avisos em âmbar (arquivo cortado, numeração deslocada) merecem leitura antes de seguir. |

Para enviar um log: **Subir novo log**. Só os registros novos entram, então reenviar não duplica.

---

## 2. Os três caminhos de análise

| Pergunta | Caminho | Seção |
|---|---|---|
| "Como foi o mês do cliente?" | Relatórios → mês → Abrir no Analytics | [3](#3-visão-do-mês-relatório-gerencial) |
| "Esse dispositivo está ruim? Desde quando? Como falha?" | Analytics → filtro **Dispositivo** | [4](#4-falha-intermitente-de-um-dispositivo) |
| "O laço/placa caiu: quem causou?" | Analytics → aba **Investigação de falhas** | [5](#5-queda-de-laço-ou-falha-de-placa-quem-avisou-antes) |

---

## 3. Visão do mês (relatório gerencial)

1. **Relatórios → cliente.** A tabela mostra cada mês com as 4 categorias e a variação contra o mês anterior.
   - Meses marcados **parcial** (início e fim do log) não cobrem o mês inteiro. **Não compare** esses meses.
2. **Abrir no Analytics** no mês desejado. O painel abre já filtrado para o mês.
3. Leia de cima para baixo:
   - **Cartões (KPIs):** quantidade por categoria, quantos dispositivos e a variação contra o período anterior de mesmo tamanho.
   - **Eventos ao longo do tempo:** existe pico? É um dia isolado ou uma tendência?
   - **Eventos por nó:** onde concentra.
   - **Quando os eventos acontecem:** dia da semana × hora. Concentração em horário de expediente sugere intervenção humana (manutenção, testes). Madrugada sugere causa ambiental ou falha de equipamento.
   - **Reincidência por ponto:** a lista de ação. Os primeiros de cada aba são onde a manutenção rende mais.
4. Para o relatório: **Imprimir / PDF** (o layout de impressão esconde os controles) ou **Exportar CSV** no log de eventos.

### O que cada categoria significa

| Categoria | Entra aqui | Leitura |
|---|---|---|
| **Alarme de incêndio** | estado `FIRE ALARM` | Detector, acionador ou zona em alarme. Muitos alarmes no mesmo ponto sem ocorrência real = suspeita de alarme falso (sujeira, poeira, vapor, posição do detector). |
| **Falha de dispositivo** | `NO ANSWER`, `BAD ANSWER`, `HEAD MISSING`, `WRONG DEVICE` | O dispositivo não conversa direito com o painel. É a categoria central para problemas de laço. |
| **Supervisão anormal** | `SUPERVISORY MONITOR` em `ABNORMAL` | Válvulas, chaves de fluxo, bombas e painéis supervisionados fora da posição normal. |
| **Falha de sistema** | demais troubles (rede, terra, energia, circuito aberto/curto, desabilitado, sujeira…) | Problemas de infraestrutura e de manutenção. |
| **Operacional** (oculto) | reconhecimentos, resets, silenciar, sirenes ON/OFF, pontos de utilidade | Cerca de 74% do log. Ligue em **Ocultar operacional** só para reconstruir a sequência de um atendimento (quem reconheceu, quando resetou). |

> **Os cartões ignoram o filtro de categoria.** Eles servem para escolher a categoria: clique num cartão para filtrar só ela e clique de novo para voltar.

---

## 4. Falha intermitente de um dispositivo

Use quando um ponto aparece muito na **Reincidência** ou quando a equipe de
campo relata "vai e volta".

### Passo a passo

1. **Escolha o dispositivo.** Pode ser:
   - clicando no endereço em *Reincidência por ponto* ou no *Log de eventos*;
   - pelo filtro **Dispositivo** (aceita busca por endereço ou descrição; a lista vem ordenada pelo número de ocorrências);
   - colando o endereço direto: `/analytics/bayer?dev=13:M1-38-0`.
2. Leia o painel **Análise do dispositivo**:

   | Indicador | Como ler |
   |---|---|
   | **Comportamento intermitente** (selo) | Mais da metade das ocorrências vem a menos de 5 min da anterior: a falha "pisca". |
   | **Dias com ocorrência** × histórico | Poucos dias com muitas ocorrências = episódios agudos. Muitos dias espalhados = problema crônico. |
   | **Maior rajada em 1 hora** | O pior momento, com data e hora: comece a investigação por ele. |
   | **Intervalo típico** | Mediana entre ocorrências seguidas. Algo em torno de 30 s indica que o painel acusa a cada varredura, ou seja, a falha é contínua naquele intervalo. |
   | **Histórico completo** (calendário) | Cada quadrado é um dia. Mostra se começou num dia específico, se piora com o tempo ou se tem padrão semanal. |
   | **Tempo entre ocorrências seguidas** | A distribuição dos intervalos. Barras altas em "< 1 min" e "1–5 min" indicam intermitência; em "1–7 dias", eventos isolados. |
   | **Falham junto** | Outros dispositivos do **mesmo nó** com ocorrência até 2 min antes ou depois. Percentual alto = provavelmente o mesmo trecho de fiação. |

3. **Clique no pior dia do calendário.** A linha do tempo passa a mostrar aquele dia em blocos de 15 min.
4. **Clique na barra** do momento crítico para aproximar (15 min → 1 min), ou **arraste** sobre o gráfico para selecionar um trecho. **Afastar** volta um nível (horas → dia → mês → tudo), e o botão voltar do navegador também desfaz.
5. **Compare com os vizinhos.** Em *Falham junto*, use o **+** para adicionar dispositivos. A **Comparação de dispositivos** mostra uma faixa por dispositivo: quem começa a falhar primeiro e se as falhas andam juntas.

### Exemplo real (Bayer)

`/analytics/bayer?de=2026-09-17&ate=2026-09-17&dev=13:M1-38-0`

- No dia 17/09, o `13:M1-38-0` fica quase sem ocorrências até ~07:30. Depois disso vem uma sequência contínua de `BAD ANSWER`, um a cada ~30 s, até ~12:15: falha permanente naquele período.
- No histórico ele soma 1.109 ocorrências em 34 dias, com 813 intervalos abaixo de 1 min. É intermitência crônica, não um evento isolado.
- Em 08/12, o `13:M1-36-0` falha nos mesmos instantes (~04:45 e ~06:50): `?de=2025-12-08&ate=2025-12-08&dev=13:M1-38-0,13:M1-36-0`.

### O que os estados costumam indicar (para orientar a vistoria)

| Estado | Indício mais comum | O que verificar em campo |
|---|---|---|
| `BAD ANSWER` | Comunicação corrompida, com resposta inválida. | Base e encaixe do detector, bornes, emendas, umidade na caixa, ruído na fiação. Se for intermitente, quase sempre é mau contato. |
| `NO ANSWER` | O dispositivo não respondeu à varredura. | Dispositivo removido ou queimado, fio rompido, trecho do laço sem alimentação. Vários ao mesmo tempo = laço caiu (seção 5). |
| `HEAD MISSING` | Cabeça do detector fora da base. | Detector retirado (obra, limpeza) ou mal encaixado. |
| `WRONG DEVICE` | Tipo instalado diferente do programado. | Troca de dispositivo sem atualizar a programação. |
| `DIRTY` / `EXCESSIVELY DIRTY` | Câmara do detector contaminada. | Limpeza ou troca. Tende a evoluir para alarme falso. |
| `OPEN CIRCUIT TROUBLE` / `SHORT CIRCUIT TROUBLE` | Circuito supervisionado aberto ou em curto. | Fim de linha, fiação da zona, módulo. |
| `DISABLE TROUBLE` | Ponto desabilitado manualmente. | Normalmente é manutenção. Confira se já devia ter sido reabilitado. |
| `EARTH GROUND` (Falha de terra) | Fuga para a terra no nó. | Isolação de cabo danificada, cabo encostado em eletrocalha ou estrutura, umidade. Costuma andar junto com falhas de laço. |
| `CARD TROUBLE STATUS` | Trouble numa placa do nó. | Pode ser a placa do laço reagindo a um curto ou abertura na fiação (seção 5). |
| `NODE MISSING` | O nó saiu da rede. | Problema de rede ou energia do nó. Em geral não é causa de falha no laço. |

> Esses indícios orientam a vistoria. Quem confirma a causa é o teste em campo.

---

## 5. Queda de laço ou falha de placa: quem avisou antes?

Quando um curto num equipamento derruba o laço, vários dispositivos ficam
**sem resposta** ao mesmo tempo. Esses são **consequência**. O suspeito é
quem já falhava de forma intermitente **antes** da queda.

### Passo a passo

1. **Analytics → cliente → aba Investigação de falhas**: `/analytics/bayer/investigacao`
2. **Escolha o recorte:**
   - **Período:** todo o histórico ou um mês.
   - **Tipos de episódio** (o número ao lado de cada tipo é quantos existem):
     - **Cascata no laço**: 3 ou mais dispositivos do mesmo laço sem resposta em até 2 min. É a queda de laço "clássica".
     - **Falha de placa**: trouble de placa no nó (episódios a menos de 30 min de distância viram um só).
     - **Falha de terra**: fuga para a terra no nó.
     - **Nó fora da rede**: desligado por padrão, porque é problema de rede e não de laço.
   - **Olhar para trás:** 1 h, 6 h, **24 h** (padrão) ou 72 h antes de cada episódio.
   - **Nó:** foque num nó específico.
3. **Leia "Quem dá sinal antes das falhas".** Para cada dispositivo:
   - **Antes de X de Y episódios do nó:** em que fração das quedas daquele nó ele já estava falhando antes. É a coluna mais importante.
   - **Sinais:** quantas ocorrências ele teve nessas janelas.
   - **Analisar:** abre a análise do dispositivo (seção 4).
4. **Abra um episódio** na lista. Em *Detalhe do episódio*:
   - **A linha do tempo** mostra uma faixa por dispositivo, a **linha tracejada** no início do episódio e a **faixa sombreada** com a janela olhada para trás.
   - Em cascatas, o selo **"1º a cair", "2º a cair"…** mostra a ordem de queda.
   - **Deram sinal antes:** quantos sinais, quanto tempo antes da queda e com quais estados.
   - **Abrir no painel** leva o trecho e os dispositivos para a Visão geral, onde dá para descer até o minuto.

### Como interpretar

| O que aparece | Leitura provável |
|---|---|
| Um dispositivo aparece antes de **muitos** episódios do nó | Principal suspeito: inspecione primeiro, mesmo que ele não seja o que "mais falha". |
| Vários dispositivos dão sinal juntos, só pouco antes da queda | Trecho de fiação comum a todos (emenda, caixa de passagem). Compare-os na linha do tempo. |
| Nenhum sinal antes, só a queda | Evento súbito: dano mecânico, obra, curto franco. Procure registros de intervenção naquele horário. |
| Sinais de dispositivos em **modo instalação** ou **desabilitados** antes da queda | Provavelmente manutenção em andamento (ex.: Bayer, 11/08 às 12:21). Não é falha espontânea. |
| Falha de terra recorrente no mesmo nó | Isolação comprometida: costuma preceder ou acompanhar quedas de laço. |
| Em cascata, o mesmo dispositivo é sempre o "1º a cair" | Ele está mais perto do ponto do problema na fiação. |

> **Ajuste a janela.**
> - **1 h a 6 h** destaca quem falha imediatamente antes: a melhor janela para curto que evolui rápido.
> - **24 h a 72 h** pega degradação lenta (umidade, oxidação), mas inclui mais ruído.
>
> Compare as duas: quem continua no topo nas duas é o suspeito mais forte.

### Exemplo real (Bayer)

- Com 24 h de janela, o `13:M1-38-0` aparece antes de **13 dos 82** episódios de placa do nó 13. O `13:M1-22-0` aparece antes de 10.
- O episódio de **11/08/2026 às 12:21** (falha de placa no nó 13) foi precedido, ~1 h 20 min antes, por `OPEN CIRCUIT TROUBLE` nos detectores de feixe 52/53/54/56. Eles estavam em modo instalação: provável intervenção de manutenção.

---

## 6. Receitas rápidas

| Quero… | Faça |
|---|---|
| Os alarmes de janeiro | Relatórios → Janeiro → Abrir no Analytics → cartão *Alarme de incêndio* |
| Só um nó | Clique na barra do nó em *Eventos por nó* (ou filtro **Nó**) |
| Um horário exato | Datas + **hora** no filtro de período (ex.: 17/09, das 07:30 às 12:15) |
| Ver minuto a minuto | Escolha um dia e clique na barra, ou escala **1 min** (disponível para períodos curtos) |
| Ver um dispositivo no tempo todo | Filtro **Dispositivo** sem data: calendário + linha do tempo semanal |
| Comparar dois detectores | Filtro **Dispositivo** com os dois, ou o **+** em *Falham junto* |
| Achar o causador de quedas | Aba **Investigação de falhas** → ranking de suspeitos |
| Reconstruir um atendimento | Desligue **Ocultar operacional** e filtre o dia/horário |
| Enviar a análise a alguém | Copie o endereço do navegador (ele guarda todos os filtros) |
| Dados brutos | **Exportar CSV** no Log de eventos, ou *Banco de dados → Ver todos os registros* (clique numa linha para ver o bloco original do TSW) |
| Desfazer um zoom | **Afastar**, ou o botão voltar do navegador |

---

## 7. Cuidados na leitura

- **Relógio do painel:** as horas são as do TSW, sem fuso. Nós diferentes podem ter alguns segundos de diferença entre si, então ordens de queda separadas por menos de ~10 s não são conclusivas.
- **Não há "retorno ao normal" no log:** o histórico do TSW registra as falhas, não quando elas acabaram. Duração é estimada pelo intervalo entre a primeira e a última ocorrência.
- **Meses parciais** (início e fim do log) não entram em comparação.
- **Período anterior:** a variação dos cartões compara com a janela imediatamente anterior de mesmo tamanho. Num período muito curto (minutos), ela oscila muito.
- **Contagem ≠ gravidade:** um ponto com 1.000 `BAD ANSWER` pode ser um único problema contínuo, enquanto 3 alarmes em pontos diferentes podem ser 3 incidentes. Use *Dias com ocorrência* e o calendário para separar as duas coisas.
- **Suspeito não é culpado:** o ranking mostra **correlação no tempo**. Confirme em campo antes de trocar equipamento.
- **Ordem do endereço ≠ ordem do cabo:** `13:M1-38-0` não está necessariamente fisicamente perto de `13:M1-37-0`. Para localizar o trecho, use a sequência real de instalação do laço (as-built).
