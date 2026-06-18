import { lockPiece } from './lock_piece';

describe('Lock piece function', () => {
  test('should lock piece to board', () => {
    const piece = {
      type: 'I',
      shape: [[1, 1, 1, 1]],
      x: 3,
      y: 10
    };

    const board = Array(20).fill().map(() => Array(10).fill(0));

    const newBoard = lockPiece(board, piece);
    expect(newBoard[10][3]).toBe('I');
    expect(newBoard[10][4]).toBe('I');
    expect(newBoard[10][5]).toBe('I');
    expect(newBoard[10][6]).toBe('I');
  });
});