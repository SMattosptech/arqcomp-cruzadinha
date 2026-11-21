const tabuleiro = document.getElementById("tabuleiro");
const contador = document.getElementById("contador");
const mensagem = document.getElementById("mensagem");
const enunciado = document.getElementById("enunciado");
const tipoPista = document.getElementById("tipo-pista");
const numeroPista = document.getElementById("numero-pista");
const statusPista = document.getElementById("status-pista");
const casas = {};
const botoes = [];
let selecionada = 0;

function chave(linha, coluna) { return linha + "-" + coluna; }
function coordenadas(palavra, posicao) {
  return { linha: palavra.row + (palavra.dir === "down" ? posicao : 0), coluna: palavra.col + (palavra.dir === "across" ? posicao : 0) };
}

function prepararTabuleiro() {
  for (let linha = 0; linha < PUZZLE.rows; linha++) {
    for (let coluna = 0; coluna < PUZZLE.cols; coluna++) {
      const casa = document.createElement("div");
      casa.className = "casa vazia";
      tabuleiro.appendChild(casa);
    }
  }

  PUZZLE.entries.forEach((palavra) => {
    for (let i = 0; i < palavra.word.length; i++) {
      const pos = coordenadas(palavra, i);
      const id = chave(pos.linha, pos.coluna);
      if (!casas[id]) {
        const casa = document.createElement("div");
        casa.className = "casa";
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.autocomplete = "off";
        input.spellcheck = false;
        input.dataset.linha = pos.linha;
        input.dataset.coluna = pos.coluna;
        input.setAttribute("aria-label", "Linha " + (pos.linha + 1) + ", coluna " + (pos.coluna + 1));
        input.addEventListener("input", aoDigitar);
        input.addEventListener("focus", () => selecionarPorCasa(pos.linha, pos.coluna));
        input.addEventListener("keydown", aoUsarSetas);
        casa.appendChild(input);
        casas[id] = { elemento: casa, input: input, palavras: [] };
      }
      casas[id].palavras.push(PUZZLE.entries.indexOf(palavra));
    }
    const inicio = chave(palavra.row, palavra.col);
    const celula = casas[inicio];
    if (!celula.elemento.querySelector(".numero")) {
      const numero = document.createElement("span");
      numero.className = "numero";
      numero.textContent = palavra.number;
      celula.elemento.appendChild(numero);
    }
  });

  Object.keys(casas).forEach((id) => {
    const partes = id.split("-");
    const indice = Number(partes[0]) * PUZZLE.cols + Number(partes[1]);
    tabuleiro.children[indice].replaceWith(casas[id].elemento);
  });
}

function criarBotoesPistas() {
  PUZZLE.entries.forEach((palavra, indice) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "pista-botao";
    botao.textContent = palavra.number + " · " + (palavra.dir === "across" ? "H" : "V");
    botao.title = palavra.clue;
    botao.addEventListener("click", () => selecionarPalavra(indice, true));
    const lista = document.getElementById(palavra.dir === "across" ? "pistas-horizontais" : "pistas-verticais");
    lista.appendChild(botao);
    botoes[indice] = botao;
  });
}

function selecionarPalavra(indice, focarCasa) {
  selecionada = indice;
  const palavra = PUZZLE.entries[indice];
  tipoPista.textContent = palavra.dir === "across" ? "HORIZONTAL" : "VERTICAL";
  numeroPista.textContent = "PISTA " + palavra.number;
  enunciado.textContent = palavra.clue;
  atualizarStatus(indice);
  botoes.forEach((botao, i) => botao.classList.toggle("ativa", i === indice));
  Object.values(casas).forEach((casa) => casa.elemento.classList.remove("selecionada"));
  for (let i = 0; i < palavra.word.length; i++) {
    const pos = coordenadas(palavra, i);
    const casa = casas[chave(pos.linha, pos.coluna)];
    casa.elemento.classList.add("selecionada");
  }
  if (focarCasa) {
    const inicio = coordenadas(palavra, 0);
    casas[chave(inicio.linha, inicio.coluna)].input.focus();
  }
}

function selecionarPorCasa(linha, coluna) {
  const casa = casas[chave(linha, coluna)];
  if (!casa) return;
  let indice = casa.palavras.includes(selecionada) ? selecionada : casa.palavras[0];
  selecionarPalavra(indice, false);
}

function aoDigitar(evento) {
  evento.target.value = evento.target.value.toUpperCase().replace(/[^A-Z]/g, "");
  if (evento.target.value.length > 1) evento.target.value = evento.target.value[0];
  const linha = Number(evento.target.parentElement.querySelector("input").dataset.linha);
  const coluna = Number(evento.target.parentElement.querySelector("input").dataset.coluna);
  const palavra = PUZZLE.entries[selecionada];
  const posicao = palavra.dir === "across" ? coluna - palavra.col : linha - palavra.row;
  const proxima = coordenadas(palavra, Math.min(posicao + 1, palavra.word.length - 1));
  if (evento.target.value && (posicao + 1) < palavra.word.length) casas[chave(proxima.linha, proxima.coluna)].input.focus();
  limparResultadoVisual(selecionada);
  atualizarStatus(selecionada);
}

function aoUsarSetas(evento) {
  const linha = Number(evento.target.dataset.linha);
  const coluna = Number(evento.target.dataset.coluna);
  let destino = null;
  if (evento.key === "ArrowRight") destino = casas[chave(linha, coluna + 1)];
  if (evento.key === "ArrowLeft") destino = casas[chave(linha, coluna - 1)];
  if (evento.key === "ArrowDown") destino = casas[chave(linha + 1, coluna)];
  if (evento.key === "ArrowUp") destino = casas[chave(linha - 1, coluna)];
  if (evento.key === "Backspace" && evento.target.value === "") destino = casas[chave(linha, coluna - 1)];
  if (destino) { evento.preventDefault(); destino.input.focus(); }
}

function respostaDaPalavra(indice) {
  const palavra = PUZZLE.entries[indice];
  let resposta = "";
  for (let i = 0; i < palavra.word.length; i++) {
    const pos = coordenadas(palavra, i);
    resposta += casas[chave(pos.linha, pos.coluna)].input.value;
  }
  return resposta.toUpperCase();
}

function atualizarStatus(indice) {
  const resposta = respostaDaPalavra(indice);
  const palavra = PUZZLE.entries[indice];
  const acertou = palavra.conferida && resposta === palavra.word;
  if (palavra.conferida && acertou) {
    statusPista.textContent = "Resposta correta!";
    statusPista.className = "status certa";
  } else if (palavra.conferida) {
    statusPista.textContent = "Ainda não está correta. Revise e tente novamente.";
    statusPista.className = "status errada";
  } else {
    statusPista.textContent = "Aguardando conferência";
    statusPista.className = "status";
  }
}

function limparResultadoVisual(indice) {
  const palavra = PUZZLE.entries[indice];
  palavra.conferida = false;
  palavra.correta = false;
  botoes[indice].classList.remove("certa", "errada");
  palavra.word.split("").forEach((letra, i) => {
    const pos = coordenadas(palavra, i);
    casas[chave(pos.linha, pos.coluna)].elemento.classList.remove("certa", "errada");
  });
  atualizarContador();
}

function conferirPalavra(indice) {
  const palavra = PUZZLE.entries[indice];
  const resposta = respostaDaPalavra(indice);
  palavra.conferida = true;
  palavra.correta = resposta === palavra.word;
  botoes[indice].classList.toggle("certa", palavra.correta);
  botoes[indice].classList.toggle("errada", !palavra.correta);
  for (let i = 0; i < palavra.word.length; i++) {
    const pos = coordenadas(palavra, i);
    const casa = casas[chave(pos.linha, pos.coluna)];
    casa.elemento.classList.remove("certa", "errada");
    casa.elemento.classList.add(palavra.correta ? "certa" : "errada");
  }
  atualizarContador();
  selecionarPalavra(indice, false);
  if (palavra.correta) mensagem.textContent = "Muito bem! Essa palavra está correta. Escolha a próxima pista.";
  else mensagem.textContent = "Ainda não! A resposta não foi revelada. Revise as letras desta palavra e confira novamente.";
}

function atualizarContador() {
  const acertos = PUZZLE.entries.filter((palavra) => palavra.correta).length;
  contador.textContent = acertos + " de " + PUZZLE.entries.length;
  if (acertos === PUZZLE.entries.length) mensagem.textContent = "Parabéns! Você completou toda a cruzadinha.";
}

function conferirTodas() {
  PUZZLE.entries.forEach((palavra, indice) => conferirPalavra(indice));
  selecionarPalavra(selecionada, false);
  const acertos = PUZZLE.entries.filter((palavra) => palavra.correta).length;
  mensagem.textContent = acertos === PUZZLE.entries.length ? "Parabéns! Você completou toda a cruzadinha." : acertos + " de " + PUZZLE.entries.length + " palavras corretas. Selecione uma incorreta para tentar novamente.";
}

function reiniciar() {
  Object.values(casas).forEach((casa) => {
    casa.input.value = "";
    casa.elemento.classList.remove("certa", "errada", "selecionada");
  });
  PUZZLE.entries.forEach((palavra, indice) => {
    palavra.conferida = false;
    palavra.correta = false;
    botoes[indice].classList.remove("certa", "errada", "ativa");
  });
  contador.textContent = "0 de " + PUZZLE.entries.length;
  mensagem.textContent = "Selecione uma pista para ver o enunciado.";
  tipoPista.textContent = "NENHUMA SELECIONADA";
  numeroPista.textContent = "";
  enunciado.textContent = "A pista escolhida aparecerá aqui.";
  statusPista.textContent = "Aguardando resposta";
  statusPista.className = "status";
  selecionada = 0;
}

document.getElementById("conferir-palavra").addEventListener("click", () => conferirPalavra(selecionada));
document.getElementById("conferir-todas").addEventListener("click", conferirTodas);
document.getElementById("reiniciar").addEventListener("click", reiniciar);

prepararTabuleiro();
criarBotoesPistas();
selecionarPalavra(0, false);
