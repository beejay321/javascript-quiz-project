document.addEventListener("DOMContentLoaded", () => {
  const quizView = document.querySelector("#quizView");
  const endView = document.querySelector("#endView");

  const progressBar = document.querySelector("#progressBar");
  const questionCount = document.querySelector("#questionCount");
  const questionContainer = document.querySelector("#question");
  const choiceContainer = document.querySelector("#choices");
  const nextButton = document.querySelector("#nextButton");
  const timeRemainingContainer = document.querySelector("#timeRemaining");

  const resultContainer = document.querySelector("#result");
  const resetButton = document.querySelector("#resetButton");

  const questions = [
    new Question("What is 2 + 2?", ["3", "4", "5", "6"], "4", 1),
    new Question(
      "What is the capital of France?",
      ["Miami", "Paris", "Oslo", "Rome"],
      "Paris",
      1,
    ),
    new Question(
      "Who created JavaScript?",
      ["Plato", "Brendan Eich", "Lea Verou", "Bill Gates"],
      "Brendan Eich",
      2,
    ),
    new Question(
      "What is the mass–energy equivalence equation?",
      ["E = mc^2", "E = m*c^2", "E = m*c^3", "E = m*c"],
      "E = mc^2",
      3,
    ),
  ];

  const quizDuration = 120;
  const quiz = new Quiz(questions, quizDuration, quizDuration);

  let timer;

  quizView.style.display = "block";
  endView.style.display = "none";

  quiz.shuffleQuestions();
  showQuestion();
  updateTimerDisplay();
  startTimer();

  nextButton.addEventListener("click", nextButtonHandler);
  resetButton.addEventListener("click", resetQuiz);

  function showQuestion() {
    if (quiz.hasEnded()) {
      showResults();
      return;
    }

    const currentQuestion = quiz.getQuestion();

    questionContainer.innerText = currentQuestion.text;
    choiceContainer.innerHTML = "";

    currentQuestion.shuffleChoices();

    const progressPercentage =
      (quiz.currentQuestionIndex / quiz.questions.length) * 100;

    progressBar.style.width = `${progressPercentage}%`;

    questionCount.innerText = `Question ${
      quiz.currentQuestionIndex + 1
    } of ${quiz.questions.length}`;

    currentQuestion.choices.forEach((choice, index) => {
      const choiceInput = document.createElement("input");
      choiceInput.type = "radio";
      choiceInput.name = "choice";
      choiceInput.value = choice;
      choiceInput.id = `choice-${index}`;

      const choiceLabel = document.createElement("label");
      choiceLabel.innerText = choice;
      choiceLabel.htmlFor = `choice-${index}`;

      const lineBreak = document.createElement("br");

      choiceContainer.appendChild(choiceInput);
      choiceContainer.appendChild(choiceLabel);
      choiceContainer.appendChild(lineBreak);
    });
  }

  function nextButtonHandler() {
    const choiceElements = document.querySelectorAll('input[name="choice"]');

    let selectedAnswer;

    choiceElements.forEach((choiceElement) => {
      if (choiceElement.checked) {
        selectedAnswer = choiceElement.value;
      }
    });

    if (!selectedAnswer) {
      return;
    }

    quiz.checkAnswer(selectedAnswer);
    quiz.moveToNextQuestion();
    showQuestion();
  }

  function showResults() {
    clearInterval(timer);

    quizView.style.display = "none";
    endView.style.display = "flex";

    resultContainer.innerText = `You scored ${quiz.correctAnswers} out of ${quiz.questions.length} correct answers!`;
  }

  function resetQuiz() {
    clearInterval(timer);

    quiz.currentQuestionIndex = 0;
    quiz.correctAnswers = 0;
    quiz.timeRemaining = quiz.timeLimit;

    quiz.shuffleQuestions();

    endView.style.display = "none";
    quizView.style.display = "block";

    updateTimerDisplay();
    showQuestion();
    startTimer();
  }

  function startTimer() {
    timer = setInterval(() => {
      quiz.timeRemaining -= 1;
      updateTimerDisplay();

      if (quiz.timeRemaining <= 0) {
        quiz.timeRemaining = 0;
        updateTimerDisplay();
        showResults();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(quiz.timeRemaining / 60)
      .toString()
      .padStart(2, "0");

    const seconds = (quiz.timeRemaining % 60).toString().padStart(2, "0");

    timeRemainingContainer.innerText = `${minutes}:${seconds}`;
  }
});
