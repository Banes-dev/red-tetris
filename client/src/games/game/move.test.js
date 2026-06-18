import { movePiece } from './move';

describe('Move functions', () => {
  test('movePiece should move piece down', () => {
    const piece = {
      type: 'I',
      shape: [[1, 1, 1, 1]],
      x: 3,
      y: 0
    };

    const board = Array(20).fill().map(() => Array(10).fill(0));

    const movedPiece = movePiece(board, piece, 0, 1);
    expect(movedPiece.y).toBe(1);
    expect(movedPiece.x).toBe(3);
  });

  test('movePiece should move piece right', () => {
    const piece = {
      type: 'I',
      shape: [[1, 1, 1, 1]],
      x: 3,
      y: 0
    };

    const board = Array(20).fill().map(() => Array(10).fill(0));

    const movedPiece = movePiece(board, piece, 1, 0);
    expect(movedPiece.x).toBe(4);
    expect(movedPiece.y).toBe(0);
  });
});