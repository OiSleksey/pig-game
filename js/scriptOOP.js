'use strict';

//variables
const score1Element = document.querySelector('#score__0');
const score2Element = document.querySelector('#score__1');
const current1Element = document.querySelector('#current__0');
const current2Element = document.querySelector('#current__1');
const diceElement = document.querySelector('.dice');
const btnNew = document.querySelector('.btn__new');
const btnRoll = document.querySelector('.btn__roll');
const btnHold = document.querySelector('.btn__hold');
const player1Element = document.querySelector('.player__1');
const player2Element = document.querySelector('.player__2');
const player1Name = document.querySelector('#name__0');
const player2Name = document.querySelector('#name__1');
const playerNameTogether = document.querySelectorAll('.name');
//Change className
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

class App {
  #dataGame = {
    isPlaying: true,
    isModalStart: true,
    isModalRule: false,
    isVictory: false,
    isHiddenBtnName: false,
    isReset: true,
    imgDiceSrc: diceElement.src,
    imgDiceSrcDefault: null,
    namePlayer1: 'Player 1',
    namePlayer2: 'Player 2',
    nameVictory: null,
    activePlayer: 0,
    currentPoint: 0,
    totalScores: [0, 0],
  };

  constructor() {
    //Get Data game from locale storage
    this.getLocaleStorage();
    //Roll the dice Main game(main window)
    btnRoll.addEventListener('click', this.rollTheDice.bind(this));
    //Btn Bank Main game(main window)
    btnHold.addEventListener('click', this.skipCourse.bind(this));
    //Btn New game Main game(main window)
    btnNew.addEventListener('click', this.initGame.bind(this));
    //btn Rule game Start-game(modal window)
    btnRuleGame.addEventListener('click', this.ruleGame.bind(this));
    //btn Cross Rule game(modal window)
    closeModalWindowRuleGame.addEventListener(
      'click',
      this.closeRuleGame.bind(this)
    );
    //btn Start game Start-game(modal window)
    btnStartGame.addEventListener('click', this.startGame.bind(this));
    //btn cross Victory(modal window)
    crossVictory.addEventListener(
      'click',
      this.closeModalWindowVictory.bind(this)
    );
    //btn hint or question, Call Srart game and Rule game(modal window)
    question.addEventListener('click', this.hint.bind(this));
  }

  //remove all localStorage data
  reset() {
    //Deleting local saved api test
    localStorage.removeItem('pigGame');
    //Save default class="dice" attribute src=../img.nose.png
    this.#dataGame.imgDiceSrcDefault = diceElement.src;
    this.setLocaleStorage();
    //Page reload
    location.reload();
  }

  //SetLocaleStorage
  setLocaleStorage() {
    const setData = localStorage.setItem(
      'pigGame',
      JSON.stringify(this.#dataGame)
    );
  }

  //GetLocaleStorage
  getLocaleStorage() {
    const getData = JSON.parse(localStorage.getItem('pigGame'));
    if (getData) {
      this.#dataGame = getData;
      this.updateUi();
    }
  }

  updateUi() {
    document.getElementById(
      `current__${this.#dataGame.activePlayer}`
    ).textContent = this.#dataGame.currentPoint;

    document.getElementById(
      `score__${this.#dataGame.activePlayer}`
    ).textContent = this.#dataGame.totalScores[this.#dataGame.activePlayer];

    document.getElementById(
      `score__${+!this.#dataGame.activePlayer}`
    ).textContent = this.#dataGame.totalScores[+!this.#dataGame.activePlayer];

    if (this.#dataGame.activePlayer === 0) {
      player1Element.classList.add('player_active');
      player2Element.classList.remove('player_active');
    } else {
      player1Element.classList.remove('player_active');
      player2Element.classList.add('player_active');
    }

    if (!this.#dataGame.isModalStart) {
      modalWindowStartGAme.style.opacity = '0';
      modalWindowStartGAme.classList.add('start-game_close');
      question.style.opacity = '100';
    } else {
      console.log(this.#dataGame);
      if (this.#dataGame.isModalRule) {
        console.log(123);
        window.addEventListener('load', this.ruleGame.bind(this));
      }
    }

    if (this.#dataGame.isVictory) {
      this.victory();
    }

    if (this.#dataGame.isHiddenBtnName) {
      this.hiddenBtnName();
    }

    diceElement.src = this.#dataGame.imgDiceSrc;

    player1Name.textContent = this.#dataGame.namePlayer1;
    player2Name.textContent = this.#dataGame.namePlayer2;
  }
  //Game initial conditions
  initGame() {
    if (this.#dataGame.isReset) {
      this.reset();
      this.#dataGame.isReset = false;
    }
    if (JSON.parse(localStorage.getItem('pigGame'))) {
      localStorage.removeItem('pigGame');
    }
    this.#dataGame.isPlaying = true;
    this.#dataGame.isModalStart = false;
    this.#dataGame.isHiddenBtnName = false;
    this.#dataGame.totalScores = [0, 0];
    this.#dataGame.currentPoint = 0;
    this.#dataGame.activePlayer = 0;
    this.#dataGame.imgDiceSrc = diceElement.src;
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
    diceElement.src = this.#dataGame.imgDiceSrcDefault;
    this.setLocaleStorage();
  }

  //Switching players
  switchActivePlayer() {
    this.#dataGame.currentPoint = 0;
    document.getElementById(
      `current__${this.#dataGame.activePlayer}`
    ).textContent = this.#dataGame.currentPoint;
    this.#dataGame.activePlayer = this.#dataGame.activePlayer === 0 ? 1 : 0;
    player1Element.classList.toggle('player_active');
    player2Element.classList.toggle('player_active');
    this.setLocaleStorage();
  }

  //Roll the dice
  rollTheDice() {
    if (this.#dataGame.isPlaying) {
      const diceNumber = Math.trunc(Math.random() * 6 + 1);
      diceElement.src = `img/dice${diceNumber}.png`;
      this.#dataGame.imgDiceSrc = diceElement.src;
      if (diceNumber !== 1) {
        this.#dataGame.currentPoint += diceNumber;
        document.getElementById(
          `current__${this.#dataGame.activePlayer}`
        ).textContent = this.#dataGame.currentPoint;
        this.setLocaleStorage();
      } else {
        this.switchActivePlayer();
      }
    }
  }

  //Skip a turn
  skipCourse() {
    if (this.#dataGame.isPlaying) {
      this.#dataGame.totalScores[this.#dataGame.activePlayer] +=
        this.#dataGame.currentPoint;
      document.getElementById(
        `score__${this.#dataGame.activePlayer}`
      ).textContent = this.#dataGame.totalScores[this.#dataGame.activePlayer];
      if (this.#dataGame.totalScores[this.#dataGame.activePlayer] >= 50) {
        this.victory();
      } else {
        this.switchActivePlayer();
      }
    }
  }

  //Open Rule game (modal windows)
  ruleGame(e) {
    this.#dataGame.isModalRule = true;
    e.preventDefault();
    e.stopPropagation();
    modalWindowRuleGame.classList.remove('display_none');
    modalWindowRuleGame.classList.remove('rule-game_close');
    void modalWindowRuleGame.offsetWidth;
    modalWindowRuleGame.classList.add('rule-game_active');
    this.setLocaleStorage();
  }

  //Close Rule game (modal windows)
  closeRuleGame(e) {
    this.#dataGame.isModalRule = false;
    e.preventDefault();
    modalWindowRuleGame.classList.remove('rule-game_active');
    void modalWindowRuleGame.offsetWidth;
    modalWindowRuleGame.classList.add('rule-game_close');
    this.setLocaleStorage();
  }

  //Input names Players and Start game
  startGame(e) {
    question.style.opacity = '100';
    e.preventDefault();
    e.stopPropagation();
    modalWindowStartGAme.classList.remove('start-game_active');
    void modalWindowStartGAme.offsetWidth;
    modalWindowStartGAme.classList.add('start-game_close');
    const inputName1 = document.querySelector('.start-game__input-player-1');
    const inputName2 = document.querySelector('.start-game__input-player-2');
    if (inputName1.value.trimStart() !== '') {
      this.#dataGame.namePlayer1 = player1Name.textContent = inputName1.value;
      inputName1.value = '';
    }
    if (inputName2.value.trimStart() !== '') {
      this.#dataGame.namePlayer2 = player2Name.textContent = inputName2.value;
      inputName2.value = '';
    }
    question.style.opacity = '100';
    this.#dataGame.isModalStart = false;
    this.setLocaleStorage();
  }

  //Hidden: Btn (Bank, Roll the Dice),  Name Players
  hiddenBtnName() {
    this.#dataGame.isHiddenBtnName = true;
    btnRoll.classList.add('hidden');
    btnHold.classList.add('hidden');
    playerNameTogether.forEach(name => {
      name.classList.add('hidden');
    });
    score1Element.textContent = 0;
    score2Element.textContent = 0;
    current1Element.textContent = 0;
    current2Element.textContent = 0;
    this.setLocaleStorage();
  }
  //Open Victory (modal window)
  victory() {
    this.#dataGame.isVictory = true;
    diceElement.src = 'img/nose.png';
    this.#dataGame.isPlaying = false;
    modalWindowVictory.classList.remove('display_none');
    this.hiddenBtnName();
    if (this.#dataGame.nameVictory) {
      nameVictory.textContent = this.#dataGame.nameVictory;
    } else {
      this.#dataGame.nameVictory = nameVictory.textContent =
        document.getElementById(
          `name__${this.#dataGame.activePlayer}`
        ).textContent;
    }
    this.#dataGame.nameVictory;
    this.#dataGame.imgDiceSrc = 'http://127.0.0.1:5500/img/nose.png';
    question.style.opacity = '0';
    this.setLocaleStorage();
  }

  //Close Victory(modal window)
  closeModalWindowVictory() {
    this.#dataGame.isVictory = false;
    modalWindowVictory.classList.add('display_none');
    question.style.opacity = '100';
    this.#dataGame.nameVictory = null;
    this.setLocaleStorage();
  }

  //Hint, call Start game(modal window)
  hint() {
    this.#dataGame.isModalStart = true;
    question.style.opacity = '0';
    modalWindowStartGAme.style.opacity = '100';
    modalWindowStartGAme.classList.remove('start-game_close');
    void modalWindowStartGAme.offsetWidth;
    modalWindowStartGAme.classList.add('start-game_active');
    this.setLocaleStorage();
  }
}

///Clearing specific local data
function reset() {
  //Deleting local saved api test
  localStorage.removeItem('pigGame');
  //Page reload
  location.reload();
}

const app = new App();
