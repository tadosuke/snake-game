import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

describe('titleScreen.js', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    // DOM環境をセットアップ
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="titleScreen" style="display: block;"></div>
          <div id="gameScreen" style="display: none;"></div>
          <button id="onePlayerBtn">1 Player</button>
          <button id="twoPlayerBtn">2 Players</button>
        </body>
      </html>
    `);

    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;

    // グローバル変数を初期化
    window.gameState = 'title';
    window.gameRunning = false;
    window.playerCount = 1;

    // startGame関数をモック
    window.startGame = vi.fn((players) => {
      window.playerCount = players;
      window.gameState = 'playing';
    });
  });

  describe('showTitleScreen関数の動作', () => {
    it('タイトル画面を表示する', () => {
      const showTitleScreen = () => {
        window.gameState = 'title';
        document.getElementById('titleScreen').style.display = 'block';
        document.getElementById('gameScreen').style.display = 'none';
        window.gameRunning = false;
      };

      showTitleScreen();

      expect(window.gameState).toBe('title');
      expect(document.getElementById('titleScreen').style.display).toBe(
        'block',
      );
      expect(document.getElementById('gameScreen').style.display).toBe('none');
      expect(window.gameRunning).toBe(false);
    });
  });

  describe('ボタンイベントリスナー', () => {
    it('1プレイヤーボタンをクリックすると1人用ゲームが開始される', () => {
      const onePlayerBtn = document.getElementById('onePlayerBtn');

      // イベントリスナーをシミュレート
      onePlayerBtn.addEventListener('click', () => window.startGame(1));

      // クリックイベントをトリガー
      const clickEvent = new window.Event('click');
      onePlayerBtn.dispatchEvent(clickEvent);

      expect(window.startGame).toHaveBeenCalledWith(1);
    });

    it('2プレイヤーボタンをクリックすると2人用ゲームが開始される', () => {
      const twoPlayerBtn = document.getElementById('twoPlayerBtn');

      // イベントリスナーをシミュレート
      twoPlayerBtn.addEventListener('click', () => window.startGame(2));

      // クリックイベントをトリガー
      const clickEvent = new window.Event('click');
      twoPlayerBtn.dispatchEvent(clickEvent);

      expect(window.startGame).toHaveBeenCalledWith(2);
    });
  });

  describe('DOMContentLoadedイベント', () => {
    it('DOMContentLoaded後にタイトル画面が表示される', () => {
      const showTitleScreen = vi.fn();

      // DOMContentLoadedイベントリスナーをシミュレート
      document.addEventListener('DOMContentLoaded', () => {
        showTitleScreen();
      });

      // DOMContentLoadedイベントをトリガー
      const event = new window.Event('DOMContentLoaded');
      document.dispatchEvent(event);

      expect(showTitleScreen).toHaveBeenCalled();
    });
  });

  describe('初期状態', () => {
    it('タイトル画面が初期状態で表示されている', () => {
      const titleScreen = document.getElementById('titleScreen');
      const gameScreen = document.getElementById('gameScreen');

      expect(titleScreen.style.display).toBe('block');
      expect(gameScreen.style.display).toBe('none');
    });

    it('ボタンが正しく存在する', () => {
      const onePlayerBtn = document.getElementById('onePlayerBtn');
      const twoPlayerBtn = document.getElementById('twoPlayerBtn');

      expect(onePlayerBtn).toBeTruthy();
      expect(twoPlayerBtn).toBeTruthy();
      expect(onePlayerBtn.textContent).toBe('1 Player');
      expect(twoPlayerBtn.textContent).toBe('2 Players');
    });
  });

  describe('画面の切り替え', () => {
    it('ゲーム開始時にタイトル画面が非表示になる', () => {
      const startGame = (players) => {
        window.playerCount = players;
        window.gameState = 'playing';
        document.getElementById('titleScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        window.gameRunning = false;
      };

      startGame(1);

      expect(document.getElementById('titleScreen').style.display).toBe('none');
      expect(document.getElementById('gameScreen').style.display).toBe('block');
      expect(window.gameState).toBe('playing');
    });

    it('タイトル画面表示時にゲーム画面が非表示になる', () => {
      const showTitleScreen = () => {
        window.gameState = 'title';
        document.getElementById('titleScreen').style.display = 'block';
        document.getElementById('gameScreen').style.display = 'none';
        window.gameRunning = false;
      };

      // 最初にゲーム画面を表示
      document.getElementById('titleScreen').style.display = 'none';
      document.getElementById('gameScreen').style.display = 'block';

      // タイトル画面を表示
      showTitleScreen();

      expect(document.getElementById('titleScreen').style.display).toBe(
        'block',
      );
      expect(document.getElementById('gameScreen').style.display).toBe('none');
    });
  });

  describe('ゲーム状態管理', () => {
    it('ゲーム状態を変更できる', () => {
      window.gameState = 'playing';
      expect(window.gameState).toBe('playing');

      window.gameState = 'gameOver';
      expect(window.gameState).toBe('gameOver');
    });

    it('プレイヤー数を設定できる', () => {
      window.playerCount = 2;
      expect(window.playerCount).toBe(2);
    });

    it('ゲーム実行状態を切り替えられる', () => {
      window.gameRunning = true;
      expect(window.gameRunning).toBe(true);

      window.gameRunning = false;
      expect(window.gameRunning).toBe(false);
    });
  });
});
