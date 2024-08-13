document.addEventListener("DOMContentLoaded", function() {
    const previousCalc = document.getElementById("previous-calc");
    const display = document.getElementById("current-display");
    const buttons = document.querySelectorAll(".btn");
    const historyList = document.getElementById("history-list");
    const clearHistoryBtn = document.getElementById("clear-history");
    let currentInput = "";
    let operator = "";
    let firstValue = "";
    let secondValue = "";
    let resetDisplay = false;
    let calculationHistory = [];

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            handleInput(button.getAttribute("data-value"));
        });
    });

    document.addEventListener("keydown", (event) => {
        const key = event.key;
        if ((key >= "0" && key <= "9") || key === ".") {
            handleInput(key);
        } else if (["/", "*", "-", "+"].includes(key)) {
            handleInput(key);
        } else if (key === "Enter" || key === "=") {
            handleInput("=");
        } else if (key === "Backspace" || key === "Delete") {
            handleInput("C");
        }
    });

    clearHistoryBtn.addEventListener("click", clearHistory);

    function handleInput(value) {
        if (value >= "0" && value <= "9" || value === ".") {
            if (resetDisplay) {
                currentInput = "";
                resetDisplay = false;
            }
            if (value === "." && currentInput.includes(".")) return;
            currentInput += value;
            updateDisplay();
        } else if (value === "C") {
            clearAll();
        } else if (value === "=") {
            if (currentInput && operator && firstValue !== "") {
                secondValue = currentInput;
                const result = calculate(parseFloat(firstValue), parseFloat(secondValue), operator);
                if (result !== "Error") {
                    const calculation = `${firstValue} ${operator} ${secondValue} = ${result}`;
                    previousCalc.textContent = calculation;
                    currentInput = result.toString();
                    updateDisplay();
                    addToHistory(calculation);
                    reset(result);
                } else {
                    displayError("Math Error");
                }
            }
        } else {
            if (currentInput) {
                if (firstValue && operator) {
                    secondValue = currentInput;
                    const result = calculate(parseFloat(firstValue), parseFloat(secondValue), operator);
                    if (result !== "Error") {
                        firstValue = result.toString();
                        currentInput = firstValue;
                    } else {
                        displayError("Math Error");
                        return;
                    }
                } else {
                    firstValue = currentInput;
                }
                operator = value;
                resetDisplay = true;
                previousCalc.textContent = `${firstValue} ${operator}`;
                updateDisplay();
            }
        }
    }

    function calculate(num1, num2, operator) {
        switch (operator) {
            case "+": return num1 + num2;
            case "-": return num1 - num2;
            case "*": return num1 * num2;
            case "/": return num2 === 0 ? "Error" : num1 / num2;
            default: return num2;
        }
    }

    function clearAll() {
        currentInput = "";
        firstValue = "";
        secondValue = "";
        operator = "";
        previousCalc.textContent = "";
        updateDisplay();
        resetDisplay = false;
    }

    function reset(result) {
        currentInput = result.toString();
        firstValue = result.toString();
        secondValue = "";
        operator = "";
        resetDisplay = true;
    }

    function displayError(message) {
        display.classList.add("error");
        display.textContent = message;
        setTimeout(() => {
            display.classList.remove("error");
            clearAll();
        }, 1500);
    }

    function updateDisplay() {
        display.textContent = currentInput || "0";
    }

    function addToHistory(calculation) {
        calculationHistory.unshift(calculation);
        if (calculationHistory.length > 5) {
            calculationHistory.pop();
        }
        updateHistoryDisplay();
    }

    function updateHistoryDisplay() {
        historyList.innerHTML = "";
        calculationHistory.forEach(calc => {
            const li = document.createElement("li");
            li.textContent = calc;
            historyList.appendChild(li);
        });
    }

    function clearHistory() {
        calculationHistory = [];
        updateHistoryDisplay();
    }
});

const scientificButtons = document.querySelectorAll('.sci-func');
const themeSelect = document.getElementById('theme-select');

scientificButtons.forEach(button => {
    button.addEventListener('click', () => {
        handleScientificFunction(button.getAttribute('data-value'));
    });
});

themeSelect.addEventListener('change', (e) => {
    setTheme(e.target.value);
});

function handleScientificFunction(func) {
    switch (func) {
        case 'sin':
        case 'cos':
        case 'tan':
        case 'log':
        case 'ln':
        case 'sqrt':
            if (currentInput) {
                const num = parseFloat(currentInput);
                const result = calculateScientific(num, func);
                displayResult(result);
            }
            break;
        case 'pow':
            if (currentInput) {
                firstValue = currentInput;
                operator = '^';
                resetDisplay = true;
                previousCalc.textContent = `${firstValue} ^`;
            }
            break;
        case 'pi':
            currentInput = Math.PI.toString();
            updateDisplay();
            break;
    }
}

function calculateScientific(num, func) {
    switch (func) {
        case 'sin': return Math.sin(num);
        case 'cos': return Math.cos(num);
        case 'tan': return Math.tan(num);
        case 'log': return Math.log10(num);
        case 'ln': return Math.log(num);
        case 'sqrt': return Math.sqrt(num);
        default: return num;
    }
}

function setTheme(theme) {
    document.body.className = `${theme}-theme`;
}

// Modify the existing calculate function to include power operation
function calculate(num1, num2, operator) {
    switch (operator) {
        case "+": return num1 + num2;
        case "-": return num1 - num2;
        case "*": return num1 * num2;
        case "/": return num2 === 0 ? "Error" : num1 / num2;
        case "^": return Math.pow(num1, num2);
        default: return num2;
    }
}

// Modify handleInput function to include error handling for invalid inputs
function handleInput(value) {
    if (value >= "0" && value <= "9" || value === ".") {
        if (resetDisplay) {
            currentInput = "";
            resetDisplay = false;
        }
        if (value === "." && currentInput.includes(".")) return;
        currentInput += value;
        updateDisplay();
    } else if (value === "C") {
        clearAll();
    } else if (value === "=") {
        if (currentInput && operator && firstValue !== "") {
            secondValue = currentInput;
            try {
                const result = calculate(parseFloat(firstValue), parseFloat(secondValue), operator);
                if (isNaN(result) || !isFinite(result)) {
                    throw new Error("Invalid calculation");
                }
                const calculation = `${firstValue} ${operator} ${secondValue} = ${result}`;
                previousCalc.textContent = calculation;
                currentInput = result.toString();
                updateDisplay();
                addToHistory(calculation);
                reset(result);
            } catch (error) {
                displayError("Math Error");
            }
        }
    } else {
        // ... (keep the rest of the function as is) ...
    }
}

// Add a new function to display results from scientific calculations
function displayResult(result) {
    if (isNaN(result) || !isFinite(result)) {
        displayError("Math Error");
    } else {
        currentInput = result.toString();
        updateDisplay();
        addToHistory(`${previousCalc.textContent} = ${result}`);
        reset(result);
    }
}

// Initialize with dark theme
setTheme('dark');
