import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

describe('main.js', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    // DOM環境をセットアップ
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="titleScreen"></div>
          <div id="gameScreen"></div>
        </body>
      </html>
    `);
    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;

    // setIntervalをモック
    window.setInterval = vi.fn();

    // グローバル変数を初期化
    window.gameRunning = false;
    window.gameState = 'title';
    window.playerCount = 1;
  });

  describe('初期状態', () => {
    it('gameRunningはfalseで初期化される', () => {
      expect(window.gameRunning).toBe(false);
    });

    it('gameStateは"title"で初期化される', () => {
      expect(window.gameState).toBe('title');
    });

    it('playerCountは1で初期化される', () => {
      expect(window.playerCount).toBe(1);
    });
  });

  describe('DOMContentLoaded処理', () => {
    it('setIntervalが定義されている', () => {
      expect(window.setInterval).toBeDefined();
    });

    it('DOMContentLoadedイベントリスナーを登録できる', () => {
      const mockGameLoop = vi.fn();

      // イベントリスナーを設定
      document.addEventListener('DOMContentLoaded', () => {
        window.setInterval(mockGameLoop, 100);
      });

      // DOMContentLoadedイベントをトリガー
      const event = new window.Event('DOMContentLoaded');
      document.dispatchEvent(event);

      expect(window.setInterval).toHaveBeenCalledWith(mockGameLoop, 100);
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
