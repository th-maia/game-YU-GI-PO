const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
  playerSides: {
    player1: "player-cards",
    player1BOX: document.querySelector(".card-box.framed#player-cards"),
    computerBOX: document.querySelector(".card-box.framed#computer-cards"),
    computer: "computer-cards",
  },
}

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragoon",
    type: "Paper",
    img: `${pathImages}/dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark magician",
    type: "Rock",
    img: `${pathImages}/magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissor",
    img: `${pathImages}/exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];

// remove as cartas nas mãos dos jogadores ao comparas as caratas escolhidas.
function removeAllCardInHands() {
  let {player1BOX, computerBOX} = state.playerSides
  let playerHand = player1BOX.querySelectorAll("img");
  playerHand.forEach((img) => {img.remove()});

  let computerHand = computerBOX.querySelectorAll("img");
  computerHand.forEach((img) => {img.remove()});
}

// compara as cartas em campo e atualiza o state conforme o vencedor.
function checkDuelResults(cardId, computerCardId) {
  const playerCard = cardData[cardId];
  let status = "Draw";
  if(playerCard.winOf.includes(computerCardId)) {
    state.score.playerScore += 1;
    status = "Win";
  } else if(playerCard.loseOf.includes(computerCardId)) {
    state.score.computerScore += 1;
    status = "Lose";
  }
  playAudio(status);
  return status;
}

// atualiza na tela conforme o state.
function updateScore() {
  const {playerScore, computerScore} = state.score
  state.score.scoreBox.innerText = `Win: ${playerScore} Lose: ${computerScore}`;
}

// botão no final do da comparação.
function drawButton(text) {
  state.actions.button.innerText = text;
  state.actions.button.style.display = "block";
}

// coloca a carta escolhida no campo e faz chama apra conferir o resultado do duelo
function setCardField(cardId) {
  removeAllCardInHands();
  let computerCardId = getRandomCardId();
  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResult = checkDuelResults(cardId, computerCardId);

  updateScore();
  drawButton(duelResult);
}

// mostra o card no lado esquerdo da tela.
function drawSelectedCard(card) {
  state.cardSprites.avatar.setAttribute("src", card.img);
  state.cardSprites.name.innerText = card.name;
  state.cardSprites.type.innerText = card.type;
}

// cria as cartas na mão do jogador.
function createCardImage(card, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", `${pathImages}/card-back.png`);
  cardImage.setAttribute("data-id", card.id);
  cardImage.classList.add("card");

  if(state.playerSides[fieldSide] === state.playerSides.player1) {

    cardImage.addEventListener("click", () => {
      setCardField(cardImage.getAttribute("data-id"));
    })

    cardImage.addEventListener("mouseover", ()=> {
      drawSelectedCard(card);
    })
  }

  return cardImage
}

// cria um id aleatorio de uma carta.
function getRandomCardId() {
  return Math.floor(Math.random() * cardData.length);
}

// manda criar as cartas na mão do jogador.
function drawCards(cardNumbers, fieldSide) {
  for( let i= 0; i < cardNumbers; i += 1) {
    const randomIdCard = getRandomCardId();
    const card = cardData[randomIdCard];
    const createdCard = createCardImage(card, fieldSide);
    document.getElementById(state.playerSides[fieldSide]).appendChild(createdCard);
  }
}

// reseta o campo e reinica
function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  state.cardSprites.name.innerText = "Name";
  state.cardSprites.type.innerText = "Type";
  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);

  try{
    await audio.play();
  } catch (error) {
    console.log('audio not found', audio.src, error);
  }
}

function init() {
 drawCards(5, "player1");
 drawCards(5, "computer");
};

init()