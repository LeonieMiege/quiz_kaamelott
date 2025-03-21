import { quiz_kaamelott } from "./questions.js";


// .............on déclare nos variables
const question = document.querySelector("#question-text");
const choicesContainer = document.querySelector("#choices-container");
const message = document.querySelector('#message');
const progress = document.querySelector("#progress");
const progressText = document.querySelector("#progress-text");
const progressBarFull = document.querySelector("#progress-bar-full");
const timer = document.querySelector("#timer");
const nextButton = document.querySelector('#next-button');
const restartButton = document.querySelector("#restart-button");
let score = 0;
let currentQuestionIndex = 0;



// .............on déclare les fonctions
function loadQuestion() {
    const currentQuestion = quiz_kaamelott.questions[currentQuestionIndex];

    message.innerHTML = '';
    nextButton.disabled = true;
    choicesContainer.innerHTML = '';
    question.innerText = currentQuestion.text;
    progressText.innerText = `Question ${currentQuestionIndex + 1}/${quiz_kaamelott.questions.length}`;
    progressBarFull.style.width = `${((currentQuestionIndex + 1) / quiz_kaamelott.questions.length) * 100}%`;
    createButton(currentQuestion);
    checkChoice();
    createTimer();
}

function timeOut() {
    const allChoices = document.querySelectorAll('.choice');

    nextButton.disabled = false;
    message.innerHTML = '<img src="./media/lent.png"></img>';
    allChoices.forEach((element) => {
        element.disabled = true;
    });
}

function createTimer() {
    let time = 15;

    timer.innerText = `Temps restant : ${time} secondes`;
    let intervalID = setInterval(() => {
        if (!nextButton.disabled) {
            clearInterval(intervalID);
        }
        else if (time == 0) {
            clearInterval(intervalID);
            timeOut();
        }
        timer.innerText = `Temps restant : ${time} secondes`;
        time--;
    }, 1000);
}

function checkChoice() {
    const allChoices = document.querySelectorAll('.choice');

    allChoices.forEach((button) => {
        button.addEventListener("click", () => {
            compareAnswer(button);
            nextButton.disabled = false;
            allChoices.forEach((element) => {
                element.disabled = true;
            });
        });
    });
}

function createButton(currentQuestion) {
    currentQuestion.options.forEach((element) => {
        const choice = document.createElement('button');
        choice.innerText = element;
        choice.classList.add('choice');
        choicesContainer.appendChild(choice);
    });
}

function compareAnswer(selectedChoice) {
    if (selectedChoice.innerText == quiz_kaamelott.questions[currentQuestionIndex].correct_answer) {
        message.innerHTML = `<img src="./media/${quiz_kaamelott.questions[currentQuestionIndex].imageReponse[0]}.jpeg"></img>`;
        score++;
        selectedChoice.classList.add('correct');
    }
    else {
        message.innerHTML = `<img src="./media/${quiz_kaamelott.questions[currentQuestionIndex].imageReponse[1]}.jpeg"></img>`;
        selectedChoice.classList.add('wrong');
    }
    localStorage.setItem("score", score);
}

function showMessage(score) {
    if (score <= quiz_kaamelott.questions.length / 3) {
        message.innerHTML = '<img src="./media/fleche.jpeg"></img>';
    }
    else if ((score > quiz_kaamelott.questions.length / 3) && (score < quiz_kaamelott.questions.length * 2 / 3)) {
        message.innerHTML = '<img src="./media/pasfacile.jpeg"></img>';
    }
    else {
        message.innerHTML = '<img src="./media/pro.jpeg"></img>';
    }
}

function updateLocalStorage() {
    if (localStorage.getItem("currentQuestionIndex")) {
        score = Number(localStorage.getItem("score"));
        currentQuestionIndex = Number(localStorage.getItem("currentQuestionIndex"));
    }
}

// .................on execute les instructions, le code

updateLocalStorage();
loadQuestion();

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
    if (currentQuestionIndex < quiz_kaamelott.questions.length) {
        loadQuestion();
    } else {
        question.innerText = `Ton score est ${score}/${quiz_kaamelott.questions.length}`;
        choicesContainer.innerHTML = '';
        nextButton.style.display = 'none';
        restartButton.style.display = 'inline-block';
        progress.style.display = 'none';
        timer.style.display = "none";
        showMessage(score);
    }
})

restartButton.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    message.innerText = "";
    restartButton.style.display = 'none';
    nextButton.style.display = 'inline-block';
    progress.style.display = 'block';
    timer.style.display = "block";
    localStorage.removeItem("currentQuestionIndex");
    localStorage.removeItem("score");
    loadQuestion();
})