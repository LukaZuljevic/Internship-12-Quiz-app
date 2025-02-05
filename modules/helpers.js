function resetAnswerStyles() {
  document.querySelectorAll(".answer-button").forEach((button) => {
    button.classList.remove("selected-answer", "correct", "incorrect");
  });
}

function createNextButton() {
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next question";
  nextButton.classList.add("start-button");

  return nextButton;
}

function createAnswerButton(answer) {
  const answerBlock = document.createElement("button");
  answerBlock.textContent = answer;
  answerBlock.classList.add("answer-button");

  return answerBlock;
}

function createResult(score) {
  const result = document.createElement("p");
  result.classList.add("quiz-results");
  result.textContent = `Your score: ${score} / 5`;

  return result;
}

function createGoBackButton() {
  const goBackButton = document.createElement("button");
  goBackButton.classList.add("go-back-button");
  goBackButton.textContent = "Go back";

  return goBackButton;
}

function disableAnswerButtons() {
  document
    .querySelectorAll(".answer-button")
    .forEach((button) => (button.disabled = true));
}

export {
  resetAnswerStyles,
  createNextButton,
  createAnswerButton,
  createResult,
  createGoBackButton,
  disableAnswerButtons,
};
