// Escolher o 'elemento' do PC
let elementsArray = ["Pedra", "Papel", "Tesoura"];
function randomNumber() {
  return elementsArray[Math.floor(Math.random() * elementsArray.length)];
}

// Pegar o elemento do usuario atraves do argv e declarar as variaveis
const userPick = process.argv[2];
const pcPick = randomNumber();
let winnerMsg = "";

if (userPick === "Pedra") {
  if (pcPick === "Papel") {
    winnerMsg = `Você escolheu ${userPick} e o computador escolheu ${pcPick}. Ganhou!`;
  } else if (pcPick === "Tesoura") {
    winnerMsg = `Você escolheu ${userPick} e o computador escolheu ${pcPick}. Perdeu!`;
  }
  console.log(winnerMsg);
}

if (userPick === "Papel") {
  if (pcPick === "Pedra") {
    winnerMsg = `Você escolheu ${userPick} e o computador escolheu ${pcPick}. Ganhou!`;
  } else if (pcPick === "Tesoura") {
    winnerMsg = `Você escolheu ${userPick} e o computador escolheu ${pcPick}. Perdeu!`;
  }
  console.log(winnerMsg);
}

if (userPick === "Tesoura") {
  if (pcPick === "Papel") {
    winnerMsg = `Você escolheu ${userPick} e o computador escolheu ${pcPick}. Ganhou!`;
  } else if (pcPick === "Pedra") {
    winnerMsg = `Você escolheu ${userPick} e o computador escolheu ${pcPick}. Perdeu!`;
  }
  console.log(winnerMsg);
}

if (userPick === pcPick) {
  // cenario 4 'empate'
  console.log(
    `Você escolheu ${userPick} e o computador escolheu ${pcPick}. Empate!`
  );
}
