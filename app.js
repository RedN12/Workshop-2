const VALOR_BASE = 100.0;
const DESCONTO_ESTUDANTE = 0.20;

const form = document.getElementById("inscricao-form");
const nomeInput = document.getElementById("nome");
const idadeInput = document.getElementById("idade");
const estudanteInput = document.getElementById("estudante");
const mensagemEl = document.getElementById("mensagem");
const totalInscritosEl = document.getElementById("total-inscritos");
const totalArrecadadoEl = document.getElementById("total-arrecadado");
const listaInscritosEl = document.getElementById("lista-inscritos");

const inscritos = [];

function calcularValorInscricao(isEstudante) {
  // BUG #2: Em vez de aplicar 20% de desconto (VALOR_BASE * (1 - DESCONTO_ESTUDANTE)),
  // o código está somando 20% no valor base.
  if (isEstudante) {
    return VALOR_BASE * (1 + DESCONTO_ESTUDANTE);
  }
  return VALOR_BASE;
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function atualizarInterface() {
  totalInscritosEl.textContent = inscritos.length;

  listaInscritosEl.innerHTML = "";
  inscritos.forEach((item) => {
    const li = document.createElement("li");
    const tagEstudante = item.estudante ? "Estudante" : "Padrão";
    li.textContent = `${item.nome} (${item.idade} anos) — ${tagEstudante} — ${formatarMoeda(item.valor)}`;
    listaInscritosEl.appendChild(li);
  });

  // BUG #3: O total arrecadado não é recalculado/atualizado na tela
  // quando novos inscritos entram (fica preso em R$ 0,00).
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = nomeInput.value.trim();
  const idade = Number(idadeInput.value);
  const estudante = estudanteInput.checked;

  // BUG #1: Falta validar idade mínima de 16 anos (e idade inválida <= 0).
  // Aceita qualquer número digitado no campo de idade.
  if (!nome) {
    mensagemEl.textContent = "Informe o nome do participante.";
    mensagemEl.className = "mensagem erro";
    return;
  }

  if (idade < 16) {
    mensagemEl.textContent = "O participante deve ter pelo menos 16 anos.";
    mensagemEl.className = "mensagem erro";
    return;
  }

  const valor = calcularValorInscricao(estudante);
  inscritos.push({ nome, idade, estudante, valor });

  atualizarInterface();

  mensagemEl.textContent = "Inscrição adicionada com sucesso!";
  mensagemEl.className = "mensagem sucesso";

  form.reset();
  nomeInput.focus();
});
