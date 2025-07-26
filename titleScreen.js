/**
 * タイトル画面の管理を行うモジュール
 */

/** @type {HTMLElement} */
const titleScreen = document.getElementById("titleScreen");
/** @type {HTMLElement} */
const gameScreen = document.getElementById("gameScreen");
/** @type {HTMLElement} */
const onePlayerBtn = document.getElementById("onePlayerBtn");
/** @type {HTMLElement} */
const twoPlayerBtn = document.getElementById("twoPlayerBtn");
/** @type {HTMLElement} */
const backToTitleBtn = document.getElementById("backToTitleBtn");
/** @type {HTMLElement} */
const gameInstructions = document.getElementById("gameInstructions");

/**
 * タイトル画面を表示する
 */
function showTitleScreen() {
  window.gameState = 'title';
  titleScreen.style.display = 'block';
  gameScreen.style.display = 'none';
  window.gameRunning = false;
}

/**
 * ゲーム画面を表示し、ゲームを開始する
 * @param {number} players - プレイヤー数 (1 または 2)
 */
function startGame(players) {
  window.playerCount = players;
  window.gameState = 'playing';
  titleScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  
  // プレイヤー数に応じて操作説明を更新
  if (window.playerCount === 1) {
    gameInstructions.textContent = "矢印キーで操作 | Spaceキーでリスタート";
  } else {
    gameInstructions.textContent = "プレイヤー1: 矢印キー (緑) | プレイヤー2: WASD (青) | Spaceキーでリスタート";
  }
  
  window.resetGame();
}

// ボタンイベントリスナーを追加
onePlayerBtn.addEventListener('click', () => startGame(1));
twoPlayerBtn.addEventListener('click', () => startGame(2));
backToTitleBtn.addEventListener('click', showTitleScreen);

// グローバルにアクセス可能にする
window.showTitleScreen = showTitleScreen;
window.startGame = startGame;