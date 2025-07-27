import {
  FOOD_SCORE,
  PLAYER1_INITIAL_POSITION,
  PLAYER2_INITIAL_POSITION,
} from "./constants.js";
import {
  isWithinBounds,
  checkSelfCollision,
  checkSnakeCollision,
  checkFoodCollision,
  moveSnake,
  isPositionOccupiedBySnakes,
  generateRandomPosition,
} from "./snake.js";

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
      newFood = generateRandomPosition();
      validPosition = true;

      // スネークとの衝突チェック
      if (
        isPositionOccupiedBySnakes(newFood, gameState.snake1, gameState.snake2)
      ) {
        validPosition = false;
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
  if (!isWithinBounds(head)) {
    return { collision: true, ateFood: false, newScore: gameState.score };
  }

  // 自己衝突チェック
  if (checkSelfCollision(head, gameState.snake1)) {
    return { collision: true, ateFood: false, newScore: gameState.score };
  }

  // スネーク2との衝突チェック（2プレイヤーモードのみ）
  if (playerCount === 2) {
    if (checkSnakeCollision(head, gameState.snake2)) {
      return { collision: true, ateFood: false, newScore: gameState.score };
    }
  }

  // 食べ物との衝突チェック
  const foodCollision = checkFoodCollision(head, gameState.foods);
  let ateFood = false;
  if (foodCollision.collision) {
    gameState.score += FOOD_SCORE;
    gameState.foods.splice(foodCollision.foodIndex, 1);
    ateFood = true;
  }

  // スネークを移動
  moveSnake(
    gameState.snake1,
    gameState.dx1,
    gameState.dy1,
    ateFood,
    gameState.shadowTrail1
  );

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
  if (!isWithinBounds(head)) {
    return { collision: true, ateFood: false, newScore: gameState.score };
  }

  // 自己衝突チェック
  if (checkSelfCollision(head, gameState.snake2)) {
    return { collision: true, ateFood: false, newScore: gameState.score };
  }

  // スネーク1との衝突チェック
  if (checkSnakeCollision(head, gameState.snake1)) {
    return { collision: true, ateFood: false, newScore: gameState.score };
  }

  // 食べ物との衝突チェック
  const foodCollision = checkFoodCollision(head, gameState.foods);
  let ateFood = false;
  if (foodCollision.collision) {
    gameState.score += FOOD_SCORE;
    gameState.foods.splice(foodCollision.foodIndex, 1);
    ateFood = true;
  }

  // スネークを移動
  moveSnake(
    gameState.snake2,
    gameState.dx2,
    gameState.dy2,
    ateFood,
    gameState.shadowTrail2
  );

  return { collision: false, ateFood, newScore: gameState.score };
}
