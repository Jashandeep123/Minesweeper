document.addEventListener("DOMContentLoaded", ()=>{

    const container = document.body;  // You can replace this with a specific container

    for (let i = 0; i < 12; i++) { // Change '5' to however many images you want
        const img = document.createElement("img");
        img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlEIGJWu7dplRlH79rBUodFjEG2WnMEqV3xAc_-8qgLpdyTDvxjoIO1snBZFVn2zUidFk&usqp=CAU"; // Set the path to your image
        img.classList.add("random-image");
        
        // Generate random positions within the viewport
        const randomX = Math.floor(Math.random() * (window.innerWidth - 50)); // 50px is the width of the image
        const randomY = Math.floor(Math.random() * (window.innerHeight - 50)); // Adjust based on image height
        
        img.style.top = `${randomY}px`;
        img.style.left = `${randomX}px`;
        
        container.appendChild(img);
    }

    const startScreen=document.querySelector(".minesweeper-startscreen");
    const gameBoard=document.querySelector(".minesweeper");
    const startButton=document.querySelector(".startscreen-btn");
    const restartHeaderButton = document.querySelector(".minesweeper-restart");
    const board=document.querySelector(".minesweeper-board");
    document.body.classList.add("minesweeper-title");

    startScreen.style.visibility="visible";
    gameBoard.style.visibility="hidden";

    const levelSelect = document.querySelector(".minesweeper-level");
    levelSelect.addEventListener("change", () => {
        startGame();
    });

    restartHeaderButton.addEventListener("click", ()=>{
        board.innerHTML="";
        // endScreen.style.display="none";
        board.style.display="flex";
        startGame();
    })

    startButton.addEventListener("click", ()=>{
        // document.body.style.backgroundColor="white";
        startScreen.style.display="none";
        gameBoard.style.visibility="visible";
        startGame();
    })
})

function endGame(message){
    const board=document.querySelector(".minesweeper-board");
    const endScreen=document.querySelector(".minesweeper-endscreen");
    const restart=document.querySelector(".minesweeper-endscreen-restart");
    const result=document.querySelector(".minesweeper-endscreen-text");
    endScreen.style.display="flex";
    endScreen.classList.add("minesweeper-endGame");
    // board.style.visibility="hidden";
    // board.style.display="none";
    result.innerText=message;
    result.classList.add("minesweeper-endGame-msg");
    restart.addEventListener("click", ()=>{
        board.innerHTML="";
        endScreen.style.display="none";
        // board.style.display="block";
        startGame();
    })
}

function startGame(){
    const levelSelect=document.querySelector(".minesweeper-level");
    const flag=document.querySelector(".minesweeper-flag-count");
    const restart=document.querySelector(".minesweeper-element");
    const gameBoard=document.querySelector(".minesweeper-board");


    // restart.addEventListener("click", ()=>{
    //     board.innerHTML="";
    //     startGame();
    // })

    gameBoard.innerHTML="";

    let level=levelSelect.value;
    let board=[];
    let boardSize=levelMapper[level].boardSize;
    let mineCount=levelMapper[level].mineCount;
    let mines=[];
    let flagCount=mineCount;
    let gameOver=false;
    let revealBoxCount=0;

    while(mines.length<mineCount){
        let randomr=Math.floor(Math.random()*boardSize);
        let randomc=Math.floor(Math.random()*boardSize);
        let id=randomr+"-"+randomc;
        if(!mines.includes(id)){
            mines.push(id);
        }
    }

    console.log(mines);
    createBoard();

    // if(level === "easy"){

    // }
    function createBoard(){
        for(let i=0;i<boardSize;i++){
            let rowArray=[];
            const row=document.createElement("div");
            row.classList.add("minesweeper-row","row");
            for(let j=0;j<boardSize;j++){
                const box=document.createElement("div");
                let id=i+"-"+j;
                box.id=id;
                box.classList.add("box", "unrevealed");
                box.addEventListener("click", revealBox);
                box.addEventListener("contextmenu", flagBox);
                rowArray.push(box);
                row.append(box);
            }
            board.push(rowArray);
            gameBoard.append(row);
        }
    }

    function flagBox(event){
        event.preventDefault();
        const box=event.currentTarget;
        if(box.classList.contains("revealed")){
            box.removeEventListener("contextmenu","flagBox");
            return;
        }
        if(box.classList.contains("flag")){
            box.classList.remove("flag");
            flagCount++;
        }
        else{
            box.classList.add("flag");
            flagCount--;
        }
        flag.textContent=`🚩 ${flagCount}`;
    }
    
    function revealBox(event){
        const box=event.currentTarget;
        if(box.classList.contains("flag")) return;
        if(box.classList.contains("revealed")){
            box.removeEventListener("click", revealBox);
            return;
        }
        checkMine(box);

        const values=box.id.split("-");
        const r=parseInt(values[0]);
        const c=parseInt(values[1]);
        revealCount(r,c);

        // revealCount(box);

        box.classList.remove("unrevealed");
        box.classList.add("revealed");
       
        if(revealBoxCount===(boardSize*boardSize)-mineCount-document.querySelectorAll(".revealed.mine").length){
            gameOver=true;
            // alert("You Won");
            // revealAll();
            endGame("You Won!!!");
        } 
    }
    
    function checkMine(box){
    
        if(mines.includes(box.id)){
            box.classList.add("revealed","mine");
            gameOver=true;
            revealAllMines();
            // alert("Game Over");
            // revealAll();
            endGame(`You Lost!!!\n Try Again.`);
    
        }
    }
    
    function revealAllMines(){
        mines.forEach(cor=>{
            const values=cor.split("-");
            const r=parseInt(values[0]);
            const c=parseInt(values[1]);
            board[r][c].classList.add("revealed", "mine");
        })
    }

    // function  revealAll(){
    //     board.forEach(row=>row.forEach(box=>box.classList.add("revealed")));
    // }
    
    function revealCount(r,c){
        if(r<0 || c<0 || r>=boardSize || c>=boardSize || gameOver) return;
        if(board[r][c].classList.contains("revealed")) return;
        board[r][c].classList.add("revealed");
        revealBoxCount++;
        let count=0;
        for(let i=r-1;i<=r+1;i++){
            for(let j=c-1;j<=c+1;j++){
                if(i<0 || j<0 || i>=boardSize || j>=boardSize) 
                    continue;
                if(mines.includes(i+"-"+j)) count++;
            }
        }
        if(count>0){
            board[r][c].innerText=count;
            // board[r][c].classList.add("revealed");
        }else{
            for(let i=r-1;i<=r+1;i++){
                for(let j=c-1;j<=c+1;j++){
                    if(i<0 || j<0 || i>=boardSize || j>=boardSize) 
                        continue;
                    // if(mines.includes(i+"-"+j)) count++;
                    revealCount(i,j);
                }
            }   
        }
    }
    
    // document.addEventListener('DOMContentLoaded', startGame);
}

const levelMapper={
    easy:{
        boardSize:10,
        mineCount:5
    },
    medium:{
        boardSize:15,
        mineCount:10
    },
    hard:{
        boardSize:20,
        mineCount:15
    }
}

document.addEventListener('DOMContentLoaded', startGame);



// startGame();