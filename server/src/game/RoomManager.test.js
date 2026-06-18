import RoomManager from './RoomManager';
import Player from './Player';

describe('RoomManager class', () => {
  test('should create and manage rooms', () => {
    const manager = new RoomManager();

    const config = {
      roomName: 'room1',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      roomPassword: ''
    };

    manager.createRoom(config);
    const room = manager.getRoom('room1');

    expect(room).toBeDefined();
    expect(room.id).toBe('room1');
  });

  test('should delete room', () => {
    const manager = new RoomManager();

    const config = {
      roomName: 'room1',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      roomPassword: ''
    };

    manager.createRoom(config);
    manager.deleteRoom('room1');
    expect(manager.getRoom('room1')).toBeUndefined();
  });

  test('should not create room if it already exists', () => {
    const manager = new RoomManager();

    const config = {
      roomName: 'room1',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      roomPassword: ''
    };

    // Create room first time
    const firstRoom = manager.createRoom(config);
    expect(firstRoom).toBeDefined();

    // Try to create same room again
    const secondRoom = manager.createRoom(config);
    expect(secondRoom).toBeNull();
  });

  test('should get rooms list', () => {
    const manager = new RoomManager();

    const config1 = {
      roomName: 'room1',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      roomPassword: ''
    };

    const config2 = {
      roomName: 'room2',
      gravityLevel: 2,
      invisiblePieces: true,
      timeLimit: 60,
      playerLimit: 2,
      isPrivate: true,
      roomPassword: 'secret'
    };

    manager.createRoom(config1);
    manager.createRoom(config2);

    const roomsList = manager.getRoomsList();
    expect(roomsList).toHaveLength(2);

    // Check that rooms list contains correct information
    const room1 = roomsList.find(r => r.id === 'room1');
    const room2 = roomsList.find(r => r.id === 'room2');

    expect(room1).toBeDefined();
    expect(room2).toBeDefined();

    expect(room1.players).toBe(0);
    expect(room1.maxPlayers).toBe(4);
    expect(room1.status).toBe('waiting');
    expect(room1.isPrivate).toBe(false);
    expect(room1.gravity).toBe(1);
    expect(room1.invisible).toBe(false);
    expect(room1.timeLimit).toBe(0);

    expect(room2.players).toBe(0);
    expect(room2.maxPlayers).toBe(2);
    expect(room2.status).toBe('waiting');
    expect(room2.isPrivate).toBe(true);
    expect(room2.gravity).toBe(2);
    expect(room2.invisible).toBe(true);
    expect(room2.timeLimit).toBe(60);
  });

  test('should find game by player', () => {
    const manager = new RoomManager();
    const Player = require('./Player').default;

    const config = {
      roomName: 'room1',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      roomPassword: ''
    };

    manager.createRoom(config);
    const room = manager.getRoom('room1');

    // Add a player to the room
    const player = new Player('player1', 'Player 1');
    room.addPlayer(player);

    // Find game by player ID
    const foundGame = manager.findGameByPlayer('player1');
    expect(foundGame).toBeDefined();
    expect(foundGame.id).toBe('room1');

    // Try to find non-existent player
    const notFoundGame = manager.findGameByPlayer('nonexistent');
    expect(notFoundGame).toBeNull();
  });
});
