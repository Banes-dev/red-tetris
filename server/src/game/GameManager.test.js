import GameManager from './GameManager';
import { Game } from './Game';
import Player from './Player';

jest.mock('./Game');

describe('GameManager class', () => {
  test('should add and manage players', () => {
    const manager = new GameManager();

    manager.addPlayer('player1');
    manager.addPlayer('player2');

    expect(manager.players.size).toBe(2);
    expect(manager.players.has('player1')).toBe(true);
    expect(manager.players.has('player2')).toBe(true);
  });

  test('should handle player input', () => {
    const manager = new GameManager();

    manager.addPlayer('player1');

    // Test that handleInput doesn't throw errors
    expect(() => manager.handleInput('player1', {type: 'move', direction: 'left'})).not.toThrow();
    expect(() => manager.handleInput('unknown', {type: 'move', direction: 'left'})).not.toThrow();
  });
});