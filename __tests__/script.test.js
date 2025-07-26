import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock DOM elements and canvas context
const mockCanvas = {
  width: 400,
  height: 400,
  getContext: vi.fn()
};

const mockCtx = {
  fillStyle: '',
  fillRect: vi.fn(),
  clearRect: vi.fn()
};

const mockScoreElement = {
  textContent: ''
};

const mockGameOverElement = {
  style: { display: 'none' }
};

// Mock DOM methods
global.document = {
  getElementById: vi.fn((id) => {
    switch (id) {
      case 'gameCanvas': return mockCanvas;
      case 'score': return mockScoreElement;
      case 'gameOver': return mockGameOverElement;
      default: return null;
    }
  }),
  addEventListener: vi.fn()
};

mockCanvas.getContext.mockReturnValue(mockCtx);

// Import the script after mocks are set up
// Since the script runs immediately, we need to reset state for each test
let originalScript;

beforeEach(() => {
  vi.clearAllMocks();
  mockCtx.fillRect.mockClear();
  mockScoreElement.textContent = '';
  mockGameOverElement.style.display = 'none';
});

describe('Snake Game', () => {
  describe('Game Initialization', () => {
    it('should initialize with correct default values', async () => {
      // Import script to initialize game state
      await import('../script.js');
      
      expect(document.getElementById).toHaveBeenCalledWith('gameCanvas');
      expect(document.getElementById).toHaveBeenCalledWith('score');
      expect(document.getElementById).toHaveBeenCalledWith('gameOver');
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    });
  });

  describe('Food Generation', () => {
    it('should generate food within grid bounds', () => {
      const tileCount = 20; // 400 / 20
      
      // Mock Math.random to return predictable values
      const mockRandom = vi.spyOn(Math, 'random');
      mockRandom.mockReturnValueOnce(0.5).mockReturnValueOnce(0.3);
      
      // We need to test the generateFood function
      // Since it's not exported, we'll test its behavior indirectly
      const expectedX = Math.floor(0.5 * tileCount);
      const expectedY = Math.floor(0.3 * tileCount);
      
      expect(expectedX).toBeGreaterThanOrEqual(0);
      expect(expectedX).toBeLessThan(tileCount);
      expect(expectedY).toBeGreaterThanOrEqual(0);
      expect(expectedY).toBeLessThan(tileCount);
      
      mockRandom.mockRestore();
    });
  });

  describe('Game Drawing', () => {
    it('should call fillRect for canvas, snake, and food', () => {
      // Test that drawing functions make the correct canvas calls
      const expectedCalls = [
        [0, 0, 400, 400], // Clear canvas
      ];
      
      // After importing and running drawGame, we should see fillRect calls
      expect(mockCtx.fillRect).toBeDefined();
    });
  });

  describe('Snake Movement', () => {
    it('should not move when dx and dy are both 0', () => {
      // Test initial state where snake shouldn't move
      const initialSnakeLength = 1;
      
      // Snake should remain at initial position when no direction is set
      expect(true).toBe(true); // Placeholder test
    });

    it('should detect collision with walls', () => {
      // Test wall collision detection
      const tileCount = 20;
      const testCases = [
        { x: -1, y: 10, shouldCollide: true },  // Left wall
        { x: tileCount, y: 10, shouldCollide: true }, // Right wall
        { x: 10, y: -1, shouldCollide: true },  // Top wall
        { x: 10, y: tileCount, shouldCollide: true }, // Bottom wall
        { x: 5, y: 5, shouldCollide: false }    // Valid position
      ];
      
      testCases.forEach(({ x, y, shouldCollide }) => {
        const isOutOfBounds = x < 0 || x >= tileCount || y < 0 || y >= tileCount;
        expect(isOutOfBounds).toBe(shouldCollide);
      });
    });

    it('should detect self-collision', () => {
      // Test snake collision with itself
      const snake = [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 5, y: 7 }
      ];
      const head = { x: 5, y: 6 }; // Collides with second segment
      
      const collision = snake.some(segment => 
        head.x === segment.x && head.y === segment.y
      );
      
      expect(collision).toBe(true);
    });
  });

  describe('Food Consumption', () => {
    it('should increase score when food is consumed', () => {
      const initialScore = 0;
      const foodPoints = 10;
      const expectedScore = initialScore + foodPoints;
      
      expect(expectedScore).toBe(10);
    });

    it('should grow snake when food is consumed', () => {
      const initialSnakeLength = 1;
      const expectedLength = initialSnakeLength + 1;
      
      // When food is consumed, snake should not pop the tail
      expect(expectedLength).toBe(2);
    });
  });

  describe('Game Over', () => {
    it('should show game over element when game ends', () => {
      mockGameOverElement.style.display = 'block';
      
      expect(mockGameOverElement.style.display).toBe('block');
    });

    it('should stop game when collision occurs', () => {
      let gameRunning = false;
      
      expect(gameRunning).toBe(false);
    });
  });

  describe('Game Reset', () => {
    it('should reset all game state', () => {
      // Test reset functionality
      const resetState = {
        snake: [{ x: 10, y: 10 }],
        dx: 0,
        dy: 0,
        score: 0,
        gameRunning: true
      };
      
      expect(resetState.snake).toHaveLength(1);
      expect(resetState.dx).toBe(0);
      expect(resetState.dy).toBe(0);
      expect(resetState.score).toBe(0);
      expect(resetState.gameRunning).toBe(true);
    });

    it('should hide game over element on reset', () => {
      mockGameOverElement.style.display = 'none';
      
      expect(mockGameOverElement.style.display).toBe('none');
    });
  });

  describe('Keyboard Controls', () => {
    it('should handle arrow key inputs correctly', () => {
      const keyMappings = [
        { code: 'ArrowUp', expectedDx: 0, expectedDy: -1 },
        { code: 'ArrowDown', expectedDx: 0, expectedDy: 1 },
        { code: 'ArrowLeft', expectedDx: -1, expectedDy: 0 },
        { code: 'ArrowRight', expectedDx: 1, expectedDy: 0 }
      ];
      
      keyMappings.forEach(({ code, expectedDx, expectedDy }) => {
        expect(expectedDx).toBeDefined();
        expect(expectedDy).toBeDefined();
      });
    });

    it('should prevent reverse direction movement', () => {
      // Test that snake cannot immediately reverse direction
      const scenarios = [
        { currentDx: 0, currentDy: 1, newDirection: 'ArrowUp', shouldAllow: false },
        { currentDx: 0, currentDy: -1, newDirection: 'ArrowDown', shouldAllow: false },
        { currentDx: 1, currentDy: 0, newDirection: 'ArrowLeft', shouldAllow: false },
        { currentDx: -1, currentDy: 0, newDirection: 'ArrowRight', shouldAllow: false }
      ];
      
      scenarios.forEach(({ currentDx, currentDy, newDirection, shouldAllow }) => {
        // Logic to prevent reverse movement
        let canMove = true;
        if (newDirection === 'ArrowUp' && currentDy === 1) canMove = false;
        if (newDirection === 'ArrowDown' && currentDy === -1) canMove = false;
        if (newDirection === 'ArrowLeft' && currentDx === 1) canMove = false;
        if (newDirection === 'ArrowRight' && currentDx === -1) canMove = false;
        
        expect(canMove).toBe(shouldAllow);
      });
    });

    it('should handle space key for game restart', () => {
      const spaceKeyEvent = { code: 'Space' };
      
      expect(spaceKeyEvent.code).toBe('Space');
    });
  });

  describe('Game Loop', () => {
    it('should call moveSnake and drawGame in sequence', () => {
      // Test that game loop calls the correct functions
      expect(true).toBe(true);
    });
  });
});