// === CONSTANTS === //
const QUESIONS_AMOUNT = 5;

// === VARIABLES === //
let quizData;
let currentQuiz;
let currentQuestion;
let answersGiven;

// === UI ELEMENTS === //
const startButtonUI = document.getElementById('js-start');
const againButtonUI = document.getElementById('js-again');

const startScreenUI = document.getElementById('js-start-screen');
const gameScreenUI = document.getElementById('js-game-screen');
const endScreenUI = document.getElementById('js-end-screen');

const questionUI = document.getElementById('js-question');
const choicesUI = document.querySelectorAll('#js-choices button');

const progressTextUI = document.getElementById('js-progress-text');
const progressBarUI = document.getElementById('js-progress-bar');

const correctAmountUI = document.getElementById('js-correct-amount');
const wrongAmountUI = document.getElementById('js-wrong-amount');

// === EVENTS === //
startButtonUI.addEventListener('click', loadData);
againButtonUI.addEventListener('click', loadData);

document.getElementById('js-choices').addEventListener('click', handleChoiceClick);

// === FUNCTIONALITY === //
function loadData(event) {
  event.target.classList.add('is-loading');
  // get data
  fetch('./js/data.json')
    .then(response => {
      return response.json();
    })
    .then(loaded => {
      quizData = loaded;
      startGame(event.target);
    });
}

function startGame(pressedButton) {
  // handle when data amount is less than desired questions amount
  let availableQuestions = QUESIONS_AMOUNT;
  if (QUESIONS_AMOUNT > quizData.length) {
    availableQuestions = quizData.length;
  }
  
  // setup
  currentQuiz = [];
  answersGiven = [];
  currentQuestion = 0;

  // fill current quiz 
  currentQuiz = getRandomizedFrom(quizData, availableQuestions);
  
  progressTextUI.textContent = `${currentQuestion}/${currentQuiz.length}`;
  progressBarUI.value = 0;
  getQuestion(currentQuestion);
  
  // go to game screen
  pressedButton.classList.remove('is-loading');

  startScreenUI.classList.add('is-hidden');
  endScreenUI.classList.add('is-hidden');
  gameScreenUI.classList.remove('is-hidden');
}

function getQuestion(number) {
  questionUI.textContent = currentQuiz[number].question;

  // get choices
  let choices = [currentQuiz[number].answer, ...currentQuiz[number].choices];
  
  // randomize
  let randomChoices = getRandomizedFrom(choices);

  // fill ui with choices
  for (let index in choicesUI) {
    choicesUI[index].textContent = randomChoices[index];
  }
}

function endGame() {
  let correctCount = 0;
  let wrongCount = 0;
  for (let i = 0; i < currentQuiz.length; i++) {
    if (currentQuiz[i].answer === answersGiven[i]) {
      correctCount++;
    } else {
      wrongCount++;
    }
  }

  correctAmountUI.textContent = correctCount;
  wrongAmountUI.textContent = wrongCount;

  gameScreenUI.classList.add('is-hidden');
  endScreenUI.classList.remove('is-hidden');
}

/////////////////////////////////////////

function handleChoiceClick(event) {
  let clicked = event.target;
  // exit if clicked is not a button
  if (clicked.tagName !== 'BUTTON') return;

  // store clicked answer
  answersGiven.push(clicked.innerText);

  // show feedback
  if (clicked.innerText !== currentQuiz[currentQuestion].answer) {
    // wrong
    clicked.classList.add('is-danger');
  } else {
    // correct
    clicked.classList.add('is-success');
  }

  // remove feedback after 1sec 
  setTimeout(() => {
    clicked.classList.remove('is-danger');
    clicked.classList.remove('is-success');

    // remove focus and active states on clicked button
    clicked.blur();
    clicked.classList.remove('hasactive');

    // update question tracker and go to next question
    currentQuestion++;
    if (currentQuestion === currentQuiz.length) {
      // game has finished
      endGame();

    } else {

      // go to next question
      getQuestion(currentQuestion);

      // update progress
      progressTextUI.textContent = `${currentQuestion}/${currentQuiz.length}`;
      progressBarUI.value = (currentQuestion * 100) / currentQuiz.length;
    }
  }, 1000);
}

/////////////////////////////////////////

function getRandomfromZeroTo(number) {
  return Math.floor(Math.random() * number);
}

function getRandomizedFrom(array, desiredSize = array.length) {
  let randomArray = [];
  let usedElements = [];

  while (randomArray.length < desiredSize) {
    let random = getRandomfromZeroTo(array.length);  

    // only append if it hasn't been used
    if (!usedElements.includes(random)) {
      usedElements.push(random);
      randomArray.push(array[random]);
    }
  }

  return randomArray;
}