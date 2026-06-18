import { clearLines } from './clear_lines';

describe('Clear lines function', () => {
  test('should clear completed lines', () => {
    const board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Complete line
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Complete line
      ...Array(16).fill().map(() => Array(10).fill(0))
    ];

    const result = clearLines(board, 0);
    expect(result.cleared).toBe(2);
    // Check that completed lines are cleared
    expect(result.board[1].every(cell => cell === 0)).toBe(true);
    // After clearing lines 1 and 3, the board shifts down
    // So line 3 should now contain what was in line 2
    expect(result.board[3][1]).toBe(1);
    expect(result.board[3][3]).toBe(1);
    expect(result.board[3][5]).toBe(1);
    expect(result.board[3][7]).toBe(1);
    expect(result.board[3][9]).toBe(1);
  });

  test('should return 0 when no lines to clear', () => {
    const board = Array(20).fill().map(() => Array(10).fill(0));
    const result = clearLines(board, 0);
    expect(result.cleared).toBe(0);
  });
});