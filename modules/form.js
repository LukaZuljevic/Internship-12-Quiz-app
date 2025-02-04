import { fetchTriviaQuiz } from "./api.js";
import { showQuiz } from "./quiz.js";

const form = document.querySelector("form");
const submitButton = document.querySelector("#submit-button");
const body = document.querySelector("body");

submitButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const category = document.querySelector("#category").value;
  const difficulty = document.querySelector("#difficulty").value;
  const gameType = document.querySelector("#game-type").value;

  const params = new URLSearchParams({
    amount: 2,
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

  startButton.textContent = "Start quiz";
  startButton.classList.add("start-button");
  startButton.addEventListener("click", () => showQuiz(data, startButton));

  body.appendChild(startButton);
}
