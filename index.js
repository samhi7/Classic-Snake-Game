const canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");  
let backgroundImage=new Image();
backgroundImage.src="grass.jpg";
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
let tileSize =canvas.width /20;
let tileCount = 20;
let headX = 10;//head position
let headY = 10;
let snakeParts = [];
let tailLength = 1;//intial no of length of snake
let appleX =5;//apple positon
let appleY =5;
let inputsXVelocity = 0;//initial
let inputsYVelocity = 0;
let xVelocity = 0;
let yVelocity = 0;
let score = 0;
let hiscore=localStorage.getItem("hiscore") ? parseInt(localStorage.getItem("hiscore")) : 0;
//let gulpSound = new Audio("gulp.mp3");

//game loop
let gameRunning=true;
function drawGame() {
  if (!gameRunning) return;
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }

  clearScreen();
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  checkAppleCollision();
  drawApple();
  drawSnake();
  updateScore();
  let speed=3;
  if (score > 5 && score<10)speed = 5;
  else if (score >= 10 && score<=15)speed = 7;
  else if(score>15)speed = 9;
  
  setTimeout(drawGame, 1000 / speed);
}
function updateScore() {
  document.getElementById("score").innerText = score;
  document.getElementById("hiscore").innerText = hiscore;
}
//function drawScore() {
  //ctx.fillStyle = "white";
  //ctx.font = "30px Verdana";
  //ctx.fillText("Score " + score, 50 , 10);
  //ctx.fillText("HiScore " + hiscore, 50 , 40);
//}

function clearScreen() {
 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY)); //put an item at the end of the list next to the head
  while (snakeParts.length > tailLength) {
    snakeParts.shift(); // remove the furthet item from the snake parts if have more than our tail size.
  }

  ctx.fillStyle = "olive";
  ctx.fillRect(headX * tileSize, headY * tileSize, tileSize, tileSize);
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileSize, appleY * tileSize, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    if (score > hiscore) {
      hiscore = score;
      localStorage.setItem("hiscore", hiscore);
    }
    //gulpSound.play();
  }
}


document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  //up
  if (event.keyCode == 38 || event.keyCode == 87) {
    //87 is w
    if (inputsYVelocity == 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }

  //down
  if (event.keyCode == 40 || event.keyCode == 83) {
    // 83 is s
    if (inputsYVelocity == -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }

  //left
  if (event.keyCode == 37 || event.keyCode == 65) {
    // 65 is a
    if (inputsXVelocity == 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }

  //right
  if (event.keyCode == 39 || event.keyCode == 68) {
    //68 is d
    if (inputsXVelocity == -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}


function restartGame() {
    // Reset snake position and velocity
    headX = 10;
    headY = 10;
    inputsXVelocity = 0;
    inputsYVelocity = 0;
    xVelocity = 0;
    yVelocity = 0;
  
    // Reset the snake and score
    snakeParts = [];
    tailLength = 2;
    score = 0;
  
    // Reset apple position
    appleX = 5;
    appleY = 5;
  
    // Restart the game loop
    gameRunning=true;
    drawGame();
  }
  
  function isGameOver() {
    let gameOver = false;
  
    if (yVelocity === 0 && xVelocity === 0) {
      return false;
    }
  
    // Check for collisions with walls
    if (headX < 0 || headX === tileCount || headY < 0 || headY === tileCount) {
      gameOver = true;
    }
  
    // Check for collisions with the snake's body
    for (let i = 0; i < snakeParts.length; i++) {
      let part = snakeParts[i];
      if (part.x === headX && part.y === headY) {
        gameOver = true;
        break;
      }
    }
  
    if (gameOver) {
      gameRunning=false;
      ctx.fillStyle = "white";
      ctx.font = "50px Verdana";
      ctx.fillText("Game Over!", canvas.width / 5, canvas.height / 2);
      ctx.font = "20px Verdana";
      ctx.fillText("Press Any Key to Restart.", canvas.width / 4, canvas.height / 1.75);
  
      // Add event listener for restarting the game
      document.body.addEventListener("keydown", restartOnKeyPress);
    }
  
    return gameOver;
  }
  
  function restartOnKeyPress() {
    document.body.removeEventListener("keydown", restartOnKeyPress); // Prevent multiple triggers
    restartGame();
  }

backgroundImage.onload = function () {
  drawGame();
};