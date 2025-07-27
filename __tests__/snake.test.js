import { describe, it, expect, beforeEach } from 'vitest';
import {
  isWithinBounds,
  checkSelfCollision,
  checkSnakeCollision,
  checkFoodCollision,
  moveSnake,
  isPositionOccupiedBySnakes,
  generateRandomPosition,
} from '../scripts/snake.js';

describe('snake.js', () => {
  describe('isWithinBounds', () => {
    it('境界内の位置でtrueを返す', () => {
      expect(isWithinBounds({ x: 0, y: 0 })).toBe(true);
      expect(isWithinBounds({ x: 10, y: 10 })).toBe(true);
      expect(isWithinBounds({ x: 29, y: 29 })).toBe(true);
    });

    it('境界外の位置でfalseを返す', () => {
      expect(isWithinBounds({ x: -1, y: 0 })).toBe(false);
      expect(isWithinBounds({ x: 0, y: -1 })).toBe(false);
      expect(isWithinBounds({ x: 30, y: 0 })).toBe(false);
      expect(isWithinBounds({ x: 0, y: 30 })).toBe(false);
      expect(isWithinBounds({ x: -1, y: -1 })).toBe(false);
      expect(isWithinBounds({ x: 30, y: 30 })).toBe(false);
    });
  });

  describe('checkSelfCollision', () => {
    it('自己衝突がない場合はfalseを返す', () => {
      const head = { x: 5, y: 5 };
      const snake = [
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 2, y: 5 },
      ];
      expect(checkSelfCollision(head, snake)).toBe(false);
    });

    it('自己衝突がある場合はtrueを返す', () => {
      const head = { x: 3, y: 5 };
      const snake = [
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 2, y: 5 },
      ];
      expect(checkSelfCollision(head, snake)).toBe(true);
    });

    it('空のスネークの場合はfalseを返す', () => {
      const head = { x: 5, y: 5 };
      const snake = [];
      expect(checkSelfCollision(head, snake)).toBe(false);
    });

    it('単一セグメントスネークの場合は適切に処理する', () => {
      const head = { x: 5, y: 5 };
      const snake = [{ x: 4, y: 5 }];
      expect(checkSelfCollision(head, snake)).toBe(false);
      
      const snake2 = [{ x: 5, y: 5 }];
      expect(checkSelfCollision(head, snake2)).toBe(true);
    });
  });

  describe('checkSnakeCollision', () => {
    it('他のスネークとの衝突がない場合はfalseを返す', () => {
      const head = { x: 5, y: 5 };
      const otherSnake = [
        { x: 10, y: 10 },
        { x: 11, y: 10 },
        { x: 12, y: 10 },
      ];
      expect(checkSnakeCollision(head, otherSnake)).toBe(false);
    });

    it('他のスネークとの衝突がある場合はtrueを返す', () => {
      const head = { x: 10, y: 10 };
      const otherSnake = [
        { x: 10, y: 10 },
        { x: 11, y: 10 },
        { x: 12, y: 10 },
      ];
      expect(checkSnakeCollision(head, otherSnake)).toBe(true);
    });

    it('空の他のスネークの場合はfalseを返す', () => {
      const head = { x: 5, y: 5 };
      const otherSnake = [];
      expect(checkSnakeCollision(head, otherSnake)).toBe(false);
    });
  });

  describe('checkFoodCollision', () => {
    it('食べ物との衝突がない場合は適切なオブジェクトを返す', () => {
      const head = { x: 5, y: 5 };
      const foods = [
        { x: 10, y: 10 },
        { x: 15, y: 15 },
      ];
      const result = checkFoodCollision(head, foods);
      expect(result).toEqual({ collision: false, foodIndex: -1 });
    });

    it('食べ物との衝突がある場合は適切なオブジェクトを返す', () => {
      const head = { x: 10, y: 10 };
      const foods = [
        { x: 5, y: 5 },
        { x: 10, y: 10 },
        { x: 15, y: 15 },
      ];
      const result = checkFoodCollision(head, foods);
      expect(result).toEqual({ collision: true, foodIndex: 1 });
    });

    it('最初の食べ物との衝突を検出する', () => {
      const head = { x: 5, y: 5 };
      const foods = [
        { x: 5, y: 5 },
        { x: 5, y: 5 },
      ];
      const result = checkFoodCollision(head, foods);
      expect(result).toEqual({ collision: true, foodIndex: 0 });
    });

    it('空の食べ物配列の場合は適切に処理する', () => {
      const head = { x: 5, y: 5 };
      const foods = [];
      const result = checkFoodCollision(head, foods);
      expect(result).toEqual({ collision: false, foodIndex: -1 });
    });
  });

  describe('moveSnake', () => {
    let snake;
    let shadowTrail;

    beforeEach(() => {
      snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
      ];
      shadowTrail = [];
    });

    it('食べ物を食べていない場合、スネークを移動させて尻尾を削除する', () => {
      const result = moveSnake(snake, 1, 0, false, shadowTrail);
      
      expect(result.newHead).toEqual({ x: 6, y: 5 });
      expect(result.tail).toEqual({ x: 3, y: 5 });
      expect(snake).toEqual([
        { x: 6, y: 5 },
        { x: 5, y: 5 },
        { x: 4, y: 5 },
      ]);
      expect(shadowTrail).toEqual([{ x: 3, y: 5 }]);
    });

    it('食べ物を食べた場合、スネークを移動させて尻尾を削除しない', () => {
      const result = moveSnake(snake, 0, -1, true, shadowTrail);
      
      expect(result.newHead).toEqual({ x: 5, y: 4 });
      expect(result.tail).toBe(null);
      expect(snake).toEqual([
        { x: 5, y: 4 },
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
      ]);
      expect(shadowTrail).toEqual([]);
    });

    it('影の軌跡が最大長を超える場合、古い軌跡を削除する', () => {
      shadowTrail = Array.from({ length: 10 }, (_, i) => ({ x: i, y: 0 }));
      
      moveSnake(snake, -1, 0, false, shadowTrail);
      
      expect(shadowTrail.length).toBe(10);
      expect(shadowTrail[0]).toEqual({ x: 3, y: 5 });
      expect(shadowTrail[shadowTrail.length - 1]).toEqual({ x: 8, y: 0 });
    });

    it('単一セグメントスネークでも適切に動作する', () => {
      snake = [{ x: 0, y: 0 }];
      const result = moveSnake(snake, 1, 1, false, shadowTrail);
      
      expect(result.newHead).toEqual({ x: 1, y: 1 });
      expect(result.tail).toEqual({ x: 0, y: 0 });
      expect(snake).toEqual([{ x: 1, y: 1 }]);
    });
  });

  describe('isPositionOccupiedBySnakes', () => {
    const snake1 = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    const snake2 = [
      { x: 10, y: 10 },
      { x: 11, y: 10 },
      { x: 12, y: 10 },
    ];

    it('どちらのスネークとも重ならない位置でfalseを返す', () => {
      const position = { x: 0, y: 0 };
      expect(isPositionOccupiedBySnakes(position, snake1, snake2)).toBe(false);
    });

    it('スネーク1と重なる位置でtrueを返す', () => {
      const position = { x: 5, y: 5 };
      expect(isPositionOccupiedBySnakes(position, snake1, snake2)).toBe(true);
    });

    it('スネーク2と重なる位置でtrueを返す', () => {
      const position = { x: 10, y: 10 };
      expect(isPositionOccupiedBySnakes(position, snake1, snake2)).toBe(true);
    });

    it('空のスネークでも適切に処理する', () => {
      const position = { x: 5, y: 5 };
      expect(isPositionOccupiedBySnakes(position, [], [])).toBe(false);
      expect(isPositionOccupiedBySnakes(position, snake1, [])).toBe(true);
      expect(isPositionOccupiedBySnakes(position, [], snake2)).toBe(false);
    });
  });

  describe('generateRandomPosition', () => {
    it('有効な範囲内の位置を生成する', () => {
      for (let i = 0; i < 100; i++) {
        const position = generateRandomPosition();
        expect(position.x).toBeGreaterThanOrEqual(0);
        expect(position.x).toBeLessThan(30);
        expect(position.y).toBeGreaterThanOrEqual(0);
        expect(position.y).toBeLessThan(30);
        expect(Number.isInteger(position.x)).toBe(true);
        expect(Number.isInteger(position.y)).toBe(true);
      }
    });

    it('xとyの両方のプロパティを持つオブジェクトを返す', () => {
      const position = generateRandomPosition();
      expect(position).toHaveProperty('x');
      expect(position).toHaveProperty('y');
      expect(typeof position.x).toBe('number');
      expect(typeof position.y).toBe('number');
    });
  });
});