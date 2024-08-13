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