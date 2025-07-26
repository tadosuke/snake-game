/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("gameCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
/** @type {HTMLElement} */
const scoreElement = document.getElementById("score");
/** @type {HTMLElement} */
const gameOverElement = document.getElementById("gameOver");
/** @type {HTMLElement} */
const titleScreen = document.getElementById("titleScreen");
/** @type {HTMLElement} */
const gameScreen = document.getElementById("gameScreen");
/** @type {HTMLElement} */
const onePlayerBtn = document.getElementById("onePlayerBtn");
/** @type {HTMLElement} */
const twoPlayerBtn = document.getElementById("twoPlayerBtn");
/** @type {HTMLElement} */
const backToTitleBtn = document.getElementById("backToTitleBtn");
/** @type {HTMLElement} */
const gameInstructions = document.getElementById("gameInstructions");

/** @type {number} 各グリッドセルのピクセルサイズ */
const gridSize = 20;
/** @type {number} 行/列あたりのタイル数 */
const tileCount = canvas.width / gridSize;

/** @type {Array<{x: number, y: number}>} プレイヤー1のスネークのセグメント配列 */
let snake1 = [{ x: 10, y: 10 }];
/** @type {Array<{x: number, y: number}>} プレイヤー2のスネークのセグメント配列 */
let snake2 = [{ x: 20, y: 20 }];
/** @type {Array<{x: number, y: number}>} 食べ物の位置配列 */
let foods = [];
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
let gameRunning = false;
/** @type {string} 現在のゲーム状態 ('title' | 'playing' | 'gameOver') */
let gameState = 'title';
/** @type {number} プレイヤー数 (1 または 2) */
let playerCount = 1;
/** @type {Array<{x: number, y: number}>} プレイヤー1の影の軌跡位置の配列 */
let shadowTrail1 = [];
/** @type {Array<{x: number, y: number}>} プレイヤー2の影の軌跡位置の配列 */
let shadowTrail2 = [];

/**
 * タイトル画面を表示する
 */
function showTitleScreen() {
  gameState = 'title';
  titleScreen.style.display = 'block';
  gameScreen.style.display = 'none';
  gameRunning = false;
}

/**
 * ゲーム画面を表示し、ゲームを開始する
 * @param {number} players - プレイヤー数 (1 または 2)
 */
function startGame(players) {
  playerCount = players;
  gameState = 'playing';
  titleScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  
  // プレイヤー数に応じて操作説明を更新
  if (playerCount === 1) {
    gameInstructions.textContent = "矢印キーで操作 | Spaceキーでリスタート";
  } else {
    gameInstructions.textContent = "プレイヤー1: 矢印キー (緑) | プレイヤー2: WASD (青) | Spaceキーでリスタート";
  }
  
  resetGame();
}

/**
 * ゲームグリッド上にランダムな位置で新しい食べ物を生成する
 */
function generateFood() {
  // 最大2つの食べ物まで
  while (foods.length < 2) {
    let validPosition = false;
    let newFood;
    
    while (!validPosition) {
      newFood = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
      };
      
      validPosition = true;
      
      // スネーク1との衝突チェック
      for (let segment of snake1) {
        if (newFood.x === segment.x && newFood.y === segment.y) {
          validPosition = false;
          break;
        }
      }
      
      // スネーク2との衝突チェック
      if (validPosition) {
        for (let segment of snake2) {
          if (newFood.x === segment.x && newFood.y === segment.y) {
            validPosition = false;
            break;
          }
        }
      }
      
      // 既存の食べ物との衝突チェック
      if (validPosition) {
        for (let existingFood of foods) {
          if (newFood.x === existingFood.x && newFood.y === existingFood.y) {
            validPosition = false;
            break;
          }
        }
      }
    }
    
    foods.push(newFood);
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

  // Draw player 2 shadow trail with fading effect (blue) - only in 2-player mode
  if (playerCount === 2) {
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

  // Draw player 2 snake (blue) - only in 2-player mode
  if (playerCount === 2) {
    ctx.fillStyle = "blue";
    for (let segment of snake2) {
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize - 2,
        gridSize - 2
      );
    }
  }

  // Draw foods
  ctx.fillStyle = "red";
  for (let food of foods) {
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }

  // Draw foods
  ctx.fillStyle = "red";
  for (let food of foods) {
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }
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

  // Check collision with snake2 only in 2-player mode
  if (playerCount === 2) {
    for (let segment of snake2) {
      if (head.x === segment.x && head.y === segment.y) {
        gameOver();
        return;
      }
    }
  }

  snake1.unshift(head);

  // 複数の食べ物との衝突チェック
  let ateFood = false;
  for (let i = foods.length - 1; i >= 0; i--) {
    if (head.x === foods[i].x && head.y === foods[i].y) {
      score += 10;
      scoreElement.textContent = score;
      foods.splice(i, 1); // 食べた食べ物を削除
      ateFood = true;
      break;
    }
  }
  
  if (ateFood) {
    generateFood(); // 新しい食べ物を生成
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

  // Check collision with snake1
  for (let segment of snake1) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver();
      return;
    }
  }

  snake2.unshift(head);

  // 複数の食べ物との衝突チェック
  let ateFood = false;
  for (let i = foods.length - 1; i >= 0; i--) {
    if (head.x === foods[i].x && head.y === foods[i].y) {
      score += 10;
      scoreElement.textContent = score;
      foods.splice(i, 1); // 食べた食べ物を削除
      ateFood = true;
      break;
    }
  }
  
  if (ateFood) {
    generateFood(); // 新しい食べ物を生成
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
  gameState = 'gameOver';
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
  gameState = 'playing';
  gameOverElement.style.display = "none";
  shadowTrail1 = [];
  shadowTrail2 = [];
  foods = [];
  generateFood();
}

/**
 * スネークの位置を更新し、ゲームを再描画するメインゲームループ
 */
function gameLoop() {
  if (gameState === 'playing') {
    moveSnake1();
    if (playerCount === 2) {
      moveSnake2();
    }
    drawGame();
  }
}

/**
 * スネークの操作とゲームリスタートのためのキーボード入力を処理する
 * @param {KeyboardEvent} e - キーボードイベント
 */
document.addEventListener("keydown", (e) => {
  if (gameState === 'gameOver' && e.code === "Space") {
    e.preventDefault();
    resetGame();
    return;
  }

  if (gameState !== 'playing') return;

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
    
    // Player 2 controls (WASD keys) - only in 2-player mode
    case "KeyW":
      if (playerCount === 2) {
        e.preventDefault();
        if (dy2 !== 1) {
          dx2 = 0;
          dy2 = -1;
        }
      }
      break;
    case "KeyS":
      if (playerCount === 2) {
        e.preventDefault();
        if (dy2 !== -1) {
          dx2 = 0;
          dy2 = 1;
        }
      }
      break;
    case "KeyA":
      if (playerCount === 2) {
        e.preventDefault();
        if (dx2 !== 1) {
          dx2 = -1;
          dy2 = 0;
        }
      }
      break;
    case "KeyD":
      if (playerCount === 2) {
        e.preventDefault();
        if (dx2 !== -1) {
          dx2 = 1;
          dy2 = 0;
        }
      }
      break;
  }
});

// ボタンイベントリスナーを追加
onePlayerBtn.addEventListener('click', () => startGame(1));
twoPlayerBtn.addEventListener('click', () => startGame(2));
backToTitleBtn.addEventListener('click', showTitleScreen);

// ゲームループを開始
setInterval(gameLoop, 100);

// 初期状態でタイトル画面を表示
showTitleScreen();
