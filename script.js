/**
 * メインスクリプト - タイトル画面とゲーム画面を調整する
 */

// ゲームループを開始
setInterval(() => {
  window.gameLoop();
}, 100);

// 初期状態でタイトル画面を表示
document.addEventListener('DOMContentLoaded', () => {
  window.showTitleScreen();
});
