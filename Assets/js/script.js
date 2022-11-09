// Select element with <header> tag
var headerEl = document.querySelector("header");
// Select element by class
var cardEl = document.querySelector(".card");
var timerEl = document.querySelector(".timer");
var quizEl = document.querySelector(".quiz");
// Select element by ID
var scoreEl = document.getElementById("viewScores");
var messageEl = document.getElementById("message");

// Define variables
var secondsLeft;
var shuffledQuestions;
var currentIndex;
var userScores = [];
var timerInterval;

// Construct the quiz questions
const questions = [
    {
      question: `Commonly used data types DO NOT include:`,
      options: [`strings`, `booleans`, `alerts`, `numbers`],
      answer: `alerts`
    },
    {
      question: `The condition in an if/else statement is enclosed within ______.`,
      options: [`quotes`, `curly brackets`, `parentheses`, `square brackets`],
      answer: `curly brackets`
    },
    {
      question: `Arrays in javascript can be used to store ______.`,
      options: [`numbers and strings`, `other arrays`, `booleans`, `all of the options`],
      answer: `all of the options`
    },
    {
      question: `String values must be enclosed with ______ when being assigned to variables.`,
      options: [`commas`, `curly brackets`, `quotes`, `parentheses`],
      answer: `quotes`
    },
    {
      question: `A very useful tool used during development and debugging for printing content to the debugger is:`,
      options: [`javascript`, `terminal/bash`, `for loops`, `console log`],
      answer: `console log`
    }
];  


document.addEventListener("DOMContentLoaded", function(event){
    // Retrieve the saved initials and scores
    var storedScores = JSON.parse(localStorage.getItem("userScores"));
    if (storedScores !== null) {
        userScores = storedScores;
    }
    // Load the list of high scores after button click
    scoreEl.addEventListener('click', function(event) {
        renderScores();
    });
    start();
})

// Load the start page
function start() {
    // Set defaults
    cardEl.innerHTML = ``;
    quizEl.innerHTML = ``;
    // Set text alignment
    cardEl.style.textAlign = `center`;
    headerEl.style.visibility = `visible`;
    messageEl.style.visibility = `hidden`;
    secondsLeft = 0;
    timerEl.textContent = `Time: ${secondsLeft}`;
    
    // Set elements on the page
    var titleEl = document.createElement(`h1`);
    var descriptionEl = document.createElement(`p`);
    var startBtn = document.createElement(`button`);
    // Set the position of start button
    startBtn.style.marginLeft = `0`;
    titleEl.textContent = `Coding Quiz Challenge`;
    descriptionEl.textContent = `Try to answer the following multiple-choice questions within the time limit. 
                                Keep in mind that each incorrect answer will penalize your scoretime by 10 seconds.`;
    startBtn.textContent = `Start Quiz`;
    // Add elements to the form
    cardEl.appendChild(titleEl);
    cardEl.appendChild(descriptionEl);
    cardEl.appendChild(startBtn);

    // Start the quiz after button click
    startBtn.addEventListener('click', function(event) { 
        // Shuffle the order of questions
        shuffledQuestions = shuffle(questions);
        // Set the question index to first question 
        currentIndex = 0;
        // Set default max time
        secondsLeft = 75;
        // Cancel the previous timer
        clearInterval(timerInterval);
        handleNext();
        setTime();
    })
}

function setTime() {
    // Set interval in variable
    timerInterval = setInterval(function() {
        // Prevent negative scores
        if (secondsLeft < 0) {
            secondsLeft = 0;
        }
        timerEl.textContent = `Time: ${secondsLeft}`;   
        if(secondsLeft <= 0 || currentIndex === questions.length) {     
            // Stop execution of action at set interval
            clearInterval(timerInterval);
            // End the quiz
            submitQuiz();
        } else {
            secondsLeft--;
        }  
    }, 1000);
}
  
function handleNext() {
    // Render quiz question if time left is not 0 and index of question is within range
    if (secondsLeft > 0 && currentIndex < questions.length) {     
        renderQuestion();
    }
}

function renderQuestion() {
    cardEl.innerHTML = ``;
    quizEl.innerHTML = ``;
    var questionEl = document.createElement(`h2`);
    var buttonList = document.createElement(`ul`);
    quizEl.appendChild(questionEl);
    quizEl.appendChild(buttonList);
    // Display a quiz question
    var quizQuestion = shuffledQuestions[currentIndex];
    questionEl.textContent = quizQuestion.question;
    // Shuffle options
    var shuffledOptions = shuffle(quizQuestion.options);
    // Display the multiple choice options
    for (var i = 0; i < shuffledOptions.length; i++) {
        var option = shuffledOptions[i];
        var li = document.createElement(`li`);
        var optionBtn = document.createElement(`button`);
        optionBtn.setAttribute(`data`, option);
        optionBtn.textContent = `${i+1}. ${option}`;
        // Display the option buttons as list elements
        li.appendChild(optionBtn);
        buttonList.appendChild(li);
        // Get user input from the clicked option button
        optionBtn.addEventListener('click', function(event) { 
            event.preventDefault();
            // Inform user if user input and quiz answer matched
            if (event.target.getAttribute(`data`) === quizQuestion.answer) {
                messageEl.style.visibility = `visible`;
                displayMessage(`Correct!`);              
            } else {
                // Deduct 10 seconds from time if user input is incorrect
                secondsLeft -= 10;
                messageEl.style.visibility = `visible`;
                displayMessage(`Wrong!`);   
            }
            // Next question
            currentIndex++;
            handleNext();
        });
    }
}

function submitQuiz () {
    // Setup the form
    quizEl.innerHTML = ``;
    var questionEl = document.createElement(`h2`);
    quizEl.appendChild(questionEl);
    questionEl.textContent = `All done!`;
    var score = document.createElement(`p`);
    var initInput = document.createElement(`input`);
    var initSpan = document.createElement(`span`);
    var submitBtn = document.createElement(`button`);
    submitBtn.textContent = `Submit`;
    score.textContent = `Your final score is ${secondsLeft}.`;
    initSpan.textContent = `Enter initials: `;
    // Append elements to the form
    quizEl.appendChild(score);
    quizEl.appendChild(initSpan);
    quizEl.appendChild(initInput);
    quizEl.appendChild(submitBtn);
    // Submit quiz
    submitBtn.addEventListener(`click`, function(event) {
        event.preventDefault();
        var init = initInput.value.trim().toUpperCase(); 
        if(init === ``) {
            // Display message if user input is empty
            messageEl.style.visibility = `visible`;
            displayMessage(`Initials: Cannot be blank`);
        } else if(!/^[A-Z]+$/.test(init)) {
            // Display message if user input contains inappropriate characters
            messageEl.style.visibility = `visible`;
            displayMessage(`Initials: Letters only`);
        } else {
            // Cleanup the form
            initInput.value = ``;
            quizEl.innerHTML = ``;
            // Store user scores
            var userScore = {initials: init, score: secondsLeft};
            userScores.push(userScore);
            storeScores() 
            // Display user scores
            renderScores();
        }
    });
}

// Store user scores in localStorage
function storeScores() {
    localStorage.setItem(`userScores`, JSON.stringify(userScores));
}

function renderScores() {
    clearInterval(timerInterval);
    quizEl.innerHTML = ``;
    cardEl.innerHTML = ``;
    cardEl.style.textAlign = `left`;
    // Hide header when showing high scores
    headerEl.style.visibility = `hidden`;
    // Define elements on the form
    var h2El = document.createElement(`h2`);
    var resultsEl = document.createElement(`ul`);
    var backBtn = document.createElement(`button`);
    var clearBtn = document.createElement(`button`);
    h2El.textContent = `High Scores`;
    backBtn.textContent = `Go Back`;
    clearBtn.textContent = `Clear High Scores`;
    resultsEl.innerHTML = ``;
    // Sort user scores from high to low
    userScores.sort((a, b) => b.score - a.score);
    // Format each user score
    for (var i = 0; i < userScores.length; i++) {
        var info = userScores[i];
        var li = document.createElement("li");
        li.textContent = `${i+1}.   ${info.initials} - ${info.score}`;
        resultsEl.appendChild(li);
    }
    // Add defined elements to the form
    cardEl.appendChild(h2El);
    cardEl.appendChild(resultsEl);
    cardEl.appendChild(backBtn);
    cardEl.appendChild(clearBtn);

    // Go back to the starting state
    backBtn.addEventListener(`click`, function(event) {
        start();
    });

    // Clear all the stored scores
    clearBtn.addEventListener(`click`, function(event) {
        event.preventDefault();
        resultsEl.innerHTML = ``;
        userScores = [];
        localStorage.clear();
    });
}

function displayMessage(msg) {
    messageEl.textContent = msg;
    // Display message for 2 seconds
    setTimeout(function(){
        messageEl.textContent = '';
        messageEl.style.visibility = `hidden`;
    }, 2000);
}

// Shuffle array to make it random
function shuffle(array) {
    let i = array.length,  j;
    while (i != 0) {
      j = Math.floor(Math.random() * i);
      i--;
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
