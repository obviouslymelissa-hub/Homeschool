// Game state
let correctAnswers = 0;
let incorrectAnswers = 0;
let currentAnswer = 0;

// DOM elements
const num1Element = document.getElementById('num1');
const num2Element = document.getElementById('num2');
const operatorElement = document.getElementById('operator');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit');
const newProblemButton = document.getElementById('new-problem');
const resetButton = document.getElementById('reset');
const feedbackElement = document.getElementById('feedback');
const correctElement = document.getElementById('correct');
const incorrectElement = document.getElementById('incorrect');
const totalElement = document.getElementById('total');
const difficultySelect = document.getElementById('difficulty');
const operationSelect = document.getElementById('operation');

// Initialize the game
function init() {
    generateNewProblem();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    submitButton.addEventListener('click', checkAnswer);
    newProblemButton.addEventListener('click', generateNewProblem);
    resetButton.addEventListener('click', resetScore);
    
    // Allow Enter key to submit answer
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // Generate new problem when settings change
    difficultySelect.addEventListener('change', generateNewProblem);
    operationSelect.addEventListener('change', generateNewProblem);
}

// Get random number based on difficulty
function getRandomNumber() {
    const difficulty = difficultySelect.value;
    let max;
    
    switch(difficulty) {
        case 'easy':
            max = 10;
            break;
        case 'medium':
            max = 50;
            break;
        case 'hard':
            max = 100;
            break;
        default:
            max = 50;
    }
    
    return Math.floor(Math.random() * max) + 1;
}

// Get operator symbol
function getOperatorSymbol(operation) {
    switch(operation) {
        case 'addition':
            return '+';
        case 'subtraction':
            return '-';
        case 'multiplication':
            return '×';
        case 'division':
            return '÷';
        default:
            return '+';
    }
}

// Calculate answer based on operation
function calculateAnswer(num1, num2, operation) {
    switch(operation) {
        case 'addition':
            return num1 + num2;
        case 'subtraction':
            return num1 - num2;
        case 'multiplication':
            return num1 * num2;
        case 'division':
            // Division always returns whole numbers because num1 is always a multiple of num2
            return num1 / num2;
        default:
            return num1 + num2;
    }
}

// Generate new problem
function generateNewProblem() {
    const operation = operationSelect.value;
    let num1, num2;
    
    if (operation === 'division') {
        // For division, generate numbers that ensure whole number results
        // Get a smaller multiplier to keep division problems manageable
        const difficulty = difficultySelect.value;
        let maxMultiplier;
        switch(difficulty) {
            case 'easy':
                maxMultiplier = 10;
                break;
            case 'medium':
                maxMultiplier = 12;
                break;
            case 'hard':
                maxMultiplier = 15;
                break;
            default:
                maxMultiplier = 12;
        }
        const multiplier = Math.floor(Math.random() * maxMultiplier) + 1;
        num2 = getRandomNumber();
        num1 = num2 * multiplier; // Make num1 a multiple of num2
    } else {
        // For other operations, generate random numbers
        num1 = getRandomNumber();
        num2 = getRandomNumber();
        
        // For subtraction, ensure num1 >= num2 for positive results
        if (operation === 'subtraction' && num2 > num1) {
            [num1, num2] = [num2, num1];
        }
    }
    
    num1Element.textContent = num1;
    num2Element.textContent = num2;
    operatorElement.textContent = getOperatorSymbol(operation);
    
    currentAnswer = calculateAnswer(num1, num2, operation);
    
    // Clear input and feedback
    answerInput.value = '';
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback';
    answerInput.focus();
}

// Check answer
function checkAnswer() {
    // Use parseInt since all problems produce integer results
    const userAnswer = parseInt(answerInput.value, 10);
    
    if (answerInput.value === '' || isNaN(userAnswer)) {
        feedbackElement.textContent = '⚠️ Please enter a number!';
        feedbackElement.className = 'feedback incorrect';
        return;
    }
    
    if (userAnswer === currentAnswer) {
        correctAnswers++;
        feedbackElement.textContent = '✓ Correct! Great job! 🎉';
        feedbackElement.className = 'feedback correct bounce';
        correctElement.textContent = correctAnswers;
        
        // Automatically generate new problem after correct answer
        setTimeout(() => {
            generateNewProblem();
        }, 1500);
    } else {
        incorrectAnswers++;
        feedbackElement.textContent = `✗ Not quite. The answer is ${currentAnswer}. Try again!`;
        feedbackElement.className = 'feedback incorrect';
        incorrectElement.textContent = incorrectAnswers;
    }
    
    updateTotal();
}

// Update total score
function updateTotal() {
    const total = correctAnswers + incorrectAnswers;
    totalElement.textContent = total;
}

// Reset score
function resetScore() {
    if (confirm('Are you sure you want to reset your score?')) {
        correctAnswers = 0;
        incorrectAnswers = 0;
        correctElement.textContent = 0;
        incorrectElement.textContent = 0;
        totalElement.textContent = 0;
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
        generateNewProblem();
    }
}

// Start the game when page loads
window.addEventListener('DOMContentLoaded', init);
