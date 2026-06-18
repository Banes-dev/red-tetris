import { PIECES } from './pieces';

describe('Pieces configuration', () => {
  test('PIECES should be defined', () => {
    expect(PIECES).toBeDefined();
    expect(typeof PIECES).toBe('object');
  });

  test('Each piece should have rotations', () => {
    Object.keys(PIECES).forEach(pieceType => {
      const rotations = PIECES[pieceType];
      expect(Array.isArray(rotations)).toBe(true);
      expect(rotations.length).toBeGreaterThan(0);
    });
  });
});