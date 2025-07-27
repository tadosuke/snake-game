import { describe, it, expect, beforeEach } from "vitest";
import {
  getGameState,
  resetGameState,
  setPlayer1Direction,
  setPlayer2Direction,
  generateFood,
  moveSnake1,
  moveSnake2,
} from "../scripts/gameState.js";

describe("gameState.js", () => {
  beforeEach(() => {
    resetGameState();
  });

  describe("基本機能", () => {
    it("初期状態が正しく設定される", () => {
      const state = getGameState();

      expect(state.snake1).toEqual([{ x: 10, y: 10 }]);
      expect(state.snake2).toEqual([{ x: 20, y: 20 }]);
      expect(state.foods).toEqual([]);
      expect(state.dx1).toBe(0);
      expect(state.dy1).toBe(0);
      expect(state.dx2).toBe(0);
      expect(state.dy2).toBe(0);
      expect(state.score).toBe(0);
    });

    it("プレイヤー1の方向を設定できる", () => {
      setPlayer1Direction(1, 0);
      const state = getGameState();

      expect(state.dx1).toBe(1);
      expect(state.dy1).toBe(0);
    });

    it("プレイヤー2の方向を設定できる", () => {
      setPlayer2Direction(0, -1);
      const state = getGameState();

      expect(state.dx2).toBe(0);
      expect(state.dy2).toBe(-1);
    });

    it("食べ物を生成できる", () => {
      generateFood(1);
      const state = getGameState();

      expect(state.foods).toHaveLength(1);
      expect(state.foods[0]).toHaveProperty("x");
      expect(state.foods[0]).toHaveProperty("y");
    });

    it("スネークが移動する", () => {
      setPlayer1Direction(1, 0);
      const result = moveSnake1(1, true);
      const state = getGameState();

      expect(result.collision).toBe(false);
      expect(state.snake1[0]).toEqual({ x: 11, y: 10 });
    });
  });
});
