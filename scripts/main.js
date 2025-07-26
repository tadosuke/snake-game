/** @type {boolean} ゲームが現在実行中かどうか */
let gameRunning = false;
/** @type {string} 現在のゲーム状態 ('title' | 'playing' | 'gameOver') */
let gameState = 'title';
/** @type {number} プレイヤー数 (1 または 2) */
let playerCount = 1;

// DOM読み込み完了後にゲームループを開始
document.addEventListener('DOMContentLoaded', () => {
  setInterval(gameLoop, 100);
});