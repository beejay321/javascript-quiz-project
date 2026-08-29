class Quiz {
  constructor(questions, timeLimit, timeRemaining) {
    this.questions = questions;
    this.timeLimit = timeLimit;
    this.timeRemaining = timeRemaining;
    this.correctAnswers = 0;
    this.currentQuestionIndex = 0;
  }

  getQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  moveToNextQuestion() {
    this.currentQuestionIndex += 1;
  }

  shuffleQuestions() {
    for (let i = this.questions.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));

      [this.questions[i], this.questions[randomIndex]] = [
        this.questions[randomIndex],
        this.questions[i],
      ];
    }
  }

  checkAnswer(answer) {
    const currentQuestion = this.getQuestion();

    if (answer === currentQuestion.answer) {
      this.correctAnswers += 1;
    }
  }

  hasEnded() {
    return this.currentQuestionIndex === this.questions.length;
  }

  filterQuestionsByDifficulty(difficulty) {
    if (typeof difficulty !== "number" || difficulty < 1 || difficulty > 3) {
      return;
    }

    this.questions = this.questions.filter((question) => {
      return question.difficulty === difficulty;
    });
  }

  averageDifficulty() {
    if (this.questions.length === 0) {
      return 0;
    }

    const totalDifficulty = this.questions.reduce((total, question) => {
      return total + question.difficulty;
    }, 0);

    return totalDifficulty / this.questions.length;
  }
}
