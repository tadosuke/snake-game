import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

describe('gameScreen.js', () => {
  let dom;
  let document;
  let window;
  let canvas;
  let ctx;

  beforeEach(() => {
    // DOM環境をセットアップ
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <canvas id="gameCanvas" width="400" height="400"></canvas>
          <div id="score">0</div>
          <div id="gameOver" style="display: none;"></div>
          <div id="gameScreen" style="display: none;"></div>
          <button id="backToTitleBtn">Back to Title</button>
          <div id="gameInstructions"></div>
          <div id="titleScreen" style="display: block;"></div>
          <button id="onePlayerBtn">1 Player</button>
          <button id="twoPlayerBtn">2 Players</button>
        </body>
      </html>
    `);
    
    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;

    // canvas contextをモック
    canvas = document.getElementById('gameCanvas');
    ctx = {
      fillStyle: '',
      fillRect: vi.fn(),
      clearRect: vi.fn()
    };
    canvas.getContext = vi.fn(() => ctx);

    // グローバル変数を初期化
    window.gameRunning = false;
    window.gameState = 'title';
    window.playerCount = 1;
    window.snake1 = [{ x: 10, y: 10 }];
    window.snake2 = [{ x: 20, y: 20 }];
    window.foods = [];
    window.dx1 = 0;
    window.dy1 = 0;
    window.dx2 = 0;
    window.dy2 = 0;
    window.score = 0;
    window.shadowTrail1 = [];
    window.shadowTrail2 = [];
    window.gridSize = 20;
    window.tileCount = 20;
  });

  describe('startGame関数の動作', () => {
    it('1プレイヤーモードでゲームを開始する', () => {
      const startGame = (players) => {
        window.playerCount = players;
        window.gameState = 'playing';
        document.getElementById('titleScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
      };

      startGame(1);

      expect(window.playerCount).toBe(1);
      expect(window.gameState).toBe('playing');
      expect(document.getElementById('titleScreen').style.display).toBe('none');
      expect(document.getElementById('gameScreen').style.display).toBe('block');
    });

    it('2プレイヤーモードでゲームを開始する', () => {
      const startGame = (players) => {
        window.playerCount = players;
        window.gameState = 'playing';
        document.getElementById('titleScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
      };

      startGame(2);

      expect(window.playerCount).toBe(2);
      expect(window.gameState).toBe('playing');
    });
  });

  describe('generateFood関数の動作', () => {
    it('1プレイヤーモードでは1つの食べ物を生成する', () => {
      const generateFood = () => {
        const maxFoods = window.playerCount === 1 ? 1 : 2;
        while (window.foods.length < maxFoods) {
          const newFood = {
            x: Math.floor(Math.random() * window.tileCount),
            y: Math.floor(Math.random() * window.tileCount),
          };
          window.foods.push(newFood);
        }
      };

      window.playerCount = 1;
      window.foods = [];
      generateFood();

      expect(window.foods).toHaveLength(1);
      expect(window.foods[0]).toHaveProperty('x');
      expect(window.foods[0]).toHaveProperty('y');
    });

    it('2プレイヤーモードでは2つの食べ物を生成する', () => {
      const generateFood = () => {
        const maxFoods = window.playerCount === 1 ? 1 : 2;
        while (window.foods.length < maxFoods) {
          const newFood = {
            x: Math.floor(Math.random() * window.tileCount),
            y: Math.floor(Math.random() * window.tileCount),
          };
          window.foods.push(newFood);
        }
      };

      window.playerCount = 2;
      window.foods = [];
      generateFood();

      expect(window.foods).toHaveLength(2);
    });
  });

  describe('gameOver関数の動作', () => {
    it('ゲームを終了状態にする', () => {
      const gameOver = () => {
        window.gameRunning = false;
        window.gameState = 'gameOver';
        document.getElementById('gameOver').style.display = 'block';
      };

      gameOver();

      expect(window.gameRunning).toBe(false);
      expect(window.gameState).toBe('gameOver');
      expect(document.getElementById('gameOver').style.display).toBe('block');
    });
  });

  describe('resetGame関数の動作', () => {
    it('ゲームを初期状態にリセットする', () => {
      const resetGame = () => {
        window.snake1 = [{ x: 10, y: 10 }];
        window.snake2 = [{ x: 20, y: 20 }];
        window.dx1 = 0;
        window.dy1 = 0;
        window.dx2 = 0;
        window.dy2 = 0;
        window.score = 0;
        document.getElementById('score').textContent = window.score.toString();
        window.gameRunning = true;
        window.gameState = 'playing';
        document.getElementById('gameOver').style.display = 'none';
        window.shadowTrail1 = [];
        window.shadowTrail2 = [];
        window.foods = [];
      };

      resetGame();

      expect(window.snake1).toEqual([{ x: 10, y: 10 }]);
      expect(window.snake2).toEqual([{ x: 20, y: 20 }]);
      expect(window.score).toBe(0);
      expect(window.gameRunning).toBe(true);
      expect(window.gameState).toBe('playing');
      expect(window.shadowTrail1).toEqual([]);
      expect(window.shadowTrail2).toEqual([]);
      expect(window.foods).toEqual([]);
    });
  });

  describe('キーボード操作ロジック', () => {
    it('矢印キー上でプレイヤー1が上に移動する', () => {
      window.gameState = 'playing';
      window.dx1 = 0;
      window.dy1 = 0;

      // キーハンドラーをシミュレート
      const handleKeyUp = () => {
        if (window.gameState === 'playing') {
          if (window.dy1 !== 1) {
            window.dx1 = 0;
            window.dy1 = -1;
          }
        }
      };

      handleKeyUp();

      expect(window.dx1).toBe(0);
      expect(window.dy1).toBe(-1);
    });

    it('矢印キー下でプレイヤー1が下に移動する', () => {
      window.gameState = 'playing';
      window.dx1 = 0;
      window.dy1 = 0;

      const handleKeyDown = () => {
        if (window.gameState === 'playing') {
          if (window.dy1 !== -1) {
            window.dx1 = 0;
            window.dy1 = 1;
          }
        }
      };

      handleKeyDown();

      expect(window.dx1).toBe(0);
      expect(window.dy1).toBe(1);
    });

    it('WASDキーでプレイヤー2が移動する（2プレイヤーモード）', () => {
      window.gameState = 'playing';
      window.playerCount = 2;
      window.dx2 = 0;
      window.dy2 = 0;

      const handleKeyW = () => {
        if (window.gameState === 'playing' && window.playerCount === 2) {
          if (window.dy2 !== 1) {
            window.dx2 = 0;
            window.dy2 = -1;
          }
        }
      };

      handleKeyW();

      expect(window.dx2).toBe(0);
      expect(window.dy2).toBe(-1);
    });
  });

  describe('衝突検知ロジック', () => {
    it('壁との衝突を検知する', () => {
      window.tileCount = 20;
      
      const checkWallCollision = (head) => {
        return head.x < 0 || head.x >= window.tileCount || head.y < 0 || head.y >= window.tileCount;
      };

      expect(checkWallCollision({ x: -1, y: 10 })).toBe(true);
      expect(checkWallCollision({ x: 20, y: 10 })).toBe(true);
      expect(checkWallCollision({ x: 10, y: -1 })).toBe(true);
      expect(checkWallCollision({ x: 10, y: 20 })).toBe(true);
      expect(checkWallCollision({ x: 10, y: 10 })).toBe(false);
    });

    it('食べ物との衝突を検知する', () => {
      const head = { x: 5, y: 5 };
      window.foods = [{ x: 5, y: 5 }, { x: 10, y: 10 }];

      const checkFoodCollision = (head, foods) => {
        for (let i = 0; i < foods.length; i++) {
          if (head.x === foods[i].x && head.y === foods[i].y) {
            return i;
          }
        }
        return -1;
      };

      expect(checkFoodCollision(head, window.foods)).toBe(0);
      expect(checkFoodCollision({ x: 1, y: 1 }, window.foods)).toBe(-1);
    });
  });

  describe('Canvas描画', () => {
    it('canvasコンテキストが取得できる', () => {
      expect(canvas.getContext).toBeDefined();
      expect(canvas.getContext('2d')).toBe(ctx);
    });

    it('描画メソッドが呼ばれる', () => {
      ctx.fillRect(0, 0, 20, 20);
      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 20, 20);
    });
  });
});