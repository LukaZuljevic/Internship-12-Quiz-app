import { score, quizHistory } from "./quiz.js";
import { createResult, createGoBackButton } from "./helpers.js";

const resultMessages = [
  "Moras bolje!",
  "Dovoljno, ali ne dobro",
  "Dobro, ali moze bolje",
  "Odlicno, malo je falilo za sve tocno",
  "Svih 5 tocnih odgovora, cestitan!",
];

const quizContainer = document.querySelector(".quiz-container");
const body = document.querySelector("body");

function showResults() {
  const result = createResult(score);

  const message = document.createElement("p");
  message.classList.add("quiz-results-message");
  message.textContent = score < 2 ? resultMessages[0] : resultMessages[score];

  const goBackButton = createGoBackButton();
  goBackButton.addEventListener("click", () => location.reload());

  quizContainer.appendChild(message);
  quizContainer.appendChild(result);
  quizContainer.appendChild(goBackButton);

  quizContainer.classList.add("quiz-results-container");
}

function showHistory() {
  const historyContainer = document.createElement("div");
  historyContainer.classList.add("quiz-history-container");

  quizHistory.forEach((result) => {
    const resultElement = document.createElement("p");
    resultElement.classList.add("quiz-history-item");
    resultElement.textContent = `Score: ${result.score} / 5  -  Difficulty: ${result.difficulty}  -  Category: ${result.category}  -  Date: ${result.date}`;

    historyContainer.appendChild(resultElement);
  });

  body.appendChild(historyContainer);
}

export { showResults, showHistory };
