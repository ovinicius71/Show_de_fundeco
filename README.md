# Show de Fundeco — Quiz Interativo ao Vivo

Sistema de quiz em tempo real para apresentações em sala de aula, no estilo programa de auditório. O **apresentador** exibe a tela no projetor; os **alunos** entram pelo celular (via URL ou QR Code), votam em A/B/C/D e os resultados aparecem ao vivo. Ao final, um **pódio** mostra a classificação de todos.

A pontuação leva em conta a **velocidade**: acertar mais rápido vale mais pontos.

---

## Arquivos do projeto

| Arquivo | Para que serve |
|---|---|
| `index.html` | Página inicial com os dois acessos (apresentador / aluno) |
| `apresentador.html` | Tela de controle — projetor/PC. Única tela que controla o cronômetro e os botões |
| `aluno.html` | Tela do aluno — celular |
| `config.js` | **Credenciais do Firebase + perguntas + pontuação.** O único arquivo que você edita no dia a dia |
| `db.js` | Camada de sincronização em tempo real (Firebase ou modo de teste local) |
| `styles.css` | Sistema visual compartilhado (tema "palco de auditório") |
| `assets/logo.png` | Logo exibida nas telas |

---

## As telas (fluxo do apresentador)

1. **Sala de espera (lobby)** — aparece no início, **só para o apresentador**. Mostra o QR Code e os **nomes de todos os alunos** conforme eles entram. Um botão **▶ Iniciar** começa o quiz.
2. **Pergunta** — ao clicar em **Iniciar**, vai direto para a 1ª pergunta com a **votação já aberta e o cronômetro correndo** (não há passo manual de "iniciar votação"). As barras de voto crescem ao vivo.
3. **Resultado final** — na última pergunta o botão "Próxima" vira **"Ver resultado final ›"**, que exibe o **pódio (top 3)** e o **ranking completo com todos os alunos**.

O aluno tem a tela de **entrada** (digita o nome), a tela do **quiz** (vota e recebe feedback) e a tela de **encerramento** (mostra sua posição e o ranking da turma).

---

## ⚡ Teste rápido (modo demonstração, sem Firebase)

Dá para testar tudo **antes** de configurar o Firebase. Enquanto o `config.js` estiver com credenciais de exemplo (`COLE_...`), o sistema entra em **modo demonstração**: apresentador e aluno sincronizam entre **abas do mesmo navegador** (via `localStorage` + `BroadcastChannel`).

1. Abra `apresentador.html` em uma aba — você verá a **sala de espera**.
2. Abra `aluno.html` em outra aba (mesma janela/navegador), digite um nome e entre. O nome aparece na sala de espera.
3. Repita em mais abas para simular vários alunos, clique **Iniciar** e jogue.

> O modo demonstração **não** sincroniza entre celulares diferentes. Para uso real em sala, configure o Firebase (abaixo).

Para servir os arquivos localmente (recomendado, evita restrições de `file://`):

```bash
# Python 3
python -m http.server 8000
# depois acesse http://127.0.0.1:8000/apresentador.html
```

---

## Como a pontuação funciona

Definida em `config.js` e fácil de ajustar. Para **cada pergunta**, somente quem **acerta** ganha pontos:

```
pontos = PONTOS_ACERTO_BASE + PONTOS_TEMPO_MAX × (tempoRestante / TEMPO_PADRAO)
```

- **`PONTOS_ACERTO_BASE`** (padrão `500`) — garantido ao acertar, independe do tempo.
- **`PONTOS_TEMPO_MAX`** (padrão `500`) — bônus máximo, dado a quem responde instantaneamente.
- `tempoRestante` é quanto ainda faltava no cronômetro no momento do voto. Respondeu mais rápido → sobrou mais tempo → mais pontos.
- Quem **erra** ou **não vota** recebe **0**.

Exemplo (com `TEMPO_PADRAO = 30`): acertar faltando 30s ≈ **1000 pts**; acertar faltando 0s ≈ **500 pts**.

A contagem é feita ao **Revelar resposta** (e garantida ao **finalizar**, caso a última pergunta não tenha sido revelada). Cada pergunta é contabilizada **uma única vez**.

---

## Configuração do Firebase (uso real em sala)

### 1) Criar o projeto e obter as credenciais

1. Acesse <https://console.firebase.google.com> → **Adicionar projeto** (ex.: `quiz-sala`; pode desativar o Analytics).
2. Menu lateral: **Build → Realtime Database** → **Criar banco de dados**. Escolha um local (ex.: `us-central1`) e comece em **modo de teste**.
3. Registre um app **Web**: ícone **`</>`** na visão geral → dê um apelido → **registre**. Copie o objeto `firebaseConfig`:

   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "quiz-sala.firebaseapp.com",
     databaseURL: "https://quiz-sala-default-rtdb.firebaseio.com",
     projectId: "quiz-sala",
     storageBucket: "quiz-sala.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abc123"
   };
   ```

   > **Importante:** confira se o campo **`databaseURL`** aparece. Se não, o Realtime Database ainda não foi criado (volte ao passo 2). Esse campo é obrigatório.

### 2) Colar as credenciais

Abra **`config.js`** e substitua o objeto `firebaseConfig` no topo. Assim que os valores deixarem de ser os de exemplo, o sistema passa a usar o Firebase automaticamente — o canto da tela do apresentador mostra `modo: firebase`.

No mesmo `config.js` você também ajusta:
- `PERGUNTAS` — array com as perguntas do quiz.
- `NOME_DO_QUIZ` — título do quiz.
- `TEMPO_PADRAO` — duração da votação em segundos (padrão: `30`).
- `PONTOS_ACERTO_BASE` e `PONTOS_TEMPO_MAX` — fórmula de pontuação (ver acima).

### 3) Regras de segurança do Realtime Database

Para uma apresentação pontual, regras abertas bastam (**Realtime Database → Regras**):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> ⚠️ Isso libera leitura/escrita para qualquer um com a URL. Aceitável para uma aula curta. **Desative o banco ou troque as regras depois do uso.** Para algo duradouro, restrinja à sub-árvore `quiz/` e adicione validação/autenticação.

### 4) Hospedar no GitHub Pages

1. Crie um repositório e envie **todos** os arquivos para a raiz (`index.html`, `apresentador.html`, `aluno.html`, `config.js`, `db.js`, `styles.css`, `assets/`).
2. No repositório: **Settings → Pages**.
3. Em **Source**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`. Salve.
4. Após ~1 min, o GitHub mostra a URL pública:
   - Apresentador: `https://SEU-USUARIO.github.io/SEU-REPO/apresentador.html`
   - Aluno: `https://SEU-USUARIO.github.io/SEU-REPO/aluno.html`

O QR Code nas telas já aponta para o `aluno.html` correto — basta projetar e pedir que escaneiem.

---

## Passo a passo durante a apresentação

1. **Abra o apresentador** no PC/projetor. Confirme `modo: firebase` no canto superior. Aparece a **sala de espera**.
2. **Peça aos alunos** que escaneiem o **QR Code** (ou abram a URL do aluno). Cada um digita o nome e entra — o nome surge na sala de espera e o contador **"X conectados"** sobe.
3. Clique em **▶ Iniciar** → vai para a 1ª pergunta com a **votação aberta e o cronômetro correndo**.
4. Acompanhe as **barras de votos** ao vivo (número + percentual).
5. Clique em **Revelar resposta**:
   - A opção correta acende em **verde**; as erradas apagam.
   - Cada aluno vê **✓ Você acertou!** ou **✗ Você errou** no celular.
   - A pontuação (ponderada pelo tempo) é creditada e o **placar da turma** registra se a maioria acertou.
6. **Próxima pergunta ›** avança e **reabre a votação automaticamente**, repetindo o ciclo.
7. Na última pergunta, **Ver resultado final ›** mostra o **pódio** e o **ranking completo**.
8. **↺ Reiniciar quiz** volta para a sala de espera e limpa tudo para a próxima turma.

---

## Estrutura dos dados no Firebase

```
quiz/
  estado/
    quizIniciado:     false   sala de espera (false) ou quiz em andamento (true)
    quizFinalizado:   false   exibe a tela de resultado final quando true
    perguntaAtual:    0        índice da pergunta ativa
    votacaoAberta:    false    se os alunos podem votar
    respostaRevelada: false    se a resposta já foi revelada
    tempoRestante:    30       segundos restantes (escrito só pelo apresentador)
    sessao:           0        incrementa a cada reinício (invalida votos antigos)
  presenca/
    {userId}: { nome, ts }     presença online (nome p/ a sala de espera; ts p/ contar conectados)
  votos/
    {perguntaIndex}/ { A, B, C, D }   contadores de votos por opção
  respostas/
    {perguntaIndex}/ {userId}: { letra, restante }   voto do aluno + tempo restante (base do bônus)
  resultados/
    {perguntaIndex}: true|false   se a maioria acertou (placar da turma)
  pontuacao/
    {userId}: { nome, pontos }    pontuação acumulada (todos que entraram aparecem no ranking)
```

A identidade do aluno (`userId` + nome) fica no `localStorage` do celular; o voto é sempre registrado no banco. Se a página recarregar, o estado é recuperado e o voto já dado permanece travado.

---

## Perguntas — formato

Substitua o array `PERGUNTAS` em `config.js`. Cada item:

```js
{
  pergunta: "Texto da pergunta",
  opcoes: { A: "Opção A", B: "Opção B", C: "Opção C", D: "Opção D" },
  correta: "B"
}
```

As perguntas atuais são exemplos sobre **finanças públicas / fundamentos de economia** — troque pelas suas quando quiser.

---

## Dúvidas comuns

- **O contador de conectados não sobe / votos não aparecem entre celulares.** Você ainda está em modo demonstração. Confirme `modo: firebase` no apresentador e o `databaseURL` correto em `config.js`.
- **Erro `permission denied`.** Ajuste as regras do Realtime Database (seção 3).
- **Um aluno recarregou a página.** Sem problema: o estado vem do Firebase e o voto já dado continua travado.
- **Voto duplo.** Impedido: após votar, os botões travam e o voto não muda naquela pergunta.
- **Um aluno entrou mas nunca acertou.** Ele ainda aparece no ranking final com 0 pontos — todos que entraram são listados.
- **Os nomes somem da sala de espera.** A presença expira ~35s após o aluno parar de renovar (fechou a aba/celular). É renovada automaticamente a cada 15s enquanto a tela do aluno está aberta.
