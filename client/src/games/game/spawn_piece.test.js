import { spawnPiece } from './spawn_piece';

describe('Spawn piece function', () => {
  test('should spawn I piece', () => {
    const piece = spawnPiece('I');
    expect(piece.type).toBe('I');
    expect(piece.shape).toBeDefined();
    expect(piece.x).toBe(3);
    expect(piece.y).toBe(0);
  });

  test('should spawn O piece', () => {
    const piece = spawnPiece('O');
    expect(piece.type).toBe('O');
    expect(piece.shape).toBeDefined();
    expect(piece.x).toBe(3);  // Corrected expected x position
    expect(piece.y).toBe(0);
  });
});