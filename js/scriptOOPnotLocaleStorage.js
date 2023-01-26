'use strict';

//variables
const score1Element = document.querySelector('#score__1');
const score2Element = document.querySelector('#score__2');
const current1Element = document.querySelector('#current__1');
const current2Element = document.querySelector('#current__2');
const diceElement = document.querySelector('.dice');
const btnNew = document.querySelector('.btn__new');
const btnRoll = document.querySelector('.btn__roll');
const btnHold = document.querySelector('.btn__hold');
const player1Element = document.querySelector('.player__1');
const player2Element = document.querySelector('.player__2');
const player1Name = document.querySelector('#name__1');
const player2Name = document.querySelector('#name__2');
const playerNameTogether = document.querySelectorAll('.name');
//Изменил класс
// const playerScoreTogether = document.querySelectorAll('.score');
const btnStartGame = document.querySelector('.start-game__btn-start');
const btnRuleGame = document.querySelector('.start-game__btn-rule-game');
const modalWindowRuleGame = document.querySelector('.rule-game');
const modalWindowStartGAme = document.querySelector('.start-game');
const player1NameSet = document.querySelector('.start-game__input-player-1');
const player2NameSet = document.querySelector('.start-game__input-player-2');
const modalWindowVictory = document.querySelector('.victory');
const nameVictory = document.querySelector('.victory__name');
const crossVictory = document.querySelector('.victory__close');
const closeModalWindowRuleGame = document.querySelector('.rule-game__close');
const question = document.querySelector('.question__icon');

// let totalScores, currentScore, activePlayer, isPlaying;

class App {
  #totalScores = [null, 0, 0];
  #currentScore = 0;
  #activePlayer = 1;
  #isPlaying = true;
  //Important data game
  #dataGame = {
    isPlaying: true,
    isModalStart: true,
    namePlayer1: 'Player 1',
    namePlayer2: 'Player 2',
    scorePlayer1: 0,
    scorePlayer2: 0,
    pointPlayer1: 0,
    pointPlayer2: 0,
    activePlayer: 0,
  };

  constructor() {
    // this.testing = testing;
    // this.initGame();
    //Roll the dice Main game(main window)
    btnRoll.addEventListener('click', this.rollTheDice.bind(this));
    //Btn Bank Main game(main window)
    btnHold.addEventListener('click', this.skipCourse.bind(this));
    //Btn New game Main game(main window)
    btnNew.addEventListener('click', this.initGame.bind(this));
    //btn Rule game Start-game(modal window)
    btnRuleGame.addEventListener('click', this.ruleGame);
    //btn Cross Rule game(modal window)
    closeModalWindowRuleGame.addEventListener('click', this.closeRuleGame);
    //btn Start game Start-game(modal window)
    btnStartGame.addEventListener('click', this.startGame);
    //btn cross Victory(modal window)
    crossVictory.addEventListener('click', this.closeModalWindowVictory);
    //btn hint or question, Call Srart game and Rule game(modal window)
    question.addEventListener('click', this.hint);
  }

  //SetLocaleStorage
  setLocaleStorage(value) {
    // this.#dataGame.value;
    const setData = localStorage.setItem(
      'pigGame',
      JSON.stringify(this.#dataGame)
    );
  }

  //GetLocaleStorage
  getLocaleStorage(value) {
    const getData = JSON.parse(localStorage.getItem('pigGame'));
    return getData[value];
  }

  //Game initial conditions
  initGame() {
    if (localStorage.removeItem('pigGame')) localStorage.removeItem('pigGame');
    this.setLocaleStorage();
    this.getLocaleStorage('isPlaying');
    // const test = this.getLocaleStorage();
    console.log(this.getLocaleStorage('isPlaying'));
    this.#totalScores = [null, 0, 0];
    this.#currentScore = 0;
    this.#activePlayer = 1;
    this.#isPlaying = true;
    score1Element.textContent = 0;
    score2Element.textContent = 0;
    current1Element.textContent = 0;
    current2Element.textContent = 0;
    player1Element.classList.remove('player_winner');
    player2Element.classList.remove('player_winner');
    player1Element.classList.remove('player_active');
    player2Element.classList.remove('player_active');
    player1Element.classList.add('player_active');
    // player1Name.textContent = 'Player 1';
    // player2Name.textContent = 'Player 2';
    btnRoll.classList.remove('hidden');
    btnHold.classList.remove('hidden');
    playerNameTogether.forEach(name => {
      name.classList.remove('hidden');
    });
    diceElement.src = 'img/nose.png';
  }

  //Switching players
  switchActivePlayer() {
    this.#currentScore = 0;
    document.getElementById(`current__${this.#activePlayer}`).textContent =
      this.#currentScore;
    this.#activePlayer = this.#activePlayer === 1 ? 2 : 1;
    player1Element.classList.toggle('player_active');
    player2Element.classList.toggle('player_active');
  }

  //Roll the dice
  rollTheDice() {
    if (this.#isPlaying) {
      const diceNumber = Math.trunc(Math.random() * 6 + 1);
      diceElement.src = `img/dice${diceNumber}.png`;
      if (diceNumber !== 1) {
        this.#currentScore += diceNumber;
        document.getElementById(`current__${this.#activePlayer}`).textContent =
          this.#currentScore;
      } else {
        this.switchActivePlayer();
      }
    }
  }

  //Btn Bank (Skip the course)
  skipCourse() {
    if (this.#isPlaying) {
      this.#totalScores[this.#activePlayer] += this.#currentScore;
      document.getElementById(`score__${this.#activePlayer}`).textContent =
        this.#totalScores[this.#activePlayer];
      if (this.#totalScores[this.#activePlayer] >= 50) {
        this.victory();
      } else {
        this.switchActivePlayer();
      }
    }
  }

  //Open Rule game (modal windows)
  ruleGame(e) {
    e.preventDefault();
    e.stopPropagation();
    modalWindowRuleGame.classList.remove('display_none');
    modalWindowRuleGame.classList.remove('rule-game_close');
    void modalWindowRuleGame.offsetWidth;
    modalWindowRuleGame.classList.add('rule-game_active');
  }

  //Close Rule game (modal windows)
  closeRuleGame(e) {
    e.preventDefault();
    modalWindowRuleGame.classList.remove('rule-game_active');
    void modalWindowRuleGame.offsetWidth;
    modalWindowRuleGame.classList.add('rule-game_close');
  }

  //Input names Players and Start game
  startGame(e) {
    question.style.opacity = '100';
    e.preventDefault();
    e.stopPropagation();
    modalWindowStartGAme.classList.remove('start-game_close');
    void modalWindowStartGAme.offsetWidth;
    modalWindowStartGAme.classList.add('start-game_active');
    const inputName1 = document.querySelector('.start-game__input-player-1');
    const inputName2 = document.querySelector('.start-game__input-player-2');
    if (inputName1.value.trimStart() !== '') {
      player1Name.textContent = inputName1.value;
      inputName1.value = '';
    }
    if (inputName2.value.trimStart() !== '') {
      player2Name.textContent = inputName2.value;
      inputName2.value = '';
    }
    question.style.opacity = '100';
  }

  //Open Victory (modal window)
  victory() {
    diceElement.src = 'img/nose.png';
    this.#isPlaying = false;
    modalWindowVictory.classList.remove('display_none');
    btnRoll.classList.add('hidden');
    btnHold.classList.add('hidden');
    playerNameTogether.forEach(name => {
      name.classList.add('hidden');
    });
    nameVictory.textContent = document.getElementById(
      `name__${this.#activePlayer}`
    ).textContent;
    score1Element.textContent = 0;
    score2Element.textContent = 0;
    current1Element.textContent = 0;
    current2Element.textContent = 0;
    question.style.opacity = '0';
  }

  //Close Victory(modal window)
  closeModalWindowVictory() {
    modalWindowVictory.classList.add('display_none');
    question.style.opacity = '100';
  }

  //Hint, call Start game(modal window)
  hint() {
    question.style.opacity = '0';
    modalWindowStartGAme.classList.remove('start-game_active');
    void modalWindowStartGAme.offsetWidth;
    modalWindowStartGAme.classList.add('start-game_close');
  }
}

// //полученные данные
// const data = JSON.parse(localStorage.getItem('workouts'));
// console.log(JSON.parse(localStorage.getItem('workouts')));

// localStorage.setItem(
//   'test',
//   JSON.stringify({ lastName: 'Yore', number: 123213 })
// );

///Очистка определенных локальных данных

function reset() {
  //удаление локального сохранненого api test
  localStorage.removeItem('test');
  ///ПЕРЕзагрузка страницы
  location.reload();
}

const app = new App();

// //Game initial conditions
// const initGame = function () {
//   totalScores = [0, 0, 0];
//   currentScore = 0;
//   activePlayer = 1;
//   isPlaying = true;
//   score1Element.textContent = 0;
//   score2Element.textContent = 0;
//   current1Element.textContent = 0;
//   current2Element.textContent = 0;
//   player1Element.classList.remove('player_winner');
//   player2Element.classList.remove('player_winner');
//   player1Element.classList.remove('player_active');
//   player2Element.classList.remove('player_active');
//   player1Element.classList.add('player_active');
//   // player1Name.textContent = 'Player 1';
//   // player2Name.textContent = 'Player 2';
//   btnRoll.classList.remove('hidden');
//   btnHold.classList.remove('hidden');
//   playerNameTogether.forEach(name => {
//     name.classList.remove('hidden');
//   });
//   diceElement.src = 'img/nose.png';
// };

// initGame();

// //Switching players
// const switchActivePlayer = function () {
//   currentScore = 0;
//   document.getElementById(`current__${activePlayer}`).textContent =
//     currentScore;
//   activePlayer = activePlayer === 1 ? 2 : 1;
//   player1Element.classList.toggle('player_active');
//   player2Element.classList.toggle('player_active');
// };

// //Roll the dice
// btnRoll.addEventListener('click', function () {
//   if (isPlaying) {
//     const diceNumber = Math.trunc(Math.random() * 6 + 1);
//     diceElement.src = `img/dice${diceNumber}.png`;
//     if (diceNumber !== 1) {
//       currentScore += diceNumber;
//       document.getElementById(`current__${activePlayer}`).textContent =
//         currentScore;
//     } else {
//       switchActivePlayer();
//     }
//   }
// });

//Кнопка БАНК
// btnHold.addEventListener('click', function () {
//   if (isPlaying) {
//     totalScores[activePlayer] += currentScore;
//     document.getElementById(`score__${activePlayer}`).textContent =
//       totalScores[activePlayer];
//     if (totalScores[activePlayer] >= 50) {
//       victory();
//     } else {
//       switchActivePlayer();
//     }
//   }
// });

// //Кнопка новая игра
// btnNew.addEventListener('click', initGame);

// //Открытие модального окна правил
// btnRuleGame.addEventListener('click', function (e) {
//   e.preventDefault();
//   e.stopPropagation();
//   modalWindowRuleGame.classList.remove('display_none');
//   modalWindowRuleGame.classList.remove('rule-game_close');
//   void modalWindowRuleGame.offsetWidth;
//   modalWindowRuleGame.classList.add('rule-game_active');
// });

//Закрытия модального окна правил
// closeModalWindowRuleGame.addEventListener('click', function (e) {
//   e.preventDefault();
//   modalWindowRuleGame.classList.remove('rule-game_active');
//   void modalWindowRuleGame.offsetWidth;
//   modalWindowRuleGame.classList.add('rule-game_close');
// });

// //Кнопка начального стартового окна где устанавливаються имена и можно посмотреть правила
// btnStartGame.addEventListener('click', function (e) {
//   question.style.opacity = '100';
//   e.preventDefault();
//   e.stopPropagation();
//   modalWindowStartGAme.classList.remove('start-game_close');
//   void modalWindowStartGAme.offsetWidth;
//   modalWindowStartGAme.classList.add('start-game_active');
//   const inputName1 = document.querySelector('.start-game__input-player-1');
//   const inputName2 = document.querySelector('.start-game__input-player-2');
//   if (inputName1.value.trimStart() !== '') {
//     player1Name.textContent = inputName1.value;
//     inputName1.value = '';
//   }
//   if (inputName2.value.trimStart() !== '') {
//     player2Name.textContent = inputName2.value;
//     inputName2.value = '';
//   }

//   question.style.opacity = '100';
// });

// //Модальное окно победы
// function victory() {
//   diceElement.src = 'img/nose.png';
//   isPlaying = false;
//   modalWindowVictory.classList.remove('display_none');
//   btnRoll.classList.add('hidden');
//   btnHold.classList.add('hidden');
//   playerNameTogether.forEach(name => {
//     name.classList.add('hidden');
//   });
//   nameVictory.textContent = document.getElementById(
//     `name__${activePlayer}`
//   ).textContent;
//   score1Element.textContent = 0;
//   score2Element.textContent = 0;
//   current1Element.textContent = 0;
//   current2Element.textContent = 0;
//   question.style.opacity = '0';
// }

// //Закрытия модального окна победы
// crossVictory.addEventListener('click', function () {
//   modalWindowVictory.classList.add('display_none');
//   question.style.opacity = '100';
// });

// //Кнопка вопроса
// question.addEventListener('click', function () {
//   question.style.opacity = '0';
//   modalWindowStartGAme.classList.remove('start-game_active');
//   void modalWindowStartGAme.offsetWidth;
//   modalWindowStartGAme.classList.add('start-game_close');
// });
// test.offsetLeft = '400px';
// test.offsetTop = '-100';

// alert(test.offsetLeft); // 180 (обратите внимание: число, а не строка "180px")
// alert(test.offsetTop); // 180

// alert('Текущая прокрутка сверху: ' + window.pageYOffset);
// alert('Текущая прокрутка слева: ' + window.pageXOffset);

// document.querySelectorAll('.icon-close').forEach(icon => {
//   icon.addEventListener('click', function () {
//     document.querySelectorAll('.icon-close').forEach(icon => {
//       icon.classList.toggle('icon-close_active');
//     });
//   });
// });

// console.log(
//   window
//     .getComputedStyle(document.querySelector('.victory__name'), ':after')
//     .getPropertyValue('content')
// );

// //////////test overflow
// let docWidth = document.documentElement.offsetWidth;

// [].forEach.call(document.querySelectorAll('*'), function (el) {
//   if (el.offsetWidth > docWidth) {
//     console.log(el);
//   }
// });
