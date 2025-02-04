import { resetAnswerStyles } from "./helpers.js";

const quizContainer = document.querySelector(".quiz-container");

let nextButton = null;
let score = 0;

let timerElement = null;
let timerInterval;
let remainingTime = 20;
let isPaused = false;

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

  appendAnswers(currentQuestionIndex, data, item);

  setQuestionTimer(currentQuestionIndex, data, remainingTime);
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
    const answerBlock = document.createElement("button");

    answerBlock.textContent = answer;
    answerBlock.classList.add("answer-button");

    if (answerBlock.textContent === item.correct_answer)
      correctAnswer = answerBlock;

    answerBlock.addEventListener("click", (event) => {
      clearTimeout(confirmTimeout);
      resetAnswerStyles();

      selectedAnswer = event.target;
      selectedAnswer.classList.add("selected-answer");

      if (!isPaused) isPaused = true;

      confirmTimeout = setTimeout(() => {
        const isConfirmed = checkAnswer(correctAnswer, selectedAnswer);

        if (isConfirmed) {
          nextButton = createNextButton(currentQuestionIndex, data);
          quizContainer.appendChild(nextButton);
        } else {
          isPaused = false;
          setQuestionTimer(currentQuestionIndex, data, remainingTime);
        }
      }, 2000);
    });

    quizContainer.appendChild(answerBlock);
  });
}

function setQuestionTimer(currentQuestionIndex, data, resumeTime) {
  clearInterval(timerInterval);
  remainingTime = resumeTime;

  if (!timerElement || !quizContainer.contains(timerElement)) {
    timerElement = document.createElement("p");

    timerElement.classList.add("timer");
    quizContainer.appendChild(timerElement);
  }

  timerElement.textContent = `Time left: ${remainingTime}s`;

  timerInterval = setInterval(() => {
    if (!isPaused) {
      remainingTime--;
      timerElement.textContent = `Time left: ${remainingTime}s`;

      if (remainingTime === 0) {
        clearInterval(timerInterval);

        showCorrectAnswer(data, currentQuestionIndex);
        nextButton = createNextButton(currentQuestionIndex, data);

        quizContainer.appendChild(nextButton);
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

function createNextButton(currentQuestionIndex, data) {
  const nextButton = document.createElement("button");

  nextButton.textContent = "Next question";
  nextButton.classList.add("start-button");
  nextButton.addEventListener("click", () =>
    displayQuestion(currentQuestionIndex + 1, data)
  );

  return nextButton;
}

function updateScoreAndStyle(correctAnswer, selectedAnswer, isCorrect) {
  selectedAnswer.classList.add(isCorrect ? "correct" : "incorrect");

  if (isCorrect) {
    score++;
  } else {
    correctAnswer.classList.add("correct");
  }
}

function showCorrectAnswer(data, currentQuestionIndex) {
  document.querySelectorAll(".answer-button").forEach((button) => {
    if (button.textContent === data[currentQuestionIndex].correct_answer)
      button.classList.add("correct");
  });
}

function showResults() {
  quizContainer.innerHTML = `<p class="quiz-results">Your score: ${score} / 5</p>`;
  quizContainer.classList.add("quiz-results-container");
}

export { showQuiz };
