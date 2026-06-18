import { hasCollision } from './collisions';

describe('Collision detection', () => {
  test('should detect collision with bottom', () => {
    const piece = {
      type: 'I',
      shape: [[1, 1, 1, 1]],
      x: 3,
      y: 19  // At bottom
    };

    const board = Array(20).fill().map(() => Array(10).fill(0));

    expect(hasCollision(board, piece, piece.x, piece.y + 1)).toBe(true);
  });

  test('should detect collision with other pieces', () => {
    const piece = {
      type: 'I',
      shape: [[1, 1, 1, 1]],
      x: 3,
      y: 10
    };

    const board = Array(20).fill().map(() => Array(10).fill(0));
    // Add some pieces at the bottom
    board[19] = Array(10).fill(1);

    expect(hasCollision(board, piece, piece.x, piece.y + 9)).toBe(true);
  });

  test('should not detect collision in empty space', () => {
    const piece = {
      type: 'I',
      shape: [[1, 1, 1, 1]],
      x: 3,
      y: 10
    };

    const board = Array(20).fill().map(() => Array(10).fill(0));

    expect(hasCollision(board, piece, piece.x, piece.y + 1)).toBe(false);
  });
});