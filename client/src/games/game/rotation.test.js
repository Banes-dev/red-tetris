import { rotatePiece } from './rotation';

describe('Rotation functions', () => {
  test('should rotate I piece', () => {
    const piece = {
      type: 'I',
      shape: [[1, 1, 1, 1]],
      x: 3,
      y: 0
    };

    const board = Array(20).fill().map(() => Array(10).fill(0));

    const rotated = rotatePiece(board, piece);
    expect(rotated.shape.length).toBe(1);
    expect(rotated.shape[0].length).toBe(4);
  });

  test('should rotate O piece (no change)', () => {
    const piece = {
      type: 'O',
      shape: [[1, 1], [1, 1]],
      x: 3,
      y: 0
    };

    const board = Array(20).fill().map(() => Array(10).fill(0));

    const rotated = rotatePiece(board, piece);
    expect(rotated.shape).toEqual(piece.shape);
  });
});