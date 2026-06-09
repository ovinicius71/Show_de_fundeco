/* ============================================================================
   CONFIG.JS  —  Edite SOMENTE este arquivo no dia a dia.
   ============================================================================
   Dois blocos importantes:
     1) firebaseConfig  -> credenciais do seu projeto Firebase
     2) PERGUNTAS       -> o conteúdo do quiz
   ----------------------------------------------------------------------------
   Enquanto o firebaseConfig estiver com os valores de exemplo ("COLE_..."),
   o sistema roda em MODO DEMONSTRAÇÃO: apresentador e aluno conversam entre
   ABAS DO MESMO NAVEGADOR (sem Firebase). Isso serve para você testar tudo
   antes de configurar o Firebase. Para usar em sala (celulares dos alunos),
   é obrigatório preencher o firebaseConfig real.
   ========================================================================== */


/* -------------------------------------------------------------------------- */
/* 1) CREDENCIAIS DO FIREBASE                                                  */
/*    Firebase Console > ⚙ Configurações do projeto > Seus apps > Config SDK  */
/* -------------------------------------------------------------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyDYnirksxGfBd3a_T8kIzH2nBi8stZDqZM",
  authDomain: "show-de-fundeco.firebaseapp.com",
  databaseURL: "https://show-de-fundeco-default-rtdb.firebaseio.com",
  projectId: "show-de-fundeco",
  storageBucket: "show-de-fundeco.firebasestorage.app",
  messagingSenderId: "374542099558",
  appId: "1:374542099558:web:22f1e6022db7d1df67f9a7",
  measurementId: "G-X9RTYY1EM1"
};


/* -------------------------------------------------------------------------- */
/* 2) PERGUNTAS DO QUIZ                                                        */
/*    Para trocar pelas perguntas reais, basta substituir este array inteiro. */
/*    Formato de cada item:                                                    */
/*      { pergunta, opcoes: { A, B, C, D }, correta: "A" | "B" | "C" | "D" }   */
/* -------------------------------------------------------------------------- */
const PERGUNTAS = [
  {
    pergunta: "Qual das funções econômicas do setor público está associada ao fornecimento de bens públicos e à correção de externalidades na produção ou consumo?",
    opcoes: {
      A: "Função estabilizadora",
      B: "Função distributiva",
      C: "Função alocativa",
      D: "Função de crescimento econômico"
    },
    correta: "C"
  },
  {
    pergunta: "O princípio da neutralidade na teoria da tributação estabelece que um bom tributo deve:",
    opcoes: {
      A: "Distribuir seu ônus de forma justa entre os indivíduos",
      B: "Ser cobrado de acordo com a capacidade de pagamento de cada agente",
      C: "Não alterar os preços relativos, minimizando a interferência nas decisões econômicas",
      D: "Vincular o pagamento ao benefício marginal recebido pelo contribuinte"
    },
    correta: "C"
  },
  {
    pergunta: "De acordo com o princípio da capacidade de pagamento, quais são as medidas utilizadas para auferir essa capacidade?",
    opcoes: {
      A: "Renda, consumo e patrimônio",
      B: "Lucro, juros e dividendos",
      C: "Salário, aposentadoria e herança",
      D: "Importações, exportações e poupança"
    },
    correta: "A"
  },
  {
    pergunta: "Uma estrutura tributária é considerada regressiva quando:",
    opcoes: {
      A: "Todos os contribuintes pagam a mesma parcela de imposto em relação à sua renda",
      B: "A alíquota aumenta à medida que a renda do contribuinte aumenta",
      C: "Quanto maior a renda do contribuinte, menor a tributação em proporção à sua renda",
      D: "O imposto incide apenas sobre artigos de luxo"
    },
    correta: "C"
  },
  {
    pergunta: "Sobre a Curva de Lafer, o capítulo afirma que, a partir de determinado nível da alíquota, qualquer elevação da taxa:",
    opcoes: {
      A: "Aumenta proporcionalmente a arrecadação global",
      B: "Resulta em redução da arrecadação global, devido à evasão, à elisão e ao desestímulo aos negócios",
      C: "Mantém a arrecadação constante indefinidamente",
      D: "Torna o imposto automaticamente progressivo"
    },
    correta: "B"
  },
  {
    pergunta: "O efeito anticíclico do imposto progressivo sobre a renda disponível, que freia o consumo em cenários inflacionários e alivia a carga na recessão, é também chamado de:",
    opcoes: {
      A: "Imposto inflacionário",
      B: "Equivalência ricardiana",
      C: "Estabilizador automático",
      D: "Monetização da dívida"
    },
    correta: "C"
  },
  {
    pergunta: "O déficit operacional do setor público é medido pelo:",
    opcoes: {
      A: "Déficit primário acrescido dos juros reais da dívida passada",
      B: "Déficit nominal acrescido da correção monetária e cambial",
      C: "Total de gastos públicos correntes menos a emissão de moeda",
      D: "Saldo da dívida pública em um dado instante do tempo"
    },
    correta: "A"
  }
];


/* -------------------------------------------------------------------------- */
/* 3) NOME DO QUIZ (aparece no cabeçalho das telas) — opcional                */
/* -------------------------------------------------------------------------- */
const NOME_DO_QUIZ   = "DESAFIO RELÂMPAGO";
const TEMPO_PADRAO   = 30; // segundos da votação

/* -------------------------------------------------------------------------- */
/* 4) PONTUAÇÃO — resposta certa vale mais quanto mais rápido o aluno responde */
/*    Fórmula por pergunta (só para quem ACERTA):                              */
/*        pontos = PONTOS_ACERTO_BASE + PONTOS_TEMPO_MAX * (tRestante / TEMPO)  */
/*    Acertar garante a base; o bônus é proporcional ao tempo que ainda        */
/*    restava no cronômetro no instante do voto (respondeu mais rápido →       */
/*    sobrou mais tempo → ganha mais). Quem erra ou não vota recebe 0.         */
/* -------------------------------------------------------------------------- */
const PONTOS_ACERTO_BASE = 500; // garantido ao acertar (independe do tempo)
const PONTOS_TEMPO_MAX   = 500; // bônus máximo (resposta instantânea)


/* -------------------------------------------------------------------------- */
/* Utilitário: detecta se o Firebase já foi configurado de verdade.           */
/* (Não precisa editar nada daqui para baixo.)                                */
/* -------------------------------------------------------------------------- */
function firebaseEstaConfigurado() {
  return (
    typeof firebaseConfig.databaseURL === "string" &&
    firebaseConfig.databaseURL.indexOf("COLE_SEU") === -1 &&
    firebaseConfig.apiKey.indexOf("COLE_SUA") === -1
  );
}
