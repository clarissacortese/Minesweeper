const grid = document.querySelector('.grid');
let width = 10;
let squares = [];
let bombAmount = 20;

// Ora creo la board.
function createBoard(){
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width*width-bombAmount).fill("valid");
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() -0.5)
    // Creo le bombe da distribuire in modo random.
    for (let i = 0; i < width*width; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add(shuffledArray[i]);
        grid.appendChild(square);
        squares.push(square);

        // Gestione click
        square.addEventListener('click', function(e) {
            click(square);
        })
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

function click(square){
    if(square.classList.contains("bomb")){
        alert("game over!");
    } else {
        let total = square.getAttribute("data");
        if(total != 0){
            square.classList.add("checked");
            square.innerHTML = total;
            return;
        }
        square.classList.add("checked");
    }
}