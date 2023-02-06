'use strict';
console.log('Start');

//variables
const pigFace = document.querySelector('.pig__head');
const playerWrapper = document.querySelectorAll('.player');
const score1Element = document.querySelector('#score__0');
const score2Element = document.querySelector('#score__1');
const current1Element = document.querySelector('#current__0');
const current2Element = document.querySelector('#current__1');
const diceElement = document.querySelector('.dice');
const btnNew = document.querySelector('.main__new-game');
const btnRoll = document.querySelector('.main__roll-dice');
const btnBank = document.querySelector('.main__bank');
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

const modalWindowVictory = document.querySelector('.victory');
const nameVictory = document.querySelector('.victory__name');

const question = document.querySelector('.question__icon');
const questionRules = document.querySelector('.question__rules');
const questionRename = document.querySelector('.question__rename');
const pigEarLeft1 = document.querySelector('.pig__ear-left');
const pigEarLeft2 = document.querySelector('.pig__ear-left2');
const pigEarRight1 = document.querySelector('.pig__ear-right');
const pigEarRight2 = document.querySelector('.pig__ear-right2');

const crossRuleGame = document.querySelector('#close__rule-game');
const crossVictory = document.querySelector('#close__victory');
const tonguePig = document.querySelector('.main__block-tongue');
let crossRename;
let btnRename;

const modalWindowRename = `
<h1
            class="start-game__name start-game__name_animation margin-bottom-1"
          >
            Pig Game
          </h1>

          <form class="start-game__form date-form">
            <h3 class="start-game__players-name margin-bottom-2 font-size-1">
              To start the game - enter the names of <br />the players.
            </h3>
            <div class="start-game__block-input">
              <input
                type="text"
                name="input-name"
                id="input-name_1"
                class="start-game__input-player-1 date-form__input"
                placeholder=" "
                maxlength="8"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
              />
              <label
                class="start-game__label-player-1 date-form__label"
                for="input-name_1"
                >Player 1</label
              >
            </div>
            <div class="start-game__block-input margin-bottom-3">
              <input
                type="text"
                name="input-name"
                id="input-name_2"
                class="start-game__input-player-2 date-form__input"
                placeholder=" "
                maxlength="8"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
              />
              <label
                class="start-game__label-player-2 date-form__label"
                for="input-name_2"
                >Player 2</label
              >
            </div>
            <h3 class="start-game__default-name margin-bottom-4">
              If we don\`t enter a name, then the names will be <br />set to
              standard: (Player 1 and Player 2)
            </h3>
            <button
              class="start-game__btn-start btn-style btn-other_animated" id="rename-names"
              type="submit"
            >
              Change names
            </button>
            <div
            class="icon-close icon-close_active"
            id="close__rename"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>`;

class App {
  #dataGame = {
    imgDiceSrcDefault: null,
    isQuestion: true,
    isIcons: false,
    isReset: false,
    isPlaying: true,
    isModalStart: true,
    isModalRename: false,
    isModalRule: false,
    isModalVictory: false,
    isHiddenBtnName: false,
    imgDiceSrc: diceElement.src,
    namePlayer1: 'Player 1',
    namePlayer2: 'Player 2',
    nameVictory: null,
    activePlayer: 0,
    currentPoint: 0,
    totalScores: [0, 0],
  };

  #defaultDate = {
    imgDiceSrcDefault: null,
    isFixed: false,
  };

  #changeEventListener = {
    btnRules: this.ruleGame.bind(this),
    btnRuleGame: this.ruleGame.bind(this),
    iconQuestion: this.hint.bind(this),
    iconRules: this.ruleGame.bind(this),
    iconRename: this.openModalWindowRename.bind(this),
    closeRename: this.closeModalWindowRename.bind(this),
    btnRename: this.inputNamePlayers.bind(this),
    mouseEnterRules: this.scaleMore.bind(questionRules),
    mouseOutRules: this.scaleNormal.bind(questionRules),
    mouseEnterRename: this.scaleMore.bind(questionRename),
    mouseOutRename: this.scaleNormal.bind(questionRename),
    closeModalIcon: this.closeAll.bind(this),
  };

  constructor() {
    //Roll the dice Main game(main window)
    btnRoll.addEventListener('click', this.rollTheDice.bind(this));
    //Btn Bank Main game(main window)
    btnBank.addEventListener('click', this.skipCourse.bind(this));
    //Btn New game Main game(main window)
    btnNew.addEventListener('click', this.initGame.bind(this));
    //btn Rule game Start-game(modal window)
    // btnRuleGame.addEventListener('click', this.#changeEventListener.btnRuleGame);
    //btn Rules in question
    questionRules.addEventListener('click', this.ruleGame.bind(this));
    //btn Cross Rule game(modal window)
    questionRename.addEventListener(
      'click',
      this.#changeEventListener.iconRename
    );
    crossRuleGame.addEventListener('click', this.closeRuleGame.bind(this));
    //btn Start game Start-game(modal window)
    btnStartGame.addEventListener(
      'click',
      this.closeModalWindowStartGame.bind(this)
    );
    //btn cross Victory(modal window)
    crossVictory.addEventListener(
      'click',
      this.closeModalWindowVictory.bind(this)
    );
    this.getLocaleStorage();
    this.resetFixNose();
    document.addEventListener(
      'click',
      this.#changeEventListener.closeModalIcon
    );
  }

  closeAll(e) {
    e.stopPropagation();

    const event = e.target;
    if (
      this.#dataGame.isIcons &&
      !event.parentElement.classList.contains('question')
    ) {
      this.hiddenIconsRuleRename();
      // console.log(e.target.parentElement.classList.contains('question'));
    }
    if (this.#dataGame.isModalRename && event.classList.contains('container')) {
      this.closeModalWindowRename(e);
    }
    if (this.#dataGame.isModalRule && event.classList.contains('container')) {
      this.closeRuleGame(e);
    }
    if (
      this.#dataGame.isModalVictory &&
      event.classList.contains('container')
    ) {
      this.closeModalWindowVictory(e);
    }
    // console.log();

    // console.log();
    // #dataGame = {
    //   imgDiceSrcDefault: null,
    //   isQuestion: true,
    //   isIcons: false,
    //   isReset: false,
    //   isPlaying: true,
    //   isModalStart: true,
    //   isModalRename: false,
    //   isModalRule: false,
    //   isModalVictory: false,
    //   isHiddenBtnName: false,
    //   imgDiceSrc: diceElement.src,
    //   namePlayer1: 'Player 1',
    //   namePlayer2: 'Player 2',
    //   nameVictory: null,
    //   activePlayer: 0,
    //   currentPoint: 0,
    //   totalScores: [0, 0],
    // };
  }

  scaleMore() {
    this.style.transform = 'scale(1.1)';
  }

  scaleNormal() {
    this.style.transform = 'scale(1)';
  }

  //remove all localStorage data
  resetFixNose() {
    if (JSON.parse(localStorage.getItem('pigGameDefault'))) {
      this.#defaultDate = JSON.parse(localStorage.getItem('pigGameDefault'));
      return;
    }
    if (!this.#defaultDate.isFixed) {
      //Deleting local saved api test(Fixed problem, src.nose.png. ONCE)
      localStorage.removeItem('pigGame');
      this.#defaultDate.isFixed = true;
      localStorage.setItem('pigGameDefault', JSON.stringify(this.#defaultDate));
      //Page reload
      location.reload();
    }
  }
  //remove all localStorage data
  reset() {
    //Deleting local saved api test
    localStorage.removeItem('pigGame');
    // //Page reload
    // location.reload();
    console.log('reset');
  }

  //SetLocaleStorage
  setLocaleStorage() {
    localStorage.setItem('pigGame', JSON.stringify(this.#dataGame));
    // const setDataDefault = localStorage.setItem(
    //   'pigGameDefault',
    //   JSON.stringify(this.#defaultDate)
    // );
  }

  //GetLocaleStorage
  getLocaleStorage() {
    const getData = JSON.parse(localStorage.getItem('pigGame'));
    if (getData) {
      this.#dataGame = getData;
    }
    this.updateUi();
  }

  updateUi() {
    if (!this.#dataGame.isReset) {
      this.#dataGame.imgDiceSrcDefault = diceElement.src;
      this.#dataGame.isReset = true;
      this.setLocaleStorage();
    }
    document.getElementById(
      `current__${this.#dataGame.activePlayer}`
    ).textContent = this.#dataGame.currentPoint;
    document.getElementById(
      `score__${this.#dataGame.activePlayer}`
    ).textContent = this.#dataGame.totalScores[this.#dataGame.activePlayer];
    document.getElementById(
      `score__${+!this.#dataGame.activePlayer}`
    ).textContent = this.#dataGame.totalScores[+!this.#dataGame.activePlayer];

    this.cleanFacePig();
    if (this.#dataGame.activePlayer === 0) {
      player1Element.classList.add('player_active');
      pigEarLeft1.classList.add('pig__ear_active');
      pigEarLeft2.classList.add('pig__ear_active');
    } else {
      player2Element.classList.add('player_active');
      pigEarRight1.classList.add('pig__ear_active');
      pigEarRight2.classList.add('pig__ear_active');
    }
    if (this.#dataGame.isModalStart) {
      this.openModalWindowStartGame();
    }
    if (this.#dataGame.isModalRename) {
      this.openModalWindowRename();
    }
    if (this.#dataGame.isModalRule) {
      modalWindowRuleGame.classList.remove('display_none');
      modalWindowRuleGame.classList.remove('rule-game_close');
      void modalWindowRuleGame.offsetWidth;
      modalWindowRuleGame.classList.add('rule-game_active');
    }
    if (this.#dataGame.isModalVictory) {
      this.victory();
    }

    if (this.#dataGame.isHiddenBtnName) {
      this.hiddenBtnName();
    }
    diceElement.src = this.#dataGame.imgDiceSrc;
    player1Name.textContent = this.#dataGame.namePlayer1;
    player2Name.textContent = this.#dataGame.namePlayer2;

    this.visibilityQuestion();
    if (!this.#dataGame.isIcons) {
    } else {
      this.visibilityIconRuleRename();
    }
  }

  //Game initial conditions
  initGame() {
    this.reset();
    if (!this.#dataGame.isReset) {
      this.#dataGame.imgDiceSrcDefault = diceElement.src;
      this.#dataGame.isReset = true;
    }
    this.#dataGame.isPlaying = true;
    this.#dataGame.isModalStart = false;
    this.#dataGame.isHiddenBtnName = false;
    this.#dataGame.totalScores = [0, 0];
    this.#dataGame.currentPoint = 0;
    this.#dataGame.activePlayer = 0;
    score1Element.textContent = 0;
    score2Element.textContent = 0;
    current1Element.textContent = 0;
    current2Element.textContent = 0;
    playerWrapper.forEach(item => {
      item.removeAttribute('style');
    });
    pigFace.classList.remove('pig__head_active');
    player1Element.classList.remove('player_winner');
    player2Element.classList.remove('player_winner');
    this.cleanFacePig();
    player1Element.classList.add('player_active');
    pigEarLeft1.classList.add('pig__ear_active');
    pigEarLeft2.classList.add('pig__ear_active');
    btnRoll.classList.remove('hidden');
    btnBank.classList.remove('hidden');
    playerNameTogether.forEach(name => {
      name.classList.remove('hidden');
    });
    diceElement.src = this.#dataGame.imgDiceSrcDefault;
    tonguePig.classList.remove('display_block');
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
    pigEarLeft1.classList.toggle('pig__ear_active');
    pigEarLeft2.classList.toggle('pig__ear_active');
    pigEarRight1.classList.toggle('pig__ear_active');
    pigEarRight2.classList.toggle('pig__ear_active');
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
    e.preventDefault();
    e.stopPropagation();
    this.#dataGame.isModalRule = true;
    modalWindowRuleGame.classList.remove('display_none');
    modalWindowRuleGame.classList.remove('rule-game_close');
    void modalWindowRuleGame.offsetWidth;
    modalWindowRuleGame.classList.add('rule-game_active');
    this.hiddenIconsRuleRename();
    this.hiddenQuestion();
  }

  //Close Rule game (modal windows)
  closeRuleGame(e) {
    e.preventDefault();
    e.stopPropagation();
    this.#dataGame.isModalRule = false;
    modalWindowRuleGame.classList.remove('rule-game_active');
    void modalWindowRuleGame.offsetWidth;
    modalWindowRuleGame.classList.add('rule-game_close');
    this.visibleQuestion();
  }

  openModalWindowStartGame() {
    this.#dataGame.isModalStart = true;
    modalWindowStartGAme.style.display = 'block';
    modalWindowStartGAme.style.opacity = '100';
    modalWindowStartGAme.classList.remove('start-game_close');
    void modalWindowStartGAme.offsetWidth;
    modalWindowStartGAme.classList.add('start-game_active');
    btnRuleGame.addEventListener(
      'click',
      this.#changeEventListener.btnRuleGame
    );
    this.hiddenIconsRuleRename();
    this.hiddenQuestion();
  }
  //Input names Players and Start game
  closeModalWindowStartGame(e) {
    // console.log(e.type);
    e.preventDefault();
    e.stopPropagation();
    question.style.opacity = '100';
    this.#dataGame.isModalStart = false;
    modalWindowStartGAme.classList.remove('start-game_active');
    void modalWindowStartGAme.offsetWidth;
    modalWindowStartGAme.classList.add('start-game_close');
    this.inputNamePlayers(e);
    this.visibleQuestion();
  }

  inputNamePlayers(e) {
    e.preventDefault();
    e.stopPropagation();
    // console.log(inputName1.value.trimStart());
    const inputName1 = document.querySelector('.start-game__input-player-1');
    const inputName2 = document.querySelector('.start-game__input-player-2');
    if (inputName1.value.trimStart() !== '') {
      this.#dataGame.namePlayer1 = player1Name.textContent = inputName1.value;
      inputName1.value = '';
    } else {
      player1Name.textContent = this.#dataGame.namePlayer1 = 'Player 1';
    }
    if (inputName2.value.trimStart() !== '') {
      this.#dataGame.namePlayer2 = player2Name.textContent = inputName2.value;
      inputName2.value = '';
    } else {
      player2Name.textContent = this.#dataGame.namePlayer2 = 'Player 2';
    }
    if (this.#dataGame.isModalRename) {
      this.closeModalWindowRename(e);
    }
  }

  openModalWindowRename() {
    this.#dataGame.isModalRename = true;
    modalWindowStartGAme.innerHTML = modalWindowRename;
    modalWindowStartGAme.style.display = 'block';
    // modalWindowStartGAme.style.opacity = '100';
    modalWindowStartGAme.classList.remove('start-game_close');
    void modalWindowStartGAme.offsetWidth;
    modalWindowStartGAme.classList.add('start-game_active');
    crossRename = document.querySelector('#close__rename');
    crossRename.addEventListener(
      'click',
      this.#changeEventListener.closeRename
    );
    btnRename = document.querySelector('#rename-names');
    btnRename.addEventListener('click', this.#changeEventListener.btnRename);
    this.hiddenIconsRuleRename();
    this.hiddenQuestion();
  }

  closeModalWindowRename(e) {
    console.log(e.type);
    e.preventDefault();
    e.stopPropagation();
    // crossRename.removeEventListener('click', this.#changeEventListener.closeModalWindowRename)
    // question.style.opacity = '100';
    this.#dataGame.isModalRename = false;

    modalWindowStartGAme.classList.remove('start-game_active');
    void modalWindowStartGAme.offsetWidth;
    modalWindowStartGAme.classList.add('start-game_close');
    this.visibleQuestion();
  }

  //Hidden: Btn (Bank, Roll the Dice),  Name Players
  hiddenBtnName() {
    this.#dataGame.isHiddenBtnName = true;
    btnRoll.classList.add('hidden');
    btnBank.classList.add('hidden');
    playerNameTogether.forEach(name => {
      name.classList.add('hidden');
    });
    score1Element.textContent = 0;
    score2Element.textContent = 0;
    current1Element.textContent = 0;
    current2Element.textContent = 0;
    this.cleanFacePig();
    this.fillingEar();
    pigFace.classList.add('pig__head_active');
    playerWrapper.forEach(item => {
      item.style.filter = 'blur(0)';
    });
    tonguePig.classList.add('display_block');
    this.setLocaleStorage();
  }

  cleanFacePig() {
    player1Element.classList.remove('player_active');
    player2Element.classList.remove('player_active');
    pigEarLeft1.classList.remove('pig__ear_active');
    pigEarLeft2.classList.remove('pig__ear_active');
    pigEarRight1.classList.remove('pig__ear_active');
    pigEarRight2.classList.remove('pig__ear_active');
  }

  fillingEar() {
    pigEarLeft1.classList.add('pig__ear_active');
    pigEarLeft2.classList.add('pig__ear_active');
    pigEarRight1.classList.add('pig__ear_active');
    pigEarRight2.classList.add('pig__ear_active');
  }

  //Open Victory (modal window)
  victory() {
    this.#dataGame.isModalVictory = true;
    this.#dataGame.isPlaying = false;
    this.hiddenBtnName();

    diceElement.src = this.#dataGame.imgDiceSrcDefault;
    modalWindowVictory.classList.remove('display_none');

    if (this.#dataGame.nameVictory) {
      nameVictory.textContent = this.#dataGame.nameVictory;
    } else {
      this.#dataGame.nameVictory = nameVictory.textContent =
        document.getElementById(
          `name__${this.#dataGame.activePlayer}`
        ).textContent;
    }
    this.#dataGame.nameVictory;
    this.#dataGame.imgDiceSrc = this.#dataGame.imgDiceSrcDefault;
    // this.hiddenIconsRuleRename();
    question.style.opacity = '0';
    this.hiddenQuestion();
  }

  //Close Victory(modal window)
  closeModalWindowVictory(e) {
    e.preventDefault();
    e.stopPropagation();
    this.#dataGame.isModalVictory = false;
    modalWindowVictory.classList.add('display_none');
    this.#dataGame.nameVictory = null;
    this.visibleQuestion();
  }

  visibilityIconRuleRename() {
    if (
      this.#dataGame.isModalStart ||
      this.#dataGame.isModalRule ||
      this.#dataGame.isModalVictory
    ) {
      this.hiddenIconsRuleRename();
    } else {
      if (this.#dataGame.isIcons) {
        this.visibleIconsRuleRename();
      }
    }
  }

  visibleIconsRuleRename() {
    this.animDownScale(questionRules, 13, 0.076);
    setTimeout(() => {
      this.animDownScale(questionRename, 25, 0.038);
    }, 300);
    this.#dataGame.isIcons = true;
    this.setLocaleStorage();
  }

  hiddenIconsRuleRename() {
    this.animUpScale(questionRules, 13, 0.076);
    setTimeout(() => {
      this.animUpScale(questionRename, 25, 0.038);
    }, 300);
    this.#dataGame.isIcons = false;
    this.setLocaleStorage();
  }

  animUpScale(value, firstPosition, scaleCounter) {
    let position = firstPosition;
    let scale = 1;
    let id;
    clearInterval(id);
    id = setInterval(frame.bind(this), 10);
    function frame() {
      if (position == 0) {
        clearInterval(id);
        if (value === questionRules) {
          value.removeEventListener(
            'mouseenter',
            this.#changeEventListener.mouseEnterRules
          );
          value.removeEventListener(
            'mouseout',
            this.#changeEventListener.mouseOutRules
          );
        }
        if (value === questionRename) {
          value.removeEventListener(
            'mouseenter',
            this.#changeEventListener.mouseEnterRename
          );
          value.removeEventListener(
            'mouseout',
            this.#changeEventListener.mouseOutRename
          );
        }
        value.style.transform = 'scale(0)';
      } else {
        position--;
        scale = scale - scaleCounter;
        value.style.transform = `scale(${scale})`;
        value.style.top = position + 'rem';
      }
    }
  }

  animDownScale(value, lastPosition, scaleCounter) {
    let position = 0;
    let scale = 0;
    let id;
    clearInterval(id);
    id = setInterval(frame.bind(this), 10);
    function frame() {
      if (position == lastPosition) {
        clearInterval(id);
        if (value === questionRules) {
          value.addEventListener(
            'mouseenter',
            this.#changeEventListener.mouseEnterRules
          );
          value.addEventListener(
            'mouseout',
            this.#changeEventListener.mouseOutRules
          );
        }
        if (value === questionRename) {
          value.addEventListener(
            'mouseenter',
            this.#changeEventListener.mouseEnterRename
          );
          value.addEventListener(
            'mouseout',
            this.#changeEventListener.mouseOutRename
          );
        }
      } else {
        position++;
        scale = scale + scaleCounter;
        value.style.transform = `scale(${scale})`;
        value.style.top = position + 'rem';
      }
    }
  }

  visibilityQuestion() {
    if (
      this.#dataGame.isModalStart ||
      this.#dataGame.isModalRule ||
      this.#dataGame.isModalVictory
    ) {
      this.hiddenQuestion();
    } else {
      this.visibleQuestion();
    }
  }

  hiddenQuestion() {
    this.#dataGame.isQuestion = false;
    question.removeEventListener(
      'click',
      this.#changeEventListener.iconQuestion
    );
    setTimeout(() => (question.style.opacity = '0'), 800);
    question.style.cursor = 'default';
    this.setLocaleStorage();
  }

  visibleQuestion() {
    question.style.opacity = '100';
    question.style.cursor = 'pointer';
    question.addEventListener('click', this.#changeEventListener.iconQuestion);
    this.#dataGame.isQuestion = true;
    this.setLocaleStorage();
  }

  //Hint, call Start game(modal window)
  hint() {
    if (this.#dataGame.isIcons) {
      this.hiddenIconsRuleRename();
    } else {
      this.visibleIconsRuleRename();
    }
  }
}

///Clearing specific local data
function reset() {
  //Deleting local saved api test
  localStorage.removeItem('pigGame');
  //Page reload
  location.reload();
}

class Ui extends App {}
const app = new App();

// let requestId = requestAnimationFrame(callback)
// cancelAnimationFrame(requestId);
// console.log(performance.now());
