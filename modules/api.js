async function fetchTriviaQuiz(params) {
  try {
    const res = await fetch(`https://opentdb.com/api.php?${params.toString()}`);

    const data = await res.json();

    return data.results;
  } catch (error) {
    console.error(error);
  }
}

export { fetchTriviaQuiz };
