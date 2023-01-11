'use strict';

//variables
const scrole0Element = document.querySelector('#score__0');
const scrole1Element = document.querySelector('#score__1');
const current0Element = document.querySelector('#current__0');
const current1Element = document.querySelector('#current__1');
const diceElement = document.querySelector('.dice');
const btnNew = document.querySelector('.btn__new');
const btnRoll = document.querySelector('.btn__roll');
const btnHold = document.querySelector('.btn__hold');
const player0Element = document.querySelector('.player__0');
const player1Element = document.querySelector('.player__1');
const player0Name = document.querySelector('#name__0');
const player1Name = document.querySelector('#name__1');
let totalScores, currentScore, activePlayer, isPlaying;

//Game initial conditions
const initGame = function () {
  totalScores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  isPlaying = true;

  scrole0Element.textContent = 0;
  scrole1Element.textContent = 0;
  current0Element.textContent = 0;
  current1Element.textContent = 0;
  player0Element.classList.remove('player_winner');
  player1Element.classList.remove('player_winner');
  player0Element.classList.remove('player_active');
  player1Element.classList.remove('player_active');
  player0Element.classList.add('player_active');
  player0Name.textContent = 'Player 1';
  player1Name.textContent = 'Player 2';
  diceElement.src = 'img/nose.png';
};

initGame();

//Switching players
const switchActivePlayer = function () {
  currentScore = 0;
  document.getElementById(`current__${activePlayer}`).textContent =
    currentScore;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0Element.classList.toggle('player_active');
  player1Element.classList.toggle('player_active');
};

//Roll the dice
btnRoll.addEventListener('click', function () {
  if (isPlaying) {
    //1Generate a random number
    const diceNumber = Math.trunc(Math.random() * 6 + 1);

    //1Src img dice
    diceElement.src = `img/dice${diceNumber}.png`;

    //3If the number is 1, switch to the next player. If not add number to the current score
    if (diceNumber !== 1) {
      currentScore += diceNumber;
      document.getElementById(`current__${activePlayer}`).textContent =
        currentScore;
    } else {
      switchActivePlayer();
    }
  }
});

btnHold.addEventListener('click', function () {
  if (isPlaying) {
    //1Add current score to active player total score
    totalScores[activePlayer] += currentScore;
    document.getElementById(`score__${activePlayer}`).textContent =
      totalScores[activePlayer];

    //2If total score to active payer >= 100, active player won, if not - switch active player
    if (totalScores[activePlayer] >= 20) {
      diceElement.src = 'img/nose.png';
      isPlaying = false;

      document
        .querySelector(`.player__${activePlayer}`)
        .classList.add('player_winner');
      document
        .querySelector(`.player__${activePlayer}`)
        .classList.remove('player_active');
      document.querySelector(`#name__${activePlayer}`).textContent = 'Victory';
    } else {
      switchActivePlayer();
    }
  }
});

btnNew.addEventListener('click', initGame);
