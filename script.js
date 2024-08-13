document.addEventListener("DOMContentLoaded", function() {
    const previousCalc = document.getElementById("previous-calc");
    const display = document.getElementById("current-display");
    const buttons = document.querySelectorAll(".btn");
    let currentInput = "";
    let operator = "";
    let firstValue = "";
    let secondValue = "";
    let resetDisplay = false;

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
        } else if (key === "Backspace" || key === "Escape") {
            handleInput("C");
        }
    });

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
                    previousCalc.textContent = `${firstValue} ${operator} ${secondValue} =`;
                    currentInput = result.toString();
                    updateDisplay();
                    reset(result);
                } else {
                    displayError();
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
                        displayError();
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

    function displayError() {
        display.classList.add("error");
        display.textContent = "Error";
        setTimeout(() => {
            display.classList.remove("error");
            clearAll();
        }, 1500);
    }

    function updateDisplay() {
        display.textContent = currentInput || "0";
    }
});