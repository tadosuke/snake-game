import {
  GRID_SIZE,
  FOOD_SCORE,
  MAX_SHADOW_TRAIL_LENGTH,
  SHADOW_OPACITY_DECAY,
  GAME_STATE_PLAYING,
  GAME_STATE_GAME_OVER,
  GAME_STATE_TITLE,
  PLAYER1_INITIAL_POSITION,
  PLAYER2_INITIAL_POSITION,
  PLAYER1_COLOR,
  PLAYER2_COLOR,
  FOOD_COLOR,
  BACKGROUND_COLOR,
  PLAYER1_SHADOW_COLOR_BASE,
  PLAYER2_SHADOW_COLOR_BASE,
  GRID_BORDER_SIZE
} from './constants.js';
import { setPlayerCount, setGameState, setGameRunning, playerCount, gameRunning, gameState } from './main.js';

const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("gameCanvas")
);
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
const scoreElement = /** @type {HTMLElement} */ (
  document.getElementById("score")
);
const gameOverElement = /** @type {HTMLElement} */ (
  document.getElementById("gameOver")
);
export const gameScreen = /** @type {HTMLElement} */ (
  document.getElementById("gameScreen")
);
const backToTitleBtn = /** @type {HTMLElement} */ (
  document.getElementById("backToTitleBtn")
);
const gameInstructions = /** @type {HTMLElement} */ (
  document.getElementById("gameInstructions")
);
export const titleScreen = /** @type {HTMLElement} */ (
  document.getElementById("titleScreen")
);
export const onePlayerBtn = /** @type {HTMLElement} */ (
  document.getElementById("onePlayerBtn")
);
export const twoPlayerBtn = /** @type {HTMLElement} */ (
  document.getElementById("twoPlayerBtn")
);

/** @type {number} 行/列あたりのタイル数 */
const tileCount = canvas.width / GRID_SIZE;

/** @type {Array<{x: number, y: number}>} プレイヤー1のスネークのセグメント配列 */
let snake1 = [{ x: PLAYER1_INITIAL_POSITION.x, y: PLAYER1_INITIAL_POSITION.y }];
/** @type {Array<{x: number, y: number}>} プレイヤー2のスネークのセグメント配列 */
let snake2 = [{ x: PLAYER2_INITIAL_POSITION.x, y: PLAYER2_INITIAL_POSITION.y }];
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
/** @type {Array<{x: number, y: number}>} プレイヤー1の影の軌跡位置の配列 */
let shadowTrail1 = [];
/** @type {Array<{x: number, y: number}>} プレイヤー2の影の軌跡位置の配列 */
let shadowTrail2 = [];

/**
 * ゲーム画面を表示し、ゲームを開始する
 * @param {number} players - プレイヤー数 (1 または 2)
 */
export function startGame(players) {
  setPlayerCount(players);
  setGameState(GAME_STATE_PLAYING);
  titleScreen.style.display = "none";
  gameScreen.style.display = "block";

  // プレイヤー数に応じて操作説明を更新
  if (playerCount === 1) {
    gameInstructions.textContent = "矢印キーで操作 | Spaceキーでリスタート";
  } else {
    gameInstructions.textContent =
      "プレイヤー1: 矢印キー (緑) | プレイヤー2: WASD (青) | Spaceキーでリスタート";
  }

  resetGame();
}

/**
 * ゲームグリッド上にランダムな位置で新しい食べ物を生成する
 */
function generateFood() {
  // 1プレイヤーモードでは1つ、2プレイヤーモードでは2つの食べ物まで
  const maxFoods = playerCount === 1 ? 1 : 2;
  while (foods.length < maxFoods) {
    let validPosition = false;
    /** @type {{x: number, y: number}} */
    let newFood = { x: 0, y: 0 };

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
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw player 1 shadow trail with fading effect (green)
  for (let i = 0; i < shadowTrail1.length; i++) {
    const shadow = shadowTrail1[i];
    const age = i + 1;
    const opacity = Math.max(0, 1 - age * SHADOW_OPACITY_DECAY);
    ctx.fillStyle = `rgba(${PLAYER1_SHADOW_COLOR_BASE}, ${opacity * 0.75})`;
    ctx.fillRect(
      shadow.x * GRID_SIZE,
      shadow.y * GRID_SIZE,
      GRID_SIZE - GRID_BORDER_SIZE,
      GRID_SIZE - GRID_BORDER_SIZE
    );
  }

  // Draw player 2 shadow trail with fading effect (blue) - only in 2-player mode
  if (playerCount === 2) {
    for (let i = 0; i < shadowTrail2.length; i++) {
      const shadow = shadowTrail2[i];
      const age = i + 1;
      const opacity = Math.max(0, 1 - age * SHADOW_OPACITY_DECAY);
      ctx.fillStyle = `rgba(${PLAYER2_SHADOW_COLOR_BASE}, ${opacity * 0.75})`;
      ctx.fillRect(
        shadow.x * GRID_SIZE,
        shadow.y * GRID_SIZE,
        GRID_SIZE - GRID_BORDER_SIZE,
        GRID_SIZE - GRID_BORDER_SIZE
      );
    }
  }

  // Draw player 1 snake (green)
  ctx.fillStyle = PLAYER1_COLOR;
  for (let segment of snake1) {
    ctx.fillRect(
      segment.x * GRID_SIZE,
      segment.y * GRID_SIZE,
      GRID_SIZE - GRID_BORDER_SIZE,
      GRID_SIZE - GRID_BORDER_SIZE
    );
  }

  // Draw player 2 snake (blue) - only in 2-player mode
  if (playerCount === 2) {
    ctx.fillStyle = PLAYER2_COLOR;
    for (let segment of snake2) {
      ctx.fillRect(
        segment.x * GRID_SIZE,
        segment.y * GRID_SIZE,
        GRID_SIZE - GRID_BORDER_SIZE,
        GRID_SIZE - GRID_BORDER_SIZE
      );
    }
  }

  // Draw foods
  ctx.fillStyle = FOOD_COLOR;
  for (let food of foods) {
    ctx.fillRect(
      food.x * GRID_SIZE,
      food.y * GRID_SIZE,
      GRID_SIZE - GRID_BORDER_SIZE,
      GRID_SIZE - GRID_BORDER_SIZE
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
      score += FOOD_SCORE;
      scoreElement.textContent = score.toString();
      foods.splice(i, 1); // 食べた食べ物を削除
      ateFood = true;
      break;
    }
  }

  if (ateFood) {
    generateFood(); // 新しい食べ物を生成
  } else {
    const tail = snake1.pop();
    if (tail) {
      shadowTrail1.unshift({ x: tail.x, y: tail.y });
    }
    if (shadowTrail1.length > MAX_SHADOW_TRAIL_LENGTH) {
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
      score += FOOD_SCORE;
      scoreElement.textContent = score.toString();
      foods.splice(i, 1); // 食べた食べ物を削除
      ateFood = true;
      break;
    }
  }

  if (ateFood) {
    generateFood(); // 新しい食べ物を生成
  } else {
    const tail = snake2.pop();
    if (tail) {
      shadowTrail2.unshift({ x: tail.x, y: tail.y });
    }
    if (shadowTrail2.length > MAX_SHADOW_TRAIL_LENGTH) {
      shadowTrail2.pop();
    }
  }
}

/**
 * ゲームを終了し、ゲームオーバー画面を表示する
 */
function gameOver() {
  setGameRunning(false);
  setGameState(GAME_STATE_GAME_OVER);
  gameOverElement.style.display = "block";
}

/**
 * ゲームを初期状態にリセットし、新しいゲームを開始する
 */
function resetGame() {
  snake1 = [{ x: PLAYER1_INITIAL_POSITION.x, y: PLAYER1_INITIAL_POSITION.y }];
  snake2 = [{ x: PLAYER2_INITIAL_POSITION.x, y: PLAYER2_INITIAL_POSITION.y }];
  dx1 = 0;
  dy1 = 0;
  dx2 = 0;
  dy2 = 0;
  score = 0;
  scoreElement.textContent = score.toString();
  setGameRunning(true);
  setGameState(GAME_STATE_PLAYING);
  gameOverElement.style.display = "none";
  shadowTrail1 = [];
  shadowTrail2 = [];
  foods = [];
  generateFood();
}

/**
 * スネークの位置を更新し、ゲームを再描画するメインゲームループ
 */
export function gameLoop() {
  if (gameState === GAME_STATE_PLAYING) {
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
  if (gameState === GAME_STATE_GAME_OVER && e.code === "Space") {
    e.preventDefault();
    resetGame();
    return;
  }

  if (gameState !== GAME_STATE_PLAYING) return;

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

// バックボタンイベントリスナーを追加
backToTitleBtn.addEventListener("click", () => {
  setGameState(GAME_STATE_TITLE);
  titleScreen.style.display = "block";
  gameScreen.style.display = "none";
  setGameRunning(false);
});
