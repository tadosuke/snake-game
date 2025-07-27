import {
  GRID_SIZE,
  MAX_SHADOW_TRAIL_LENGTH,
  SHADOW_OPACITY_DECAY,
} from './constants.js';

/** @type {number} 行/列あたりのタイル数 */
const TILE_COUNT = 600 / GRID_SIZE; // canvas.width / GRID_SIZE

/**
 * スネークの境界チェックを行う
 * @param {{x: number, y: number}} head - スネークの頭の位置
 * @returns {boolean} 境界内にある場合はtrue
 */
export function isWithinBounds(head) {
  return head.x >= 0 && head.x < TILE_COUNT && head.y >= 0 && head.y < TILE_COUNT;
}

/**
 * スネークの自己衝突チェックを行う
 * @param {{x: number, y: number}} head - スネークの頭の位置
 * @param {Array<{x: number, y: number}>} snake - スネークのセグメント配列
 * @returns {boolean} 衝突している場合はtrue
 */
export function checkSelfCollision(head, snake) {
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      return true;
    }
  }
  return false;
}

/**
 * スネーク同士の衝突チェックを行う
 * @param {{x: number, y: number}} head - チェックするスネークの頭の位置
 * @param {Array<{x: number, y: number}>} otherSnake - 相手のスネークのセグメント配列
 * @returns {boolean} 衝突している場合はtrue
 */
export function checkSnakeCollision(head, otherSnake) {
  for (let segment of otherSnake) {
    if (head.x === segment.x && head.y === segment.y) {
      return true;
    }
  }
  return false;
}

/**
 * スネークと食べ物の衝突チェックを行う
 * @param {{x: number, y: number}} head - スネークの頭の位置
 * @param {Array<{x: number, y: number}>} foods - 食べ物の位置配列
 * @returns {{collision: boolean, foodIndex: number}} 衝突情報
 */
export function checkFoodCollision(head, foods) {
  for (let i = 0; i < foods.length; i++) {
    if (head.x === foods[i].x && head.y === foods[i].y) {
      return { collision: true, foodIndex: i };
    }
  }
  return { collision: false, foodIndex: -1 };
}

/**
 * スネークを指定された方向に移動させる
 * @param {Array<{x: number, y: number}>} snake - スネークのセグメント配列
 * @param {number} dx - 水平移動方向
 * @param {number} dy - 垂直移動方向
 * @param {boolean} ateFood - 食べ物を食べたかどうか
 * @param {Array<{x: number, y: number}>} shadowTrail - 影の軌跡配列
 * @returns {{newHead: {x: number, y: number}, tail: {x: number, y: number} | null}} 移動結果
 */
export function moveSnake(snake, dx, dy, ateFood, shadowTrail) {
  const newHead = {
    x: snake[0].x + dx,
    y: snake[0].y + dy,
  };

  snake.unshift(newHead);

  /** @type {{x: number, y: number} | null} */
  let tail = null;
  if (!ateFood) {
    const poppedTail = snake.pop();
    if (poppedTail) {
      tail = poppedTail;
      shadowTrail.unshift({ x: tail.x, y: tail.y });
      if (shadowTrail.length > MAX_SHADOW_TRAIL_LENGTH) {
        shadowTrail.pop();
      }
    }
  }

  return { newHead, tail };
}

/**
 * 指定された位置が他のスネークと重なっているかチェック
 * @param {{x: number, y: number}} position - チェックする位置
 * @param {Array<{x: number, y: number}>} snake1 - プレイヤー1のスネーク
 * @param {Array<{x: number, y: number}>} snake2 - プレイヤー2のスネーク
 * @returns {boolean} 重なっている場合はtrue
 */
export function isPositionOccupiedBySnakes(position, snake1, snake2) {
  // スネーク1との衝突チェック
  for (let segment of snake1) {
    if (position.x === segment.x && position.y === segment.y) {
      return true;
    }
  }

  // スネーク2との衝突チェック
  for (let segment of snake2) {
    if (position.x === segment.x && position.y === segment.y) {
      return true;
    }
  }

  return false;
}

/**
 * ゲームグリッド上にランダムな位置を生成する
 * @returns {{x: number, y: number}} ランダムな位置
 */
export function generateRandomPosition() {
  return {
    x: Math.floor(Math.random() * TILE_COUNT),
    y: Math.floor(Math.random() * TILE_COUNT),
  };
}