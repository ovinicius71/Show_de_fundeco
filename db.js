/* ============================================================================
   DB.JS  —  Camada de acesso a dados em tempo real.
   ============================================================================
   Expõe um objeto global `RTDB` com uma API simples e única:

       RTDB.onValue(caminho, callback)  -> escuta mudanças; retorna função p/ parar
       RTDB.get(caminho)                -> Promise com o valor atual
       RTDB.set(caminho, valor)         -> grava um valor
       RTDB.update(caminho, objeto)     -> atualiza vários campos de uma vez
       RTDB.remove(caminho)             -> apaga um nó
       RTDB.transaction(caminho, fn)    -> leitura+escrita atômica (ex.: somar voto)
       RTDB.onDisconnectRemove(caminho) -> remove o nó quando o cliente cai
       RTDB.modo                        -> "firebase" ou "local"

   Se o Firebase estiver configurado (config.js), usa o Firebase Realtime
   Database. Caso contrário, cai num banco LOCAL (localStorage + BroadcastChannel)
   que sincroniza apenas entre abas do MESMO navegador — perfeito para testar.
   O restante do código (apresentador.html / aluno.html) usa a mesma API nos
   dois casos, sem saber qual está ativa.
   ========================================================================== */

const RTDB = (function () {

  /* ----------------------- Implementação FIREBASE ----------------------- */
  function criarFirebaseRTDB() {
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    return {
      modo: "firebase",
      onValue(caminho, cb) {
        const ref = database.ref(caminho);
        const handler = ref.on("value", (snap) => cb(snap.val()));
        return () => ref.off("value", handler);
      },
      async get(caminho) {
        const snap = await database.ref(caminho).get();
        return snap.val();
      },
      set(caminho, valor)        { return database.ref(caminho).set(valor); },
      update(caminho, objeto)    { return database.ref(caminho).update(objeto); },
      remove(caminho)            { return database.ref(caminho).remove(); },
      transaction(caminho, fn)   { return database.ref(caminho).transaction(fn); },
      onDisconnectRemove(caminho){ return database.ref(caminho).onDisconnect().remove(); }
    };
  }

  /* ------------------------ Implementação LOCAL ------------------------- */
  /* Guarda toda a árvore de dados num único item do localStorage e avisa as
     outras abas por BroadcastChannel. Imita o suficiente da API do Firebase. */
  function criarLocalRTDB() {
    const CHAVE = "quiz_local_db_v1";
    const canal = ("BroadcastChannel" in window)
      ? new BroadcastChannel("quiz_local_db_v1")
      : null;
    const ouvintes = []; // { caminho, cb }

    const lerTree   = () => { try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) { return {}; } };
    const salvarTree= (t) => localStorage.setItem(CHAVE, JSON.stringify(t));

    function getNo(tree, caminho) {
      if (!caminho) return tree;
      let no = tree;
      for (const p of caminho.split("/").filter(Boolean)) {
        if (no == null || typeof no !== "object") return null;
        no = no[p];
      }
      return no === undefined ? null : no;
    }
    function setNo(tree, caminho, valor) {
      const partes = caminho.split("/").filter(Boolean);
      let no = tree;
      for (let i = 0; i < partes.length - 1; i++) {
        const p = partes[i];
        if (typeof no[p] !== "object" || no[p] == null) no[p] = {};
        no = no[p];
      }
      const ultima = partes[partes.length - 1];
      if (valor === null || valor === undefined) delete no[ultima];
      else no[ultima] = valor;
    }
    function notificar() {
      const tree = lerTree();
      ouvintes.forEach((o) => o.cb(getNo(tree, o.caminho)));
    }
    function commit(tree) {
      salvarTree(tree);
      notificar();
      if (canal) canal.postMessage(Date.now());
    }
    if (canal) canal.onmessage = () => notificar();
    // também reage quando outra aba escreve no localStorage:
    window.addEventListener("storage", (e) => { if (e.key === CHAVE) notificar(); });

    return {
      modo: "local",
      onValue(caminho, cb) {
        const o = { caminho, cb };
        ouvintes.push(o);
        cb(getNo(lerTree(), caminho)); // disparo inicial imediato
        return () => { const i = ouvintes.indexOf(o); if (i >= 0) ouvintes.splice(i, 1); };
      },
      get(caminho) { return Promise.resolve(getNo(lerTree(), caminho)); },
      set(caminho, valor) {
        const t = lerTree(); setNo(t, caminho, valor); commit(t); return Promise.resolve();
      },
      update(caminho, objeto) {
        const t = lerTree();
        Object.keys(objeto).forEach((k) => setNo(t, caminho + "/" + k, objeto[k]));
        commit(t); return Promise.resolve();
      },
      remove(caminho) {
        const t = lerTree(); setNo(t, caminho, null); commit(t); return Promise.resolve();
      },
      transaction(caminho, fn) {
        const t = lerTree();
        const novo = fn(getNo(t, caminho));
        setNo(t, caminho, novo === undefined ? getNo(t, caminho) : novo);
        commit(t); return Promise.resolve();
      },
      onDisconnectRemove() { return Promise.resolve(); } // sem efeito no modo local
    };
  }

  /* --------------------------- Decisão final ---------------------------- */
  try {
    if (firebaseEstaConfigurado() && typeof firebase !== "undefined") {
      return criarFirebaseRTDB();
    }
  } catch (e) {
    console.warn("[RTDB] Falha ao iniciar o Firebase — caindo no modo local.", e);
  }
  console.info("[RTDB] Modo DEMONSTRAÇÃO (local). Configure o Firebase em config.js para uso em sala.");
  return criarLocalRTDB();

})();
