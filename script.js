const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("gameOver");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameRunning = true;
let shadowTrail = [];

function generateFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
}

function drawGame() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw shadow trail with fading effect
  for (let i = 0; i < shadowTrail.length; i++) {
    const shadow = shadowTrail[i];
    const age = i + 1;
    const opacity = Math.max(0, 1 - age * 0.2); // Each square 20% darker
    ctx.fillStyle = `rgba(0, 150, 0, ${opacity * 0.75})`; // Green shadow with fading effect
    ctx.fillRect(
      shadow.x * gridSize,
      shadow.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }

  ctx.fillStyle = "lime";
  for (let segment of snake) {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }

  ctx.fillStyle = "red";
  ctx.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize - 2,
    gridSize - 2
  );
}

function moveSnake() {
  if (!gameRunning || (dx === 0 && dy === 0)) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
    return;
  }

  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver();
      return;
    }
  }

  snake.unshift(head);

  let foodEaten = false;
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    generateFood();
    foodEaten = true;
  } else {
    const tail = snake.pop();
    // Add tail position to shadow trail when snake moves
    shadowTrail.unshift({ x: tail.x, y: tail.y });
    // Keep only 5 shadow squares
    if (shadowTrail.length > 5) {
      shadowTrail.pop();
    }
  }
}

function gameOver() {
  gameRunning = false;
  gameOverElement.style.display = "block";
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  scoreElement.textContent = score;
  gameRunning = true;
  gameOverElement.style.display = "none";
  shadowTrail = [];
  generateFood();
}

function gameLoop() {
  moveSnake();
  drawGame();
}

document.addEventListener("keydown", (e) => {
  if (!gameRunning && e.code === "Space") {
    resetGame();
    return;
  }

  if (!gameRunning) return;

  switch (e.code) {
    case "ArrowUp":
      if (dy !== 1) {
        dx = 0;
        dy = -1;
      }
      break;
    case "ArrowDown":
      if (dy !== -1) {
        dx = 0;
        dy = 1;
      }
      break;
    case "ArrowLeft":
      if (dx !== 1) {
        dx = -1;
        dy = 0;
      }
      break;
    case "ArrowRight":
      if (dx !== -1) {
        dx = 1;
        dy = 0;
      }
      break;
  }
});

generateFood();
setInterval(gameLoop, 100);
