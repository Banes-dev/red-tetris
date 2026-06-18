import { createBoard } from './board';

describe('Board functions', () => {
  test('createBoard should create a 20x10 board', () => {
    const board = createBoard();
    expect(board.length).toBe(20);
    expect(board[0].length).toBe(10);
    // All cells should be empty (0)
    expect(board.flat().every(cell => cell === 0)).toBe(true);
  });
});