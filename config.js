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
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


/* -------------------------------------------------------------------------- */
/* 2) PERGUNTAS DO QUIZ                                                        */
/*    Para trocar pelas perguntas reais, basta substituir este array inteiro. */
/*    Formato de cada item:                                                    */
/*      { pergunta, opcoes: { A, B, C, D }, correta: "A" | "B" | "C" | "D" }   */
/* -------------------------------------------------------------------------- */
const PERGUNTAS = [
  {
    pergunta: "Em economia, o conceito de \u201cescassez\u201d se refere a:",
    opcoes: {
      A: "Falta de dinheiro no banco central",
      B: "Recursos limitados diante de necessidades ilimitadas",
      C: "A aus\u00eancia total de um produto no mercado",
      D: "Um excesso de oferta de determinado bem"
    },
    correta: "B"
  },
  {
    pergunta: "Pela lei da demanda, mantidas as demais condi\u00e7\u00f5es constantes, quando o pre\u00e7o de um bem sobe, a quantidade demandada tende a:",
    opcoes: {
      A: "Aumentar",
      B: "Permanecer exatamente igual",
      C: "Diminuir",
      D: "Dobrar imediatamente"
    },
    correta: "C"
  },
  {
    pergunta: "O custo de oportunidade de uma escolha \u00e9 melhor definido como:",
    opcoes: {
      A: "O valor pago em impostos sobre a compra",
      B: "O total de dinheiro gasto na transa\u00e7\u00e3o",
      C: "O valor da melhor alternativa que foi abandonada",
      D: "O lucro l\u00edquido obtido no neg\u00f3cio"
    },
    correta: "C"
  }
];


/* -------------------------------------------------------------------------- */
/* 3) NOME DO QUIZ (aparece no cabeçalho das telas) — opcional                */
/* -------------------------------------------------------------------------- */
const NOME_DO_QUIZ   = "DESAFIO RELÂMPAGO";
const TEMPO_PADRAO   = 30; // segundos da votação


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
