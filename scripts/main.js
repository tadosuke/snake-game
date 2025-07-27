import { GAME_LOOP_INTERVAL, GAME_STATE_TITLE } from "./constants.js";
import { gameLoop } from "./gameScreen.js";

/** @type {boolean} ゲームが現在実行中かどうか */
export let gameRunning = false;
/** @type {string} 現在のゲーム状態 ('title' | 'playing' | 'gameOver') */
export let gameState = GAME_STATE_TITLE;
/** @type {number} プレイヤー数 (1 または 2) */
export let playerCount = 1;

/**
 * ゲーム状態を設定する
 * @param {string} newState - 新しいゲーム状態
 */
export function setGameState(newState) {
  gameState = newState;
}

/**
 * ゲーム実行状態を設定する
 * @param {boolean} running - ゲームが実行中かどうか
 */
export function setGameRunning(running) {
  gameRunning = running;
}

/**
 * プレイヤー数を設定する
 * @param {number} count - プレイヤー数
 */
export function setPlayerCount(count) {
  playerCount = count;
}

// DOM読み込み完了後にゲームループを開始
document.addEventListener("DOMContentLoaded", () => {
  setInterval(gameLoop, GAME_LOOP_INTERVAL);
});
