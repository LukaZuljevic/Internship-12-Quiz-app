import { fetchTriviaQuiz } from "./api.js";

const sumbitButton = document.querySelector("#submit-button");

const startButton = document.createElement("button");
startButton.textContent = "Start Quiz";

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
  });
});
