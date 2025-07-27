import { GAME_STATE_TITLE } from './constants.js';
import { startGame } from './gameScreen.js';
import { setGameState, setGameRunning } from './main.js';

// DOM elements for title screen
export const titleScreen = /** @type {HTMLElement} */ (
  document.getElementById("titleScreen")
);
export const onePlayerBtn = /** @type {HTMLElement} */ (
  document.getElementById("onePlayerBtn")
);
export const twoPlayerBtn = /** @type {HTMLElement} */ (
  document.getElementById("twoPlayerBtn")
);
const gameScreen = /** @type {HTMLElement} */ (
  document.getElementById("gameScreen")
);

/**
 * タイトル画面を表示する
 */
export function showTitleScreen() {
  setGameState(GAME_STATE_TITLE);
  titleScreen.style.display = 'block';
  gameScreen.style.display = 'none';
  setGameRunning(false);
}

// ボタンイベントリスナーを追加
onePlayerBtn.addEventListener('click', () => startGame(1));
twoPlayerBtn.addEventListener('click', () => startGame(2));

// DOM読み込み完了後にタイトル画面を表示
document.addEventListener('DOMContentLoaded', () => {
  showTitleScreen();
});