const grid = document.querySelector('.grid');
let width = 10;
let squares = [];
let bombAmount = 20;
let validAmount = width * width - bombAmount;
let isGameOver = false;
let flags = 0;

// Ora creo la board.
function createBoard(){
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width*width-bombAmount).fill("valid");
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() -0.5)
    // Creo le bombe da distribuire in modo random.
    for (let i = 0; i < width*width; i++) {
        const square = document.createElement("div");
        const innerDiv = document.createElement("div");
        square.setAttribute("id", i);
        square.classList.add(shuffledArray[i]);
        square.classList.add("notChecked");
        innerDiv.classList.add("innerDiv");
        innerDiv.setAttribute("id", "innerdDiv"+i);
        grid.appendChild(square);
        square.appendChild(innerDiv);
        squares.push(square);

        // Gestione click
        square.addEventListener('click', function(e) {
            click(square);
        })
        square.oncontextmenu = function(e) {
            e.preventDefault();
            addFlag(square);
        };
    }

    // Aggiungo i numeri che diano indizi sulle bombe presenti.
    for (let i = 0; i < squares.length; i++) {
        let total = 0;
        // Non guardo a destra dei quadratini a destra in fondo, idem per la sinistra.
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);

        if(squares[i].classList.contains("valid")) {
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

createBoard();

// Click per flaggare una casella
function addFlag(square) {
    if(isGameOver) return;
    if(!square.classList.contains("checked") && (flags < bombAmount)){
        if(!square.classList.contains("flag")) {
            square.classList.add("flag");
            document.getElementById("innerdDiv"+square.id).innerHTML = "🚩";
            flags ++;
        } else {
            square.classList.remove("flag");
            square.innerHTML = "";
            flags --;
        }
    } else if (!square.classList.contains("checked") && (flags === bombAmount) && square.classList.contains("flag")){
        square.classList.remove("flag");
        square.innerHTML = "";
        flags --;
    } 
}

// Click normale
function click(square){
    checkForWin();
    let currentId = square.id;
    if (isGameOver) return;
    if (square.classList.contains("checked") || square.classList.contains("flag")) return;
    square.classList.remove("notChecked");
    if(square.classList.contains("bomb")){
        gameOver(square);
    } else {
        let total = square.getAttribute("data");
        if(total != 0){
            square.classList.add("checked");
            document.getElementById("innerdDiv"+square.id).innerHTML = total;
            return;
        }
        checkSquare(square, currentId);
    }
    square.classList.add("checked");
}

// Se la casella è vuota (non ha una bomba né un valore numerico), controllo le caselle vicine.
function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width - 1);
    setTimeout(() => {
        if(currentId > 0 && !isLeftEdge){
            const newId = squares[parseInt(currentId) - 1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if(currentId > 9 && !isRightEdge){
            const newId = squares[parseInt(currentId) + 1 - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if(currentId > 10){
            const newId = squares[parseInt(currentId) - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if(currentId > 11 && !isLeftEdge){
            const newId = squares[parseInt(currentId) - 1 - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if(currentId < 98 && !isRightEdge){
            const newId = squares[parseInt(currentId) + 1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if(currentId < 90 && !isRightEdge){
            const newId = squares[parseInt(currentId) - 1 + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);}
        if(currentId < 88 && !isRightEdge){
            const newId = squares[parseInt(currentId) + 1 + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if(currentId < 89){
            const newId = squares[parseInt(currentId - 1) + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
    }, 10);
}

// Gestione del game over.
function gameOver(square) {
    isGameOver = true;

    // Mostro tutte le bombe
    squares.forEach(square => {
        if(square.classList.contains("bomb")) {
            document.getElementById("innerdDiv"+square.id).innerHTML = "💣";
        }

    })
}

// Gestione della vittoria
function checkForWin() {
    let matches = 0;
    for(let i = 0; i < squares.length; i++) {
        if(squares[i].classList.contains("checked") && squares[i].classList.contains("valid")) {
            matches ++;
            console.log(matches);
            if(matches === validAmount - 1) {
                alert("you win!")
                isGameOver = true;
            }
        };
    }
}