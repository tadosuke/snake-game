/** @type {HTMLElement} */
const titleScreen = document.getElementById("titleScreen");
/** @type {HTMLElement} */
const onePlayerBtn = document.getElementById("onePlayerBtn");
/** @type {HTMLElement} */
const twoPlayerBtn = document.getElementById("twoPlayerBtn");

/**
 * タイトル画面を表示する
 */
function showTitleScreen() {
  gameState = 'title';
  titleScreen.style.display = 'block';
  gameScreen.style.display = 'none';
  gameRunning = false;
}

// ボタンイベントリスナーを追加
onePlayerBtn.addEventListener('click', () => startGame(1));
twoPlayerBtn.addEventListener('click', () => startGame(2));

// DOM読み込み完了後にタイトル画面を表示
document.addEventListener('DOMContentLoaded', () => {
  showTitleScreen();
});