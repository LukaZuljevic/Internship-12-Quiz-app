import {
  resetAnswerStyles,
  createNextButton,
  createAnswerButton,
  disableAnswerButtons,
} from "./helpers.js";
import { showHistory, showResults } from "./results.js";

const quizContainer = document.querySelector(".quiz-container");

let nextButton = null;
let score = 0;

let scoreElement = null;
let timerElement = null;
let timerInterval;
let remainingTime = 20;
let isPaused = false;

let quizHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];

function showQuiz(data, startButton) {
  let currentQuestionIndex = 0;
  startButton.style.display = "none";
  quizContainer.style.display = "block";

  displayQuestion(currentQuestionIndex, data);
}

function displayQuestion(currentQuestionIndex, data) {
  quizContainer.innerHTML = "";
  isPaused = false;
  remainingTime = 20;

  if (currentQuestionIndex === data.length) {
    endQuiz(data);
    return;
  }

  const item = data[currentQuestionIndex];

  appendScore();

  appendQuestion(item);

  appendAnswers(currentQuestionIndex, data, item);

  setQuestionTimer(currentQuestionIndex, data);
}

function endQuiz(data) {
  clearInterval(timerInterval);

  const today = new Date();
  const quizResult = {
    score: score,
    difficulty: data[0].difficulty,
    category: data[0].category,
    date: today.toDateString(),
  };

  quizHistory.push(quizResult);
  localStorage.setItem("quizHistory", JSON.stringify(quizHistory));

  showResults();
  showHistory();
}

function appendScore() {
  scoreElement = document.createElement("p");
  scoreElement.classList.add("score");
  scoreElement.textContent = `Score: ${score} / 5`;
  quizContainer.appendChild(scoreElement);
}

function appendQuestion(item) {
  const question = document.createElement("h3");
  question.textContent = item.question;
  quizContainer.appendChild(question);
}

function appendAnswers(currentQuestionIndex, data, item) {
  const answers = [...item.incorrect_answers, item.correct_answer].sort(
    () => Math.random() - 0.5
  );

  let selectedAnswer = null;
  let confirmTimeout;
  let correctAnswer;

  answers.forEach((answer) => {
    const answerBlock = createAnswerButton(answer);
    if (answerBlock.textContent === item.correct_answer)
      correctAnswer = answerBlock;

    answerBlock.addEventListener("click", (event) => {
      clearTimeout(confirmTimeout);
      resetAnswerStyles();

      selectedAnswer = event.target;
      selectedAnswer.classList.add("selected-answer");
      isPaused = true;

      confirmTimeout = setTimeout(() => {
        if (checkAnswer(correctAnswer, selectedAnswer)) {
          addNextButton(currentQuestionIndex, data);
        } else {
          isPaused = false;
          setQuestionTimer(currentQuestionIndex, data);
        }
      }, 2000);
    });

    quizContainer.appendChild(answerBlock);
  });
}

function setQuestionTimer(currentQuestionIndex, data) {
  clearInterval(timerInterval);

  if (timerElement) timerElement.remove();

  timerElement = document.createElement("p");
  timerElement.classList.add("timer");
  quizContainer.appendChild(timerElement);

  timerElement.textContent = `Time left: ${remainingTime}s`;

  timerInterval = setInterval(() => {
    if (!isPaused) {
      remainingTime--;
      timerElement.textContent = `Time left: ${remainingTime}s`;
      if (remainingTime === 0) {
        clearInterval(timerInterval);

        showCorrectAnswer(data[currentQuestionIndex].correct_answer);
        addNextButton(currentQuestionIndex, data);
        disableAnswerButtons();
      }
    }
  }, 1000);
}

function checkAnswer(correctAnswer, selectedAnswer) {
  if (!confirm("Potvrdi odgovor?")) {
    selectedAnswer.classList.remove("selected-answer");
    return false;
  }

  const isCorrect = correctAnswer.textContent === selectedAnswer.textContent;
  updateScoreAndStyle(correctAnswer, selectedAnswer, isCorrect);
  return true;
}

function updateScoreAndStyle(correctAnswer, selectedAnswer, isCorrect) {
  selectedAnswer.classList.add(isCorrect ? "correct" : "incorrect");

  if (isCorrect) {
    score++;
    scoreElement.textContent = `Score: ${score} / 5`;
  } else {
    correctAnswer.classList.add("correct");
  }

  disableAnswerButtons();
}

function showCorrectAnswer(correctText) {
  document.querySelectorAll(".answer-button").forEach((button) => {
    if (button.textContent === correctText) button.classList.add("correct");
  });
}

function addNextButton(currentQuestionIndex, data) {
  nextButton = createNextButton();
  nextButton.addEventListener("click", () =>
    displayQuestion(currentQuestionIndex + 1, data)
  );
  quizContainer.appendChild(nextButton);
}

export { showQuiz, score, quizHistory };
