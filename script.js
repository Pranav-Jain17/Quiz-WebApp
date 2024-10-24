// Global Variables
let username;
let score = 0;
let attemptedQuestions = 0;
let unattemptedQuestions = 0;
let timer;
let timeLeft = 60; // 60 seconds for the quiz
let questions = [];
let currentQuestionIndex = 0;

// Fetch Questions from JSON
function fetchQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            unattemptedQuestions = questions.length;
            startQuiz();
        })
        .catch(err => console.error("Failed to fetch questions:", err));
}

// Start Quiz
function startQuiz() {
    resetQuiz();
    startTimer();
    displayQuestion();
}

// Reset Quiz
function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    attemptedQuestions = 0;
    unattemptedQuestions = questions.length;
    timeLeft = 60; // Reset timer
    updateStatusBar();
}

// Timer
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timerDisplay").innerText = timeLeft;
        if (timeLeft <= 0) {
            endQuiz();
        }
    }, 1000);
}

// Display Question
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("question").innerText = question.question;

    const choices = Array.from(document.getElementsByClassName('choice-container'));
    choices.forEach((choice, index) => {
        choice.querySelector('.choice-text').innerText = question['choice' + (index + 1)];
        choice.classList.remove("selected", "correct", "incorrect");

        // Set the onclick event for each choice
        choice.onclick = () => handleChoice(choice, question.answer, index + 1);
    });

    updateProgressBar();
}

// Handle Choice Selection
function handleChoice(choice, correctAnswer, selectedAnswer) {
    if (!choice.classList.contains("selected")) {
        attemptedQuestions++;
        unattemptedQuestions--;
        updateStatusBar();
    }

    choice.classList.add("selected");
    const classToApply = selectedAnswer === correctAnswer ? 'correct' : 'incorrect';

    // Update the score
    score += classToApply === 'correct' ? 1 : -1;
    document.getElementById("score").innerText = score;
    choice.classList.add(classToApply);

    const choices = Array.from(document.getElementsByClassName('choice-container'));
    choices.forEach(c => c.onclick = null); // Remove click events for other choices

    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            endQuiz();
        }
    }, 1000);
}

// Update Status Bar
function updateStatusBar() {
    document.getElementById("attempted").innerText = attemptedQuestions;
    document.getElementById("unattempted").innerText = unattemptedQuestions;
}

// Update Progress Bar
function updateProgressBar() {
    const progressBarFull = document.getElementById('progressBarFull');
    progressBarFull.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
    document.getElementById("progressText").innerText = `Question ${currentQuestionIndex + 1}/${questions.length}`;
}

// End Quiz
function endQuiz() {
    clearInterval(timer);
    localStorage.setItem('mostRecentScore', score);
    window.location.assign('/end.html');
}

// Initialize Username
function init() {
    username = localStorage.getItem('username');
    if (!username) {
        window.location.assign('/');
    }
    document.getElementById('usernameDisplay').innerText = `Welcome, ${username}!`;
}

// Call functions on page load
init();
fetchQuestions();
