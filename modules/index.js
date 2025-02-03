import { fetchTriviaQuiz } from "./api.js";

const form = document.querySelector("form");
const submitButton = document.querySelector("#submit-button");
const quizContainer = document.querySelector(".quiz-container");
const body = document.querySelector("body");

let score = 0;
let timerInterval;
let remainingTime = 20;
let isPaused = false;
let timerElement = null;

submitButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const category = document.querySelector("#category").value;
  const difficulty = document.querySelector("#difficulty").value;
  const gameType = document.querySelector("#game-type").value;

  const params = new URLSearchParams({
    amount: 5,
    difficulty: difficulty,
    type: gameType,
  });

  if (category) params.append("category", category);

  const data = await fetchTriviaQuiz(params);

  if (data.length > 0) {
    form.style.display = "none";
    createStartButton(data);
  }
});

function createStartButton(data) {
  const startButton = document.createElement("button");
  startButton.textContent = "Start Quiz";
  startButton.classList.add("start-button");
  startButton.addEventListener("click", () => showQuiz(data, startButton));

  body.appendChild(startButton);
}

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
    showResults();
    return;
  }

  const item = data[currentQuestionIndex];

  appendQuestion(item);

  getAnswers(currentQuestionIndex, data, item);

  setQuestionTimer(currentQuestionIndex, data, remainingTime);
}

function appendQuestion(item) {
  const question = document.createElement("h3");
  question.innerHTML = item.question;
  quizContainer.appendChild(question);
}

function getAnswers(currentQuestionIndex, data, item) {
  const answers = [...item.incorrect_answers, item.correct_answer].sort(
    () => Math.random() - 0.5
  );

  let selectedAnswer = null;
  let confirmTimeout;

  answers.forEach((answer) => {
    const answerBlock = document.createElement("button");
    answerBlock.textContent = answer;
    answerBlock.classList.add("answer-button");

    answerBlock.addEventListener("click", (event) => {
      clearTimeout(confirmTimeout);
      resetAnswerStyles();

      selectedAnswer = event.target;
      selectedAnswer.classList.add("selected-answer");

      if (!isPaused) {
        clearInterval(timerInterval);
        isPaused = true;
      }

      confirmTimeout = setTimeout(() => {
        const isConfirmed = checkAnswer(item, selectedAnswer);

        if (isConfirmed) {
          showAnswerFeedback(selectedAnswer, isConfirmed);
          displayQuestion(currentQuestionIndex + 1, data);
        } else {
          isPaused = false;

          setQuestionTimer(currentQuestionIndex, data, remainingTime);
        }
      }, 2000);
    });

    quizContainer.appendChild(answerBlock);
  });
}

function resetAnswerStyles() {
  document.querySelectorAll(".answer-button").forEach((button) => {
    button.classList.remove("selected-answer", "correct", "incorrect");
  });
}

function checkAnswer(item, selectedAnswer) {
  const isCorrect = item.correct_answer === selectedAnswer.textContent;

  if (confirm("Potvrdi odgovor?")) {
    if (isCorrect) {
      score++;
      selectedAnswer.classList.add("correct");
    }
    return true;
  } else {
    selectedAnswer.classList.add("incorrect");
    return false;
  }
}

function showAnswerFeedback(selectedAnswer, isCorrect) {
  selectedAnswer.classList.add(isCorrect ? "correct" : "incorrect");
}

function setQuestionTimer(currentQuestionIndex, data, resumeTime = 20) {
  clearInterval(timerInterval);
  remainingTime = resumeTime;

  if (!timerElement || !quizContainer.contains(timerElement)) {
    timerElement = document.createElement("p");
    quizContainer.appendChild(timerElement);
  }

  timerElement.textContent = `Time left: ${remainingTime}s`;

  timerInterval = setInterval(() => {
    if (!isPaused) {
      remainingTime--;
      timerElement.textContent = `Time left: ${remainingTime}s`;

      if (remainingTime === 0) {
        clearInterval(timerInterval);
        displayQuestion(currentQuestionIndex + 1, data);
      }
    }
  }, 1000);
}

function showResults() {
  quizContainer.innerHTML = `<p>Your score: ${score} / 5</p>`;
  quizContainer.classList.add("quiz-results");
  timerElement = null;
}
