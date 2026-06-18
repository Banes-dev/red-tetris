import { addBlockedLines } from './blocked_lines';

describe('Blocked lines functions', () => {
  test('should add blocked lines to board', () => {
    const board = Array(20).fill().map(() => Array(10).fill(0));

    const result = addBlockedLines(board, 2);
    expect(result.length).toBe(20);

    // Check that the last 2 lines are blocked (value 2)
    expect(result[18].every(cell => cell === 2)).toBe(true);
    expect(result[19].every(cell => cell === 2)).toBe(true);

    // Check that other lines are empty
    for (let i = 0; i < 18; i++) {
      expect(result[i].every(cell => cell === 0)).toBe(true);
    }
  });

  test('should handle more lines than board height', () => {
    const board = Array(20).fill().map(() => Array(10).fill(0));

    const result = addBlockedLines(board, 25);
    expect(result.length).toBe(25);  // Board grows to accommodate lines

    // Last 20 lines should be blocked
    for (let i = 5; i < 25; i++) {
      expect(result[i].every(cell => cell === 2)).toBe(true);
    }
  });
});