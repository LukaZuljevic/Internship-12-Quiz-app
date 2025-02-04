function resetAnswerStyles() {
  document.querySelectorAll(".answer-button").forEach((button) => {
    button.classList.remove("selected-answer", "correct", "incorrect");
  });
}

export { resetAnswerStyles };
