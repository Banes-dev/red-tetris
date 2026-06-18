import Game from './Game';
import Player from './Player';

describe('Game class', () => {
  test('should create a game with players', () => {
    const player1 = new Player('player1', 'socket1');
    const player2 = new Player('player2', 'socket2');

    const game = new Game({
      id: 'room1',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });
    game.addPlayer(player1);
    game.addPlayer(player2);

    expect(game.id).toBe('room1');
    expect(game.players.length).toBe(2);
    // Note: leader might not be set automatically, so we check players instead
    expect(game.players[0]).toBe(player1);
    expect(game.players[1]).toBe(player2);
  });

  test('should remove player from game', () => {
    const player1 = new Player('player1', 'socket1');
    const player2 = new Player('player2', 'socket2');

    const game = new Game({
      id: 'room1',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });
    game.addPlayer(player1);
    game.addPlayer(player2);

    game.removePlayer('player2');
    expect(game.players.length).toBe(1);
    expect(game.players[0].id).toBe('player1');
  });

  test('should handle removePlayer when player not found', () => {
    const player1 = new Player('player1', 'socket1');

    const game = new Game({
      id: 'room1',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });
    game.addPlayer(player1);

    // Try to remove a player that doesn't exist
    game.removePlayer('nonexistent');
    expect(game.players.length).toBe(1); // Player should still be there
    expect(game.players[0].id).toBe('player1');
  });

  test('should get next pieces', () => {
    const game = new Game({
      id: 'room1',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Fill the queue first
    game.fillQueue();

    const pieces = game.getNextPieces(5);
    expect(pieces).toBeDefined();
    expect(pieces.length).toBe(5);
    // Just check that pieces is an array
    expect(Array.isArray(pieces)).toBe(true);
  });

  test('should fill queue with pieces', () => {
    const game = new Game({
      id: 'room1',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Queue should be empty initially
    expect(game.pieceQueue.length).toBe(0);

    // Fill the queue
    game.fillQueue();

    // Queue should have pieces now
    expect(game.pieceQueue.length).toBeGreaterThan(0);
  });

  test('should initialize game with correct properties', () => {
    const game = new Game({
      id: 'room1',
      gravityLevel: 2,
      invisiblePieces: true,
      timeLimit: 60,
      playerLimit: 2,
      isPrivate: true,
      password: 'secret'
    });

    expect(game.id).toBe('room1');
    expect(game.gravityLevel).toBe(2);
    expect(game.invisiblePieces).toBe(true);
    expect(game.timeLimit).toBe(60);
    expect(game.playerLimit).toBe(2);
    expect(game.isPrivate).toBe(true);
    expect(game.password).toBe('secret');
    expect(game.status).toBe('waiting');
    expect(game.players).toEqual([]);
    expect(game.leader).toBeNull();
  });
});
