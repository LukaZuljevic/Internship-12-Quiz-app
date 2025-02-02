import { fetchTriviaQuiz } from "./api.js";

const form = document.querySelector("form");
const sumbitButton = document.querySelector("#submit-button");
const quizContainer = document.querySelector(".quiz-container");
const startButton = document.createElement("button");
const body = document.querySelector("body");

sumbitButton.addEventListener("click", (event) => {
  event.preventDefault();

  const category = document.querySelector("#category").value;
  const difficulty = document.querySelector("#difficulty").value;
  const gameType = document.querySelector("#game-type").value;

  const params = new URLSearchParams({
    amount: 5,
    category: category,
    difficulty: difficulty,
    type: gameType,
  });

  fetchTriviaQuiz(params).then((data) => {
    console.log(data);

    if (data.length > 0) {
      form.style.display = "none";
      createStartButton(data);
    }
  });
});

function createStartButton(data) {
  startButton.textContent = "Start";
  startButton.classList.add("start-button");
  startButton.addEventListener("click", () => showQuiz(data));

  body.appendChild(startButton);
}

function showQuiz(data) {
  startButton.style.display = "none";
  quizContainer.innerHTML = "";

  data.forEach((item) => {
    const question = document.createElement("h3");
    question.textContent = item.question;
    quizContainer.appendChild(question);

    const answers = [...item.incorrect_answers, item.correct_answer].sort(
      () => Math.random() - 0.5
    );

    answers.forEach((answer) => {
      const answerBlock = document.createElement("p");
      answerBlock.textContent = answer;

      answerBlock.addEventListener("click", (event) =>
        checkAnswer(data, event)
      );

      quizContainer.appendChild(answerBlock);
    });

    // quizContainer.innerHTML = "";
  });
}

function checkAnswer(data, event) {
  console.log(event.target);
}
