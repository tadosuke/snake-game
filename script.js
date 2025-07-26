/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("gameCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
/** @type {HTMLElement} */
const scoreElement = document.getElementById("score");
/** @type {HTMLElement} */
const gameOverElement = document.getElementById("gameOver");

/** @type {number} 各グリッドセルのピクセルサイズ */
const gridSize = 20;
/** @type {number} 行/列あたりのタイル数 */
const tileCount = canvas.width / gridSize;

/** @type {Array<{x: number, y: number}>} スネークのセグメント配列 */
let snake = [{ x: 10, y: 10 }];
/** @type {{x: number, y: number}} 食べ物の位置 */
let food = {};
/** @type {number} スネークの水平移動方向 */
let dx = 0;
/** @type {number} スネークの垂直移動方向 */
let dy = 0;
/** @type {number} 現在のゲームスコア */
let score = 0;
/** @type {boolean} ゲームが現在実行中かどうか */
let gameRunning = true;
/** @type {Array<{x: number, y: number}>} 影の軌跡位置の配列 */
let shadowTrail = [];

/**
 * ゲームグリッド上にランダムな位置で新しい食べ物を生成する
 */
function generateFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
}

/**
 * 背景、影の軌跡、スネーク、食べ物を含むゲーム全体をレンダリングする
 */
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

/**
 * スネークを一歩前進させ、衝突、食べ物の摂取、スコア更新を処理する
 */
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

/**
 * ゲームを終了し、ゲームオーバー画面を表示する
 */
function gameOver() {
  gameRunning = false;
  gameOverElement.style.display = "block";
}

/**
 * ゲームを初期状態にリセットし、新しいゲームを開始する
 */
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

/**
 * スネークの位置を更新し、ゲームを再描画するメインゲームループ
 */
function gameLoop() {
  moveSnake();
  drawGame();
}

/**
 * スネークの操作とゲームリスタートのためのキーボード入力を処理する
 * @param {KeyboardEvent} e - キーボードイベント
 */
document.addEventListener("keydown", (e) => {
  if (!gameRunning && e.code === "Space") {
    e.preventDefault();
    resetGame();
    return;
  }

  if (!gameRunning) return;

  switch (e.code) {
    case "ArrowUp":
      e.preventDefault();
      if (dy !== 1) {
        dx = 0;
        dy = -1;
      }
      break;
    case "ArrowDown":
      e.preventDefault();
      if (dy !== -1) {
        dx = 0;
        dy = 1;
      }
      break;
    case "ArrowLeft":
      e.preventDefault();
      if (dx !== 1) {
        dx = -1;
        dy = 0;
      }
      break;
    case "ArrowRight":
      e.preventDefault();
      if (dx !== -1) {
        dx = 1;
        dy = 0;
      }
      break;
  }
});

// ゲームを初期化
generateFood();
setInterval(gameLoop, 100);
