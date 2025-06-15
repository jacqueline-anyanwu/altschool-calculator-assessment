 // Calculator state variables
      let currentInput = '0';
      let previousInput = null;
      let operator = null;
      let waitingForOperand = false;
      let lastCalculation = null;

      const display = document.getElementById('screen');
      const expressionDisplay = document.getElementById('expression');
      const historyText = document.getElementById('history-text');

      // Update display
      function updateDisplay() {
        display.textContent = currentInput;
        updateExpression();
      }

      // Update expression display
      function updateExpression() {
        if (previousInput !== null && operator && !waitingForOperand) {
          expressionDisplay.textContent = `${previousInput} ${getOperatorSymbol(operator)} ${currentInput}`;
        } else if (previousInput !== null && operator) {
          expressionDisplay.textContent = `${previousInput} ${getOperatorSymbol(operator)}`;
        } else {
          expressionDisplay.textContent = '';
        }
      }

      // Get operator symbol for display
      function getOperatorSymbol(op) {
        const symbols = {
          '+': '+',
          '-': '-',
          '*': '×',
          '/': '÷',
          '^': '^'
        };
        return symbols[op] || op;
      }

      // Input numbers
      function inputNumber(num) {
        if (waitingForOperand) {
          currentInput = num;
          waitingForOperand = false;
        } else {
          currentInput = currentInput === '0' ? num : currentInput + num;
        }
        updateDisplay();
      }

      // Set operator - FIXED to properly handle power operator
      function setOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        // Remove active class from all operator buttons
        document.querySelectorAll('.operator.orange').forEach(btn => {
          btn.classList.remove('active');
        });

        // Add active class to clicked operator button
        const operatorButtons = {
          '+': 'add',
          '-': 'subtract',
          '*': 'multiply',
          '/': 'divide',
          '^': 'power'
        };
        
        const buttonId = operatorButtons[nextOperator];
        if (buttonId) {
          const button = document.getElementById(buttonId);
          if (button) {
            button.classList.add('active');
          }
        }

        if (previousInput === null) {
          previousInput = inputValue;
        } else if (operator && !waitingForOperand) {
          const currentValue = previousInput || 0;
          const newValue = calculate(currentValue, inputValue, operator);

          currentInput = String(newValue);
          previousInput = newValue;
          updateDisplay();
        }

        waitingForOperand = true;
        operator = nextOperator;
        updateExpression();
      }

      // Calculate result
      function calculateResult() {
        const inputValue = parseFloat(currentInput);

        if (previousInput !== null && operator && !waitingForOperand) {
          const expressionText = `${previousInput} ${getOperatorSymbol(operator)} ${inputValue}`;
          const newValue = calculate(previousInput, inputValue, operator);
          
          // Update history
          lastCalculation = {
            expression: expressionText,
            result: newValue
          };
          updateHistoryDisplay();
          
          currentInput = String(newValue);
          previousInput = null;
          operator = null;
          waitingForOperand = true;

          // Remove active class from all operator buttons
          document.querySelectorAll('.operator.orange').forEach(btn => {
            btn.classList.remove('active');
          });

          updateDisplay();
        }
      }

      // Perform calculation - FIXED power calculation
      function calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
          case '+':
            return firstOperand + secondOperand;
          case '-':
            return firstOperand - secondOperand;
          case '*':
            return firstOperand * secondOperand;
          case '/':
            return secondOperand !== 0 ? firstOperand / secondOperand : 0;
          case '^':
            return Math.pow(firstOperand, secondOperand);
          default:
            return secondOperand;
        }
      }

      // Clear display (C button functionality)
      function clearDisplay() {
        currentInput = '0';
        previousInput = null;
        operator = null;
        waitingForOperand = false;

        // Remove active class from all operator buttons
        document.querySelectorAll('.operator.orange').forEach(btn => {
          btn.classList.remove('active');
        });

        updateDisplay();
      }

      // Delete last character (backspace)
      function deleteLast() {
        if (currentInput.length > 1) {
          currentInput = currentInput.slice(0, -1);
        } else {
          currentInput = '0';
        }
        updateDisplay();
      }

      // Percentage function
      function inputPercent() {
        currentInput = String(parseFloat(currentInput) / 100);
        updateDisplay();
      }

      // History functions
      function updateHistoryDisplay() {
        if (lastCalculation) {
          historyText.textContent = `${lastCalculation.expression} = ${lastCalculation.result}`;
          historyText.classList.add('clickable');
          historyText.onclick = () => useHistoryResult(lastCalculation.result);
        } else {
          historyText.textContent = 'No calculations yet';
          historyText.classList.remove('clickable');
          historyText.onclick = null;
        }
      }

      function useHistoryResult(result) {
        currentInput = String(result);
        previousInput = null;
        operator = null;
        waitingForOperand = false;
        
        // Remove active class from all operator buttons
        document.querySelectorAll('.operator.orange').forEach(btn => {
          btn.classList.remove('active');
        });
        
        updateDisplay();
      }

      // Keyboard support
      document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        // Prevent default behavior for calculator keys
        if (['+', '-', '*', '/', '=', 'Enter', 'Escape', 'Backspace', '%', '^'].includes(key) || 
            (key >= '0' && key <= '9') || key === '.') {
          event.preventDefault();
        }
        
        if (key >= '0' && key <= '9' || key === '.') {
          inputNumber(key);
        } else if (key === '+') {
          setOperator('+');
        } else if (key === '-') {
          setOperator('-');
        } else if (key === '*') {
          setOperator('*');
        } else if (key === '/') {
          setOperator('/');
        } else if (key === '^') {
          setOperator('^');
        } else if (key === 'Enter' || key === '=') {
          calculateResult();
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
          clearDisplay();
        } else if (key === 'Backspace') {
          deleteLast();
        } else if (key === '%') {
          inputPercent();
        }
      });

      // Mobile touch handling
      document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('touchstart', function(e) {
          e.preventDefault();
          this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function(e) {
          e.preventDefault();
          this.style.transform = '';
          setTimeout(() => {
            this.click();
          }, 100);
        });
      });

      // Initialize display and history
      updateDisplay();
      updateHistoryDisplay();