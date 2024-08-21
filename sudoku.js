const congratsMessages = {
    easy: [
        "Awesome job! You're a Sudoku master!",
        "Congratulations! You've cracked the easy puzzle!",
        "Way to go! You solved it easily!",
        "Fantastic! Easy puzzle complete!",
        "Brilliant! You nailed the easy one!",
    ],
    medium: [
        "Great work! You conquered the medium level!",
        "Well done! You solved the medium puzzle!",
        "Superb! Medium puzzle complete!",
        "Excellent! You beat the medium level!",
        "Impressive! You did it!",
    ],
    hard: [
        "Incredible! You solved the hard puzzle!",
        "Outstanding! You beat the hard level!",
        "Amazing! Hard puzzle complete!",
        "Terrific! You conquered the hard one!",
        "Marvelous! You did it!",
    ],
    nightmare: [
        "Unbelievable! You solved the nightmare puzzle!",
        "Phenomenal! You beat the nightmare level!",
        "Extraordinary! Nightmare puzzle complete!",
        "Astounding! You conquered the nightmare!",
        "Mind-blowing! You did it!",
    ],
    superhard: [
        "Unreal! You solved the superhard puzzle!",
        "Legendary! You beat the superhard level!",
        "Incredible! Superhard puzzle complete!",
        "Epic! You conquered the superhard!",
        "Historic! You did it!",
    ]
};

function getRandomCongratsMessage(level) {
    const messages = congratsMessages[level];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

let solutionBoard; // Global variable to store the solution board
let incorrectCount = 0; // Global variable to count incorrect entries

function generateSudoku(size = 9) {
    const board = createEmptyBoard(size);
    solveSudoku(board, size);  // Pass size to solveSudoku
    solutionBoard = board;    // Save the solution board
    return board;
}

// Create an empty Sudoku board
function createEmptyBoard(size = 9) {
    return Array.from({ length: size }, () => Array(size).fill(0));
}

// Check if the number can be placed in the current cell
function isValid(board, row, col, num, size = 9) {
    const sqrtSize = Math.sqrt(size);

    for (let i = 0; i < size; i++) {
        if (board[row][i] === num || board[i][col] === num ||
            board[Math.floor(row / sqrtSize) * sqrtSize + Math.floor(i / sqrtSize)]
                [Math.floor(col / sqrtSize) * sqrtSize + i % sqrtSize] === num) {
            return false;
        }
    }
    return true;
}

// Solve the Sudoku puzzle using backtracking
function solveSudoku(board, size = 9) {
    const findEmpty = (board) => {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (board[row][col] === 0) return { row, col };
            }
        }
        return null;
    };

    const backtrack = (board) => {
        const empty = findEmpty(board);
        if (!empty) return true;

        const { row, col } = empty;

        for (let num = 1; num <= size; num++) {
            if (isValid(board, row, col, num, size)) {
                board[row][col] = num;
                if (backtrack(board)) return true;
                board[row][col] = 0;
            }
        }

        return false;
    };

    backtrack(board);
    return board;
}

// Create a puzzle by removing cells from the solved Sudoku board
function generatePuzzle(board, emptyCells, size = 9) {
    const puzzle = board.map(row => row.slice()); // Copy the solved board
    let cellsToRemove = emptyCells;

    while (cellsToRemove > 0) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);

        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            cellsToRemove--;
        }
    }

    return puzzle;
}

function setGridClass(size) {
    const table = document.getElementById('sudoku-grid');
    table.className = size === 9 ? 'nine-by-nine' : 'six-by-six';
}

// Generate the Sudoku puzzle based on the difficulty level
function getSudokuPuzzle(level) {
    let boardSize = 9; // Default size for 9x9
    switch (level) {
        case 'easy':
        case 'medium':
        case 'hard':
        case 'nightmare':
        case 'superhard':
            break;
        default:
            throw new Error('Invalid level');
    }
    const board = generateSudoku(boardSize);  // Pass size to generateSudoku
    let emptyCells;

    switch (level) {
        case 'easy':
            emptyCells = 15;
            break;
        case 'medium':
            emptyCells = 25;
            break;
        case 'hard':
            emptyCells = 30;
            break;
        case 'nightmare':
            emptyCells = 35;
            break;
        case 'superhard':
            emptyCells = 45;
            break;
        
        default:
            throw new Error('Invalid level');
    }
    const puzzle = generatePuzzle(board, emptyCells, boardSize);  // Pass size to generatePuzzle
    setGridClass(boardSize); // Set the correct grid class based on size
    displayPuzzle(puzzle);

    return puzzle  // Pass size to generatePuzzle
}

// Function to check if the puzzle has a unique solution
function hasUniqueSolution(puzzle) {
    let solutionCount = 0;
    const size = puzzle.length;

    const solve = (board) => {
        const findEmpty = (board) => {
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    if (board[row][col] === 0) return { row, col };
                }
            }
            return null;
        };

        const isValid = (board, row, col, num, size) => {
            for (let i = 0; i < size; i++) {
                if (board[row][i] === num || board[i][col] === num ||
                    board[Math.floor(row / Math.sqrt(size)) * Math.sqrt(size) + Math.floor(i / Math.sqrt(size))]
                        [Math.floor(col / Math.sqrt(size)) * Math.sqrt(size) + i % Math.sqrt(size)] === num) {
                    return false;
                }
            }
            return true;
        };

        const backtrack = (board) => {
            const empty = findEmpty(board);
            if (!empty) {
                solutionCount++;
                return solutionCount === 2; // Stop early if more than one solution is found
            }

            const { row, col } = empty;

            for (let num = 1; num <= size; num++) {
                if (isValid(board, row, col, num, size)) {
                    board[row][col] = num;
                    if (backtrack(board)) return true;
                    board[row][col] = 0;
                }
            }

            return false;
        };

        return backtrack(board);
    };

    solve(puzzle);

    return solutionCount === 1;
}

// Generate a valid Sudoku puzzle
function generateValidPuzzle(level) {
    let puzzle;
    do {
        puzzle = getSudokuPuzzle(level);
    } while (!hasUniqueSolution(puzzle));

    return puzzle;
}

function clearEventListeners(table) {
    const cells = table.querySelectorAll('td');
    cells.forEach(cell => {
        cell.replaceWith(cell.cloneNode(true)); // Remove all event listeners
    });
}

// Function to display the puzzle
function displayPuzzle(puzzle) {
    const table = document.getElementById('sudoku-grid');
    table.innerHTML = ''; // Clear previous grid

    const size = puzzle.length;
    // Set the class based on the size
    setGridClass(size);

    const fragment = document.createDocumentFragment();

    for (let row = 0; row < size; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < size; col++) {
            const td = document.createElement('td');
            const value = puzzle[row][col];
            td.textContent = value === 0 ? '' : value;
            td.contentEditable = value === 0; // Only editable if empty
            if (value === 0) {
                td.addEventListener('input', debounce((event) => validateInput(event, row, col), 300));
            }
            tr.appendChild(td);
        }
        fragment.appendChild(tr);
    }
    table.appendChild(fragment);
}

// Update isPuzzleSolved to handle different sizes
function isPuzzleSolved(size = 9) {
    const puzzle = getCurrentPuzzle();
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (puzzle[row][col] !== solutionBoard[row][col]) {
                return false;
            }
        }
    }
    return true;
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function validateInput(event, row, col) {
    const value = event.target.textContent;
    const correctValue = solutionBoard[row][col]; // Get the correct value from the solved board
    const allowedIncorrect = parseInt(document.getElementById('allowed-incorrect-input').value) || getDefaultAllowedIncorrectEntries(); // Get allowed incorrect entries

    if (/^[1-9]$/.test(value)) {
        if (Number(value) === correctValue) {
            event.target.classList.remove('invalid');
            event.target.classList.add('highlighted');
            event.target.contentEditable = false;
            if (isPuzzleSolved(solutionBoard.length)) {
                const level = document.getElementById('difficulty-select').value; // Get the selected difficulty level
                const congratsMessage = getRandomCongratsMessage(level);
                updateMessage(congratsMessage, 'success');
                disableEditing(); // Disable editing once the puzzle is solved
            }
        } else {
            event.target.classList.add('invalid');
            event.target.classList.remove('highlighted');
            incorrectCount++; // Increment the incorrect count for wrong entries
            updateMessage(`Incorrect entries: ${incorrectCount}/${allowedIncorrect}`, 'error');
            if (incorrectCount >= allowedIncorrect) {
                updateMessage(`Exceeded allowed incorrect entries. The game is over.`, 'error');
                disableEditing(); // Disable editing if incorrect count exceeds allowed limit
            }
        }
    } else {
        event.target.classList.add('invalid');
        updateMessage(`Invalid input. Please enter a number between 1 and ${solutionBoard.length}.`, 'error');
    }
}

// Get the allowed incorrect entries based on the level
function getAllowedIncorrectEntries() {
    const level = document.getElementById('difficulty-select').value;
    switch (level) {
        case 'easy':
            return 3;
        case 'medium':
            return 5;
        case 'hard':
            return 7;
        case 'nightmare':
            return 10;
        case 'superhard':
            return 15;
        
        default:
            throw new Error('Invalid level');
    }
}

// Get the current puzzle state from the grid
function getCurrentPuzzle() {
    const puzzle = [];
    const rows = document.querySelectorAll('#sudoku-grid tr');
    rows.forEach((row, rowIndex) => {
        const cols = row.querySelectorAll('td');
        puzzle[rowIndex] = [];
        cols.forEach((cell, colIndex) => {
            const value = cell.textContent;
            puzzle[rowIndex][colIndex] = value === '' ? 0 : Number(value);
        });
    });
    return puzzle;
}

// Load the puzzle based on the selected difficulty
function loadPuzzle() {
    const level = document.getElementById('difficulty-select').value;
    const puzzle = generateValidPuzzle(level);
    displayPuzzle(puzzle);
    incorrectCount = 0; // Reset incorrect entries count
    hideMessage(); // Hide message when loading a new puzzle
}

// Solve the Sudoku puzzle for the user
function autoSolve() {
    if (solutionBoard) {
        for (let row = 0; row < solutionBoard.length; row++) {
            for (let col = 0; col < solutionBoard[row].length; col++) {
                const cell = document.querySelector(`#sudoku-grid tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
                if (solutionBoard[row][col] !== 0) {
                    cell.textContent = solutionBoard[row][col];
                    cell.classList.remove('invalid');
                    cell.classList.add('highlighted');
                }
            }
        }
        disableEditing(); // Disable editing after auto-solving
    }
}

// Disable editing for all cells
function disableEditing() {
    const cells = document.querySelectorAll('#sudoku-grid td');
    cells.forEach(cell => {
        cell.contentEditable = false;
    });
}

// Clear the grid
function clearGrid() {
    const cells = document.querySelectorAll('#sudoku-grid td');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('invalid', 'highlighted');
        cell.contentEditable = true; // Allow editing after clearing
    });
    incorrectCount = 0; // Reset incorrect entries count
    hideMessage(); // Hide message when clearing the grid
}

// Hide the message div
function hideMessage() {
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'none';
    messageDiv.classList.remove('success', 'error');
}

// Update the message below the buttons
function updateMessage(message, type = '') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;

    // Remove any existing classes
    messageDiv.classList.remove('success', 'error');

    // Add class based on message type
    if (type === 'success') {
        messageDiv.classList.add('success');
    } else if (type === 'error') {
        messageDiv.classList.add('error');
    }

    // Show the message div
    messageDiv.style.display = 'block';
}

// Event listeners for the buttons
document.addEventListener('DOMContentLoaded', () => {
    loadPuzzle();

    // Add event listener for the New Puzzle button
    document.querySelector('button[onclick="loadPuzzle()"]').addEventListener('click', loadPuzzle);

    document.querySelector('button[onclick="autoSolve()"]').addEventListener('click', autoSolve);

    // Add event listener for the Clear button
    document.querySelector('button[onclick="clearGrid()"]').addEventListener('click', clearGrid);
});
