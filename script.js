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

/** @type {Array<{x: number, y: number}>} プレイヤー1のスネークのセグメント配列 */
let snake1 = [{ x: 10, y: 10 }];
/** @type {Array<{x: number, y: number}>} プレイヤー2のスネークのセグメント配列 */
let snake2 = [{ x: 20, y: 20 }];
/** @type {{x: number, y: number}} 食べ物の位置 */
let food = {};
/** @type {number} プレイヤー1の水平移動方向 */
let dx1 = 0;
/** @type {number} プレイヤー1の垂直移動方向 */
let dy1 = 0;
/** @type {number} プレイヤー2の水平移動方向 */
let dx2 = 0;
/** @type {number} プレイヤー2の垂直移動方向 */
let dy2 = 0;
/** @type {number} 現在のゲームスコア */
let score = 0;
/** @type {boolean} ゲームが現在実行中かどうか */
let gameRunning = true;
/** @type {Array<{x: number, y: number}>} プレイヤー1の影の軌跡位置の配列 */
let shadowTrail1 = [];
/** @type {Array<{x: number, y: number}>} プレイヤー2の影の軌跡位置の配列 */
let shadowTrail2 = [];

/**
 * ゲームグリッド上にランダムな位置で新しい食べ物を生成する
 */
function generateFood() {
  let validPosition = false;
  while (!validPosition) {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
    
    validPosition = true;
    for (let segment of snake1) {
      if (food.x === segment.x && food.y === segment.y) {
        validPosition = false;
        break;
      }
    }
    if (validPosition) {
      for (let segment of snake2) {
        if (food.x === segment.x && food.y === segment.y) {
          validPosition = false;
          break;
        }
      }
    }
  }
}

/**
 * 背景、影の軌跡、スネーク、食べ物を含むゲーム全体をレンダリングする
 */
function drawGame() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw player 1 shadow trail with fading effect (green)
  for (let i = 0; i < shadowTrail1.length; i++) {
    const shadow = shadowTrail1[i];
    const age = i + 1;
    const opacity = Math.max(0, 1 - age * 0.2);
    ctx.fillStyle = `rgba(0, 150, 0, ${opacity * 0.75})`;
    ctx.fillRect(
      shadow.x * gridSize,
      shadow.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }

  // Draw player 2 shadow trail with fading effect (blue)
  for (let i = 0; i < shadowTrail2.length; i++) {
    const shadow = shadowTrail2[i];
    const age = i + 1;
    const opacity = Math.max(0, 1 - age * 0.2);
    ctx.fillStyle = `rgba(0, 100, 255, ${opacity * 0.75})`;
    ctx.fillRect(
      shadow.x * gridSize,
      shadow.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }

  // Draw player 1 snake (green)
  ctx.fillStyle = "lime";
  for (let segment of snake1) {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }

  // Draw player 2 snake (blue)
  ctx.fillStyle = "blue";
  for (let segment of snake2) {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize - 2,
    gridSize - 2
  );
}

/**
 * プレイヤー1のスネークを移動させる
 */
function moveSnake1() {
  if (!gameRunning || (dx1 === 0 && dy1 === 0)) return;

  const head = { x: snake1[0].x + dx1, y: snake1[0].y + dy1 };

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
    return;
  }

  for (let segment of snake1) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver();
      return;
    }
  }

  for (let segment of snake2) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver();
      return;
    }
  }

  snake1.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    generateFood();
  } else {
    const tail = snake1.pop();
    shadowTrail1.unshift({ x: tail.x, y: tail.y });
    if (shadowTrail1.length > 5) {
      shadowTrail1.pop();
    }
  }
}

/**
 * プレイヤー2のスネークを移動させる
 */
function moveSnake2() {
  if (!gameRunning || (dx2 === 0 && dy2 === 0)) return;

  const head = { x: snake2[0].x + dx2, y: snake2[0].y + dy2 };

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
    return;
  }

  for (let segment of snake2) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver();
      return;
    }
  }

  for (let segment of snake1) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver();
      return;
    }
  }

  snake2.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    generateFood();
  } else {
    const tail = snake2.pop();
    shadowTrail2.unshift({ x: tail.x, y: tail.y });
    if (shadowTrail2.length > 5) {
      shadowTrail2.pop();
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
  snake1 = [{ x: 10, y: 10 }];
  snake2 = [{ x: 20, y: 20 }];
  dx1 = 0;
  dy1 = 0;
  dx2 = 0;
  dy2 = 0;
  score = 0;
  scoreElement.textContent = score;
  gameRunning = true;
  gameOverElement.style.display = "none";
  shadowTrail1 = [];
  shadowTrail2 = [];
  generateFood();
}

/**
 * スネークの位置を更新し、ゲームを再描画するメインゲームループ
 */
function gameLoop() {
  moveSnake1();
  moveSnake2();
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
    // Player 1 controls (Arrow keys)
    case "ArrowUp":
      e.preventDefault();
      if (dy1 !== 1) {
        dx1 = 0;
        dy1 = -1;
      }
      break;
    case "ArrowDown":
      e.preventDefault();
      if (dy1 !== -1) {
        dx1 = 0;
        dy1 = 1;
      }
      break;
    case "ArrowLeft":
      e.preventDefault();
      if (dx1 !== 1) {
        dx1 = -1;
        dy1 = 0;
      }
      break;
    case "ArrowRight":
      e.preventDefault();
      if (dx1 !== -1) {
        dx1 = 1;
        dy1 = 0;
      }
      break;
    
    // Player 2 controls (WASD keys)
    case "KeyW":
      e.preventDefault();
      if (dy2 !== 1) {
        dx2 = 0;
        dy2 = -1;
      }
      break;
    case "KeyS":
      e.preventDefault();
      if (dy2 !== -1) {
        dx2 = 0;
        dy2 = 1;
      }
      break;
    case "KeyA":
      e.preventDefault();
      if (dx2 !== 1) {
        dx2 = -1;
        dy2 = 0;
      }
      break;
    case "KeyD":
      e.preventDefault();
      if (dx2 !== -1) {
        dx2 = 1;
        dy2 = 0;
      }
      break;
  }
});

// ゲームを初期化
generateFood();
setInterval(gameLoop, 100);
