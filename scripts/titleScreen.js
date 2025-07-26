import { GAME_STATE_TITLE } from './constants.js';
import { startGame, titleScreen, gameScreen, onePlayerBtn, twoPlayerBtn } from './gameScreen.js';
import { setGameState, setGameRunning } from './main.js';

// DOM elements are declared in gameScreen.js

/**
 * タイトル画面を表示する
 */
function showTitleScreen() {
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