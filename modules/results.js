import { getScore } from "./quiz.js";

const resultMessages = [
  "Moras bolje!",
  "Dovoljno, ali ne dobro",
  "Dobro, ali moze bolje",
  "Odlicno, samo jos malo",
  "Skoro sve tocno, svaka cast!",
  "Svih 5 tocnih odgovora, cestitan!",
];
const quizContainer = document.querySelector(".quiz-container");

function showResults() {
  const result = document.createElement("p");
  result.classList.add("quiz-results");
  result.textContent = `Your score: ${getScore()} / 5`;

  const message = document.createElement("p");
  message.classList.add("quiz-results-message");
  message.textContent = resultMessages[getScore()];

  const goBackButton = document.createElement("button");
  goBackButton.classList.add("go-back-button");
  goBackButton.textContent = "Go back";

  goBackButton.addEventListener("click", () => location.reload());

  quizContainer.appendChild(message);
  quizContainer.appendChild(result);
  quizContainer.appendChild(goBackButton);

  quizContainer.classList.add("quiz-results-container");
}

export { showResults };
