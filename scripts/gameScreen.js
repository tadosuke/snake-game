import {
  GRID_SIZE,
  GAME_STATE_PLAYING,
  GAME_STATE_GAME_OVER,
  PLAYER1_COLOR,
  PLAYER2_COLOR,
  FOOD_COLOR,
  BACKGROUND_COLOR,
  PLAYER1_SHADOW_COLOR_BASE,
  PLAYER2_SHADOW_COLOR_BASE,
  GRID_BORDER_SIZE,
  SHADOW_OPACITY_DECAY,
} from "./constants.js";
import {
  setPlayerCount,
  setGameState,
  setGameRunning,
  playerCount,
  gameRunning,
  gameState,
} from "./main.js";
import { showTitleScreen, titleScreen } from "./titleScreen.js";
import {
  getGameState,
  resetGameState,
  setPlayer1Direction,
  setPlayer2Direction,
  generateFood,
  moveSnake1,
  moveSnake2,
} from "./gameState.js";

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
 * 背景、影の軌跡、スネーク、食べ物を含むゲーム全体をレンダリングする
 */
function drawGame() {
  const currentGameState = getGameState();

  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw player 1 shadow trail with fading effect (green)
  for (let i = 0; i < currentGameState.shadowTrail1.length; i++) {
    const shadow = currentGameState.shadowTrail1[i];
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
    for (let i = 0; i < currentGameState.shadowTrail2.length; i++) {
      const shadow = currentGameState.shadowTrail2[i];
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
  for (let segment of currentGameState.snake1) {
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
    for (let segment of currentGameState.snake2) {
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
  for (let food of currentGameState.foods) {
    ctx.fillRect(
      food.x * GRID_SIZE,
      food.y * GRID_SIZE,
      GRID_SIZE - GRID_BORDER_SIZE,
      GRID_SIZE - GRID_BORDER_SIZE
    );
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
  resetGameState();
  const currentGameState = getGameState();
  scoreElement.textContent = currentGameState.score.toString();
  setGameRunning(true);
  setGameState(GAME_STATE_PLAYING);
  gameOverElement.style.display = "none";
  generateFood(playerCount);
}

/**
 * スネークの位置を更新し、ゲームを再描画するメインゲームループ
 */
export function gameLoop() {
  if (gameState === GAME_STATE_PLAYING) {
    const result1 = moveSnake1(playerCount, gameRunning);
    if (result1.collision) {
      gameOver();
      return;
    }
    if (result1.ateFood) {
      scoreElement.textContent = result1.newScore.toString();
      generateFood(playerCount);
    }

    if (playerCount === 2) {
      const result2 = moveSnake2(gameRunning);
      if (result2.collision) {
        gameOver();
        return;
      }
      if (result2.ateFood) {
        scoreElement.textContent = result2.newScore.toString();
        generateFood(playerCount);
      }
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
      const currentState1 = getGameState();
      if (currentState1.dy1 !== 1) {
        setPlayer1Direction(0, -1);
      }
      break;
    case "ArrowDown":
      e.preventDefault();
      const currentState2 = getGameState();
      if (currentState2.dy1 !== -1) {
        setPlayer1Direction(0, 1);
      }
      break;
    case "ArrowLeft":
      e.preventDefault();
      const currentState3 = getGameState();
      if (currentState3.dx1 !== 1) {
        setPlayer1Direction(-1, 0);
      }
      break;
    case "ArrowRight":
      e.preventDefault();
      const currentState4 = getGameState();
      if (currentState4.dx1 !== -1) {
        setPlayer1Direction(1, 0);
      }
      break;

    // Player 2 controls (WASD keys) - only in 2-player mode
    case "KeyW":
      if (playerCount === 2) {
        e.preventDefault();
        const currentState5 = getGameState();
        if (currentState5.dy2 !== 1) {
          setPlayer2Direction(0, -1);
        }
      }
      break;
    case "KeyS":
      if (playerCount === 2) {
        e.preventDefault();
        const currentState6 = getGameState();
        if (currentState6.dy2 !== -1) {
          setPlayer2Direction(0, 1);
        }
      }
      break;
    case "KeyA":
      if (playerCount === 2) {
        e.preventDefault();
        const currentState7 = getGameState();
        if (currentState7.dx2 !== 1) {
          setPlayer2Direction(-1, 0);
        }
      }
      break;
    case "KeyD":
      if (playerCount === 2) {
        e.preventDefault();
        const currentState8 = getGameState();
        if (currentState8.dx2 !== -1) {
          setPlayer2Direction(1, 0);
        }
      }
      break;
  }
});

// バックボタンイベントリスナーを追加
backToTitleBtn.addEventListener("click", () => {
  showTitleScreen();
});
