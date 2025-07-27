import {
  GRID_SIZE,
  FOOD_SCORE,
  MAX_SHADOW_TRAIL_LENGTH,
  SHADOW_OPACITY_DECAY,
  PLAYER1_INITIAL_POSITION,
  PLAYER2_INITIAL_POSITION,
} from "./constants.js";

/** @type {number} 行/列あたりのタイル数 */
const TILE_COUNT = 600 / GRID_SIZE; // canvas.width / GRID_SIZE

/**
 * @typedef {Object} GameState
 * @property {Array<{x: number, y: number}>} snake1 - プレイヤー1のスネークのセグメント配列
 * @property {Array<{x: number, y: number}>} snake2 - プレイヤー2のスネークのセグメント配列
 * @property {Array<{x: number, y: number}>} foods - 食べ物の位置配列
 * @property {number} dx1 - プレイヤー1の水平移動方向
 * @property {number} dy1 - プレイヤー1の垂直移動方向
 * @property {number} dx2 - プレイヤー2の水平移動方向
 * @property {number} dy2 - プレイヤー2の垂直移動方向
 * @property {number} score - 現在のゲームスコア
 * @property {Array<{x: number, y: number}>} shadowTrail1 - プレイヤー1の影の軌跡位置の配列
 * @property {Array<{x: number, y: number}>} shadowTrail2 - プレイヤー2の影の軌跡位置の配列
 */

/** @type {GameState} */
let gameState = {
  snake1: [{ x: PLAYER1_INITIAL_POSITION.x, y: PLAYER1_INITIAL_POSITION.y }],
  snake2: [{ x: PLAYER2_INITIAL_POSITION.x, y: PLAYER2_INITIAL_POSITION.y }],
  foods: [],
  dx1: 0,
  dy1: 0,
  dx2: 0,
  dy2: 0,
  score: 0,
  shadowTrail1: [],
  shadowTrail2: [],
};

/**
 * ゲーム状態を取得する
 * @returns {GameState} 現在のゲーム状態
 */
export function getGameState() {
  return { ...gameState };
}

/**
 * ゲームを初期状態にリセットする
 */
export function resetGameState() {
  gameState = {
    snake1: [{ x: PLAYER1_INITIAL_POSITION.x, y: PLAYER1_INITIAL_POSITION.y }],
    snake2: [{ x: PLAYER2_INITIAL_POSITION.x, y: PLAYER2_INITIAL_POSITION.y }],
    foods: [],
    dx1: 0,
    dy1: 0,
    dx2: 0,
    dy2: 0,
    score: 0,
    shadowTrail1: [],
    shadowTrail2: [],
  };
}

/**
 * プレイヤー1の移動方向を設定する
 * @param {number} dx - 水平移動方向
 * @param {number} dy - 垂直移動方向
 */
export function setPlayer1Direction(dx, dy) {
  gameState.dx1 = dx;
  gameState.dy1 = dy;
}

/**
 * プレイヤー2の移動方向を設定する
 * @param {number} dx - 水平移動方向
 * @param {number} dy - 垂直移動方向
 */
export function setPlayer2Direction(dx, dy) {
  gameState.dx2 = dx;
  gameState.dy2 = dy;
}

/**
 * ゲームグリッド上にランダムな位置で新しい食べ物を生成する
 * @param {number} playerCount - プレイヤー数 (1 または 2)
 */
export function generateFood(playerCount) {
  const maxFoods = playerCount === 1 ? 1 : 2;
  while (gameState.foods.length < maxFoods) {
    let validPosition = false;
    /** @type {{x: number, y: number}} */
    let newFood = { x: 0, y: 0 };

    while (!validPosition) {
      newFood = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT),
      };

      validPosition = true;

      // スネーク1との衝突チェック
      for (let segment of gameState.snake1) {
        if (newFood.x === segment.x && newFood.y === segment.y) {
          validPosition = false;
          break;
        }
      }

      // スネーク2との衝突チェック
      if (validPosition) {
        for (let segment of gameState.snake2) {
          if (newFood.x === segment.x && newFood.y === segment.y) {
            validPosition = false;
            break;
          }
        }
      }

      // 既存の食べ物との衝突チェック
      if (validPosition) {
        for (let existingFood of gameState.foods) {
          if (newFood.x === existingFood.x && newFood.y === existingFood.y) {
            validPosition = false;
            break;
          }
        }
      }
    }

    gameState.foods.push(newFood);
  }
}

/**
 * プレイヤー1のスネークを移動させる
 * @param {number} playerCount - プレイヤー数
 * @param {boolean} gameRunning - ゲーム実行状態
 * @returns {{collision: boolean, ateFood: boolean, newScore: number}} 移動結果
 */
export function moveSnake1(playerCount, gameRunning) {
  if (!gameRunning || (gameState.dx1 === 0 && gameState.dy1 === 0)) {
    return { collision: false, ateFood: false, newScore: gameState.score };
  }

  const head = {
    x: gameState.snake1[0].x + gameState.dx1,
    y: gameState.snake1[0].y + gameState.dy1,
  };

  // 境界チェック
  if (
    head.x < 0 ||
    head.x >= TILE_COUNT ||
    head.y < 0 ||
    head.y >= TILE_COUNT
  ) {
    return { collision: true, ateFood: false, newScore: gameState.score };
  }

  // 自己衝突チェック
  for (let segment of gameState.snake1) {
    if (head.x === segment.x && head.y === segment.y) {
      return { collision: true, ateFood: false, newScore: gameState.score };
    }
  }

  // スネーク2との衝突チェック（2プレイヤーモードのみ）
  if (playerCount === 2) {
    for (let segment of gameState.snake2) {
      if (head.x === segment.x && head.y === segment.y) {
        return { collision: true, ateFood: false, newScore: gameState.score };
      }
    }
  }

  gameState.snake1.unshift(head);

  // 食べ物との衝突チェック
  let ateFood = false;
  for (let i = gameState.foods.length - 1; i >= 0; i--) {
    if (head.x === gameState.foods[i].x && head.y === gameState.foods[i].y) {
      gameState.score += FOOD_SCORE;
      gameState.foods.splice(i, 1);
      ateFood = true;
      break;
    }
  }

  if (!ateFood) {
    const tail = gameState.snake1.pop();
    if (tail) {
      gameState.shadowTrail1.unshift({ x: tail.x, y: tail.y });
    }
    if (gameState.shadowTrail1.length > MAX_SHADOW_TRAIL_LENGTH) {
      gameState.shadowTrail1.pop();
    }
  }

  return { collision: false, ateFood, newScore: gameState.score };
}

/**
 * プレイヤー2のスネークを移動させる
 * @param {boolean} gameRunning - ゲーム実行状態
 * @returns {{collision: boolean, ateFood: boolean, newScore: number}} 移動結果
 */
export function moveSnake2(gameRunning) {
  if (!gameRunning || (gameState.dx2 === 0 && gameState.dy2 === 0)) {
    return { collision: false, ateFood: false, newScore: gameState.score };
  }

  const head = {
    x: gameState.snake2[0].x + gameState.dx2,
    y: gameState.snake2[0].y + gameState.dy2,
  };

  // 境界チェック
  if (
    head.x < 0 ||
    head.x >= TILE_COUNT ||
    head.y < 0 ||
    head.y >= TILE_COUNT
  ) {
    return { collision: true, ateFood: false, newScore: gameState.score };
  }

  // 自己衝突チェック
  for (let segment of gameState.snake2) {
    if (head.x === segment.x && head.y === segment.y) {
      return { collision: true, ateFood: false, newScore: gameState.score };
    }
  }

  // スネーク1との衝突チェック
  for (let segment of gameState.snake1) {
    if (head.x === segment.x && head.y === segment.y) {
      return { collision: true, ateFood: false, newScore: gameState.score };
    }
  }

  gameState.snake2.unshift(head);

  // 食べ物との衝突チェック
  let ateFood = false;
  for (let i = gameState.foods.length - 1; i >= 0; i--) {
    if (head.x === gameState.foods[i].x && head.y === gameState.foods[i].y) {
      gameState.score += FOOD_SCORE;
      gameState.foods.splice(i, 1);
      ateFood = true;
      break;
    }
  }

  if (!ateFood) {
    const tail = gameState.snake2.pop();
    if (tail) {
      gameState.shadowTrail2.unshift({ x: tail.x, y: tail.y });
    }
    if (gameState.shadowTrail2.length > MAX_SHADOW_TRAIL_LENGTH) {
      gameState.shadowTrail2.pop();
    }
  }

  return { collision: false, ateFood, newScore: gameState.score };
}
