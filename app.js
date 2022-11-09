
function createQuestion(question, options, correctAnswerIndex) {
    return {
        question,
        options,
        correctAnswer: options[correctAnswerIndex],
        answerIndex: null,
        isCorrect() {
            return this.options[this.answerIndex] == this.correctAnswer
        }
    }
}


let questions = [];

questions.push(
    createQuestion(
        'Which of the following is not a valid JavaScript variable name?',
        [
            '2java',
            '_java_and_java_names',
            'javaandjava',
            'None of the above'
        ],
        0
    ),
    createQuestion(
        'Why Java and JavaScript have similar name?',
        [
            'Javascript is a stripped-down version of Java',
            'The syntax of JavaScript is loosely based on Java syntax',
            'They both support Object Oriented Programming',
            'None of the above'
        ],
        1
    ),
    createQuestion(
        'What is the alternate name for Javascript?',
        [
            'CoffeeScript',
            'ECMScript',
            'ECMAScript',
            'Both a and b'
        ],
        2
    )
);



let currentQuestionIndex = 0;
let nextBtn = document.querySelector('button');
window.addEventListener('load', displayQuestion);


function displayQuestion() {
    let question = document.querySelector('.question');
    let options = document.querySelector('.options ul');
    let questionObj = questions[currentQuestionIndex];

    question.innerHTML = `
        <h4>Question ${currentQuestionIndex + 1}/${questions.length}</h4>
        <h3>${questionObj.question}</h3>
    `;

    options.innerHTML = '';

    questionObj.options.forEach((option, i) => {
        options.appendChild(createOption(option, i));
    })

    attachEventListener(options);
    updateProgressBar();
}


function createOption(option, i) {
    let li = document.createElement('li');
    li.setAttribute('data-option-index', i);

    let span = document.createElement('span');
    span.classList.add('letter');

    span.innerHTML = toLetters(i + 1);
    li.appendChild(span);

    li.innerHTML += option;

    return li;
}


function toLetters(num) {
    let mod = num % 26,
        pow = num / 26 | 0,
        out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? toLetters(pow) + out : out;
}


function attachEventListener(options) {
    let lists = options.querySelectorAll('li');

    lists.forEach(li => {
        li.addEventListener('click', () => {
            let selectedIndex = li.getAttribute('data-option-index');
            questions[currentQuestionIndex].answerIndex = selectedIndex;

            lists.forEach(li => li.classList.remove('selected'));
            li.classList.add('selected');

            nextBtn.classList.remove('disable');
        })
    })
}


nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;

    if(currentQuestionIndex < questions.length) {
        displayQuestion();
        updateProgressBar();
        nextBtn.classList.add('disable');
    } else {
        getResult();
    }
})


function updateProgressBar() {
    let progressBarWidth = (100 * (currentQuestionIndex + 1)) / questions.length;
    document.documentElement.style.setProperty('--progress-width', progressBarWidth + '%');
}


function getResult() {
    let wrongAnswers = [];

    questions.forEach(obj => {
        if(!obj.isCorrect()) {
            wrongAnswers.push(obj);
        }
    })

    let quizContainer = document.querySelector('.quiz__container');
    let resultText;

    if(wrongAnswers.length) {
        resultText = `<div class="resultText">You scored ${questions.length - wrongAnswers.length} out of ${questions.length}</div>`;
    } else {
        resultText = `<div class="resultText">Well Done! You scored ${questions.length} out of ${questions.length}</div>`;
    }

    quizContainer.innerHTML = resultText;
}