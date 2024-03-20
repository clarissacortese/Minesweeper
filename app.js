// Select the grid from the DOM
const grid = document.querySelector('.grid');
// Set the width of the grid
let width = 10;
// Initialize an array to hold the squares
let squares = [];
// Set the number of bombs
let bombAmount = 20;
// Calculate the number of valid squares (not containing a bomb)
let validAmount = width * width - bombAmount;
// Initialize a variable to track if the game is over
let isGameOver = false;
// Initialize a variable to track the number of flags
let flags = 0;

// Function to create the game board
function createBoard(){
    // Create an array with the bombs
    const bombsArray = Array(bombAmount).fill("bomb");
    // Create an array with the valid squares
    const emptyArray = Array(width*width-bombAmount).fill("valid");
    // Combine the two arrays
    const gameArray = emptyArray.concat(bombsArray);
    // Shuffle the array to randomize the positions of the bombs
    const shuffledArray = gameArray.sort(() => Math.random() -0.5)

    // Create the squares
    for (let i = 0; i < width*width; i++) {
        // Create a div for each square
        const square = document.createElement("div");
        const innerDiv = document.createElement("div");
        // Set the id of the square
        square.setAttribute("id", i);
        // Add the class (bomb or valid) to the square
        square.classList.add(shuffledArray[i]);
        square.classList.add("notChecked");
        innerDiv.classList.add("innerDiv");
        innerDiv.setAttribute("id", "innerdDiv"+i);
        // Add the square to the grid
        grid.appendChild(square);
        square.appendChild(innerDiv);
        // Add the square to the squares array
        squares.push(square);

        // Add event listeners for click and right-click
        square.addEventListener('click', function(e) {
            click(square);
        })
        square.oncontextmenu = function(e) {
            e.preventDefault();
            addFlag(square);
        };
        document.getElementById("reload").addEventListener('click', function(e) {
            reloadGame();
        });
    }

    // Add numbers to the squares to indicate the number of adjacent bombs
    for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);

        if(squares[i].classList.contains("valid")) {
            // Check the adjacent squares for bombs and increment the total for each bomb found
            // The checks are done in a clockwise direction starting from the top left
            // The checks are skipped for the squares on the edges to avoid checking outside the grid
            // The total is then set as a data attribute on the square
            // The rest of the code follows the same pattern
            if(i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")){
                total ++;
            }
            if(i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")){
                total ++;
            }
            if(i > 10 && squares[i - width].classList.contains("bomb")){
                total ++;
            }
            if(i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains("bomb")){
                total ++;
            }
            if(i < 98 && !isRightEdge && squares[i + 1].classList.contains("bomb")){
                total ++;
            }
            if(i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb")){
                total ++;
            }
            if(i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains("bomb")){
                total ++;
            }
            if(i < 89 && squares[i + width].classList.contains("bomb")){
                total ++;
            }
            squares[i].setAttribute("data", total);
        }
    }
}

// Call the function to create the board
createBoard();

// Function to handle right-clicks (flags)
function addFlag(square) {
    // If the game is over, do nothing
    if(isGameOver) return;
    // If the square is not checked and the number of flags is less than the number of bombs, add a flag
    if(!square.classList.contains("checked") && (flags < bombAmount)){
        if(!square.classList.contains("flag")) {
            square.classList.add("flag");
            document.getElementById("innerdDiv"+square.id).innerHTML = "🚩";
            flags ++;
            document.getElementById("flagCounter").innerHTML = bombAmount - flags;
        // If the square is already flagged, remove the flag
        } else {
            square.classList.remove("flag");
            document.getElementById("innerdDiv"+square.id).innerHTML = "";
            flags --;
            document.getElementById("flagCounter").innerHTML = bombAmount - flags;
        }
    // If the square is not checked and the number of flags is equal to the number of bombs, and the square is flagged, remove the flag
    } else if (!square.classList.contains("checked") && (flags === bombAmount) && square.classList.contains("flag")){
        square.classList.remove("flag");
        square.innerHTML = "";
        flags --;
        document.getElementById("flagCounter").innerHTML = bombAmount - flags;
    } 
}

// Function to handle left-clicks
function click(square){
    // Check for win
    checkForWin();
    let currentId = square.id;
    // If the game is over or the square is checked or flagged, do nothing
    if (isGameOver) return;
    if (square.classList.contains("checked") || square.classList.contains("flag")) return;
    // If the square is a bomb, end the game
    if(square.classList.contains("bomb")){
        square.classList.remove("notChecked");
        gameOver(square);
    // If the square is valid, check the number of adjacent bombs
    } else {
        square.classList.remove("notChecked");
        let total = square.getAttribute("data");
        // If the square is adjacent to one or more bombs, display the number of bombs
        if(total != 0){
            square.classList.add("checked");
            document.getElementById("innerdDiv"+square.id).innerHTML = total;
            return;
        }
        // If the square is not adjacent to any bombs, check the adjacent squares
        checkSquare(square, currentId);
    }
    square.classList.add("checked");
}

// This function checks the neighboring squares of the clicked square
function checkSquare(square, currentId) {
    // Check if the square is on the left edge of the grid
    const isLeftEdge = (parseInt(currentId) % width === 0);
    // Check if the square is on the right edge of the grid
    const isRightEdge = (parseInt(currentId) % width === width - 1);

    // Delay the execution of the following code by 10 milliseconds
    setTimeout(() => {
        // Check the square to the left if it's not on the left edge
        if(currentId > 0 && !isLeftEdge){
            const newId = squares[parseInt(currentId) - 1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // Check the square to the top-right if it's not on the right edge
        if(currentId > 9 && !isRightEdge){
            const newId = squares[parseInt(currentId) + 1 - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // Check the square above
        if(currentId > 10){
            const newId = squares[parseInt(currentId) - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // Check the square to the top-left if it's not on the left edge
        if(currentId > 11 && !isLeftEdge){
            const newId = squares[parseInt(currentId) - 1 - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // Check the square to the right if it's not on the right edge
        if(currentId < 99 && !isRightEdge){
            const newId = squares[parseInt(currentId) + 1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // Check the square to the bottom-left if it's not on the left edge
        if(currentId < 90 && !isLeftEdge){
            const newId = squares[parseInt(currentId) - 1 + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // Check the square to the bottom-right if it's not on the right edge
        if(currentId < 88 && !isRightEdge){
            const newId = squares[parseInt(currentId) + 1 + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // Check the square below
        if(currentId < 89) {
            const newId = squares[parseInt(currentId) + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
    }, 10);
}

// This function handles the game over scenario
function gameOver(square) {
    // Set the game over flag to true
    isGameOver = true;

    // Show all the bombs on the grid
    squares.forEach(square => {
        if(square.classList.contains("bomb")) {
            document.getElementById("innerdDiv"+square.id).innerHTML = "💣";
        }
    })

    // Alert the user that they lost and need to reload the page to play again
    alert("You lost! Reload the page to play again.")
}

// This function checks if the user has won the game
function checkForWin() {
    let matches = 0;
    // Iterate over all squares
    for(let i = 0; i < squares.length; i++) {
        // If a square is checked and valid, increment the matches counter
        if(squares[i].classList.contains("checked") && squares[i].classList.contains("valid")) {
            matches ++;
            // If the number of matches equals the number of valid squares minus one, the user wins
            if(matches === validAmount - 1) {
                isGameOver = true;
                alert("You win! Reload the page to play again.")
            }
        };
    }
}

// This function reloads the page, effectively starting a new game
function reloadGame() {
    location.reload();
}
