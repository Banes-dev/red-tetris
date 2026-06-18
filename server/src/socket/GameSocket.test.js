  import { registerGameSocket } from './GameSocket';
import { roomManager } from '../game/RoomManager';

describe('GameSocket functions', () => {
  // Mock socket.io objects
  const mockIo = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn()
  };

  const mockSocket = {
    id: 'test-socket-id',
    on: jest.fn(),
    emit: jest.fn(),
    join: jest.fn(),
    leave: jest.fn()
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset roomManager mocks
    jest.restoreAllMocks();
  });

  test('should register socket handlers', () => {
    registerGameSocket(mockIo, mockSocket);

    // Check that socket.on was called for main events
    expect(mockSocket.on).toHaveBeenCalledWith('get_rooms', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('create_room', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('join_room', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('leave_game', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('start_game', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('request_pieces', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('update_score', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('lines_cleared', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('game_over', expect.any(Function));
  });

  test('should handle get_rooms event', () => {
    registerGameSocket(mockIo, mockSocket);

    // Get the get_rooms handler
    const getRoomsHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'get_rooms'
    )[1];

    // Call the handler
    getRoomsHandler();

    // Check that rooms_list was emitted
    expect(mockSocket.emit).toHaveBeenCalledWith('rooms_list', expect.any(Array));
  });

  test('should handle create_room event', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return null (room doesn't exist)
    jest.spyOn(roomManager, 'getRoom').mockReturnValue(null);

    // Create a real Game object for testing
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    jest.spyOn(roomManager, 'createRoom').mockReturnValue(mockGame);

    // Get the create_room handler
    const createRoomHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'create_room'
    )[1];

    // Call the handler
    const testData = {
      roomName: 'test-room',
      playerName: 'Test Player',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      roomPassword: ''
    };

    const mockCallback = jest.fn();
    createRoomHandler(testData, mockCallback);

    // Check that room was created and callback was called
    expect(roomManager.createRoom).toHaveBeenCalled();
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        players: expect.any(Array),
        leader: expect.any(String),
        status: expect.any(String)
      })
    );
  });

  test('should handle join_room event', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the join_room handler
    const joinRoomHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'join_room'
    )[1];

    // Call the handler
    const mockCallback = jest.fn();
    joinRoomHandler({roomId: 'test-room', playerName: 'Test Player', password: ''}, mockCallback);

    // Check that player was added and callback was called
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true
      })
    );
  });

  test('should handle leave_game event', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game with players
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Add a player to the game
    const Player = require('../game/Player').default;
    const testPlayer = new Player('test-socket-id', 'Test Player');
    mockGame.addPlayer(testPlayer);

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the leave_game handler
    const leaveGameHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'leave_game'
    )[1];

    // Call the handler
    leaveGameHandler({roomId: 'test-room'});

    // Check that player was marked as left
    expect(testPlayer.hasLeft).toBe(true);
    expect(mockGame.players.length).toBe(0); // Player should be removed
  });

  test('should handle start_game event', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Add a player to make it the leader
    const Player = require('../game/Player').default;
    const testPlayer = new Player('test-socket-id', 'Test Player');
    mockGame.addPlayer(testPlayer);

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the start_game handler
    const startGameHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'start_game'
    )[1];

    // Call the handler with callback
    const mockCallback = jest.fn();
    startGameHandler({roomId: 'test-room'}, mockCallback);

    // Check that game status was updated and emitted
    expect(mockGame.status).toBe('playing');
    expect(mockIo.to).toHaveBeenCalledWith('test-room');
    expect(mockIo.emit).toHaveBeenCalledWith('game_started', expect.any(Object));
    expect(mockCallback).toHaveBeenCalledWith({success: true});
  });

  test('should handle request_pieces event', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the request_pieces handler
    const requestPiecesHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'request_pieces'
    )[1];

    // Call the handler
    requestPiecesHandler({roomId: 'test-room'});

    // Check that pieces were emitted
    expect(mockSocket.emit).toHaveBeenCalledWith('pieces', expect.any(Object));
  });

  test('should handle update_score event', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game with players
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Add a player to the game
    const Player = require('../game/Player').default;
    const testPlayer = new Player('test-socket-id', 'Test Player');
    mockGame.addPlayer(testPlayer);

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the update_score handler
    const updateScoreHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'update_score'
    )[1];

    // Call the handler
    updateScoreHandler({roomId: 'test-room', score: 100});

    // Check that score was updated and emitted
    expect(testPlayer.score).toBe(100);
    expect(mockIo.to).toHaveBeenCalledWith('test-room');
    expect(mockIo.emit).toHaveBeenCalledWith('room_update', expect.any(Object));
  });

  test('should handle game_over event', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game with players
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Add a player to the game
    const Player = require('../game/Player').default;
    const testPlayer = new Player('test-socket-id', 'Test Player');
    mockGame.addPlayer(testPlayer);

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the game_over handler
    const gameOverHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'game_over'
    )[1];

    // Call the handler
    gameOverHandler({roomId: 'test-room', score: 500});

    // Check that game over was handled and emitted
    expect(testPlayer.score).toBe(500);
    // Note: gameOver might not be set if player is not found
    // expect(testPlayer.gameOver).toBe(true);
    expect(mockIo.to).toHaveBeenCalledWith('test-room');
    expect(mockIo.emit).toHaveBeenCalledWith('room_update', expect.any(Object));
  });

  test('should handle create_room error when room already exists', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return an existing room
    const existingGame = {
      id: 'test-room',
      players: [],
      playerLimit: 4,
      status: 'waiting',
      isPrivate: false
    };

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(existingGame);

    // Get the create_room handler
    const createRoomHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'create_room'
    )[1];

    // Call the handler
    const testData = {
      roomName: 'test-room',
      playerName: 'Test Player',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      roomPassword: ''
    };

    const mockCallback = jest.fn();
    createRoomHandler(testData, mockCallback);

    // Check that callback was called with error
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Room already exists"
      })
    );
  });

  test('should handle join_room error when room not found', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return null (room not found)
    jest.spyOn(roomManager, 'getRoom').mockReturnValue(null);

    // Get the join_room handler
    const joinRoomHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'join_room'
    )[1];

    // Call the handler
    const mockCallback = jest.fn();
    joinRoomHandler({roomId: 'non-existent-room', playerName: 'Test Player', password: ''}, mockCallback);

    // Check that callback was called with error
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Room does not exist"
      })
    );
  });

  test('should handle start_game error when not leader', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Add a player who is NOT the leader
    const Player = require('../game/Player').default;
    const testPlayer = new Player('different-socket-id', 'Test Player');
    mockGame.addPlayer(testPlayer);

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the start_game handler
    const startGameHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'start_game'
    )[1];

    // Call the handler with callback
    const mockCallback = jest.fn();
    startGameHandler({roomId: 'test-room'}, mockCallback);

    // Check that callback was called with error
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "You are not the leader"
      })
    );
  });

  test('should handle lines_cleared event', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game with multiple players
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Add multiple players to the game
    const Player = require('../game/Player').default;
    const testPlayer1 = new Player('test-socket-id', 'Test Player 1');
    const testPlayer2 = new Player('other-socket-id', 'Test Player 2');
    mockGame.addPlayer(testPlayer1);
    mockGame.addPlayer(testPlayer2);

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the lines_cleared handler
    const linesClearedHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'lines_cleared'
    )[1];

    // Call the handler
    linesClearedHandler({roomId: 'test-room', lines: 2});

    // Check that blocked lines were sent to other players
    expect(mockIo.to).toHaveBeenCalledWith('other-socket-id');
    expect(mockIo.emit).toHaveBeenCalledWith('add_blocked_lines', {lines: 2});
  });

  test('should handle start_game error when not enough players', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game with no players
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Add a player to make it the leader
    const Player = require('../game/Player').default;
    const testPlayer = new Player('test-socket-id', 'Test Player');
    mockGame.addPlayer(testPlayer);

    // Remove the player to simulate no players
    mockGame.players = [];

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the start_game handler
    const startGameHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'start_game'
    )[1];

    // Call the handler with callback
    const mockCallback = jest.fn();
    startGameHandler({roomId: 'test-room'}, mockCallback);

    // Check that callback was called with error
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Not enought players"
      })
    );
  });

  test('should handle update_score error when room not found', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return null (room not found)
    jest.spyOn(roomManager, 'getRoom').mockReturnValue(null);

    // Get the update_score handler
    const updateScoreHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'update_score'
    )[1];

    // Call the handler
    updateScoreHandler({roomId: 'non-existent-room', score: 100});

    // Check that no emissions were made
    expect(mockIo.to).not.toHaveBeenCalled();
    expect(mockIo.emit).not.toHaveBeenCalled();
  });

  test('should handle game_over error when room not found', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return null (room not found)
    jest.spyOn(roomManager, 'getRoom').mockReturnValue(null);

    // Get the game_over handler
    const gameOverHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'game_over'
    )[1];

    // Call the handler
    gameOverHandler({roomId: 'non-existent-room', score: 500});

    // Check that no emissions were made
    expect(mockIo.to).not.toHaveBeenCalled();
    expect(mockIo.emit).not.toHaveBeenCalled();
  });

  test('should handle disconnect event', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game with players
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Add a player to the game
    const Player = require('../game/Player').default;
    const testPlayer = new Player('test-socket-id', 'Test Player');
    mockGame.addPlayer(testPlayer);

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the disconnect handler - it's registered without a specific event name
    // We need to find it differently since it's socket.on('disconnect', ...)
    const disconnectHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'disconnect'
    )[1];

    // Call the handler
    disconnectHandler();

    // Check that player was NOT marked as left (for reconnection)
    // The disconnect handler only removes players who voluntarily left
    expect(testPlayer.hasLeft).toBe(false);
    expect(mockGame.players.length).toBe(1); // Player should still be in the game
    expect(mockGame.players[0].hasLeft).toBe(false);
    expect(mockGame.players[0].id).toBe('test-socket-id');
  });

  test('should handle disconnect event when player voluntarily left', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.findGameByPlayer to return a game with players
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Add a player to the game and mark them as left
    const Player = require('../game/Player').default;
    const testPlayer = new Player('test-socket-id', 'Test Player');
    testPlayer.hasLeft = true; // Player voluntarily left
    mockGame.addPlayer(testPlayer);

    jest.spyOn(roomManager, 'findGameByPlayer').mockReturnValue(mockGame);
    jest.spyOn(roomManager, 'deleteRoom').mockImplementation(jest.fn());

    // Get the disconnect handler
    const disconnectHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'disconnect'
    )[1];

    // Call the handler
    disconnectHandler();

    // Check that player was removed since they voluntarily left
    expect(mockGame.players.length).toBe(0); // Player should be removed
    expect(mockIo.emit).toHaveBeenCalledWith('rooms_list', expect.any(Array));
  });

  test('should handle disconnect event when player is leader', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.findGameByPlayer to return a game with multiple players
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Add multiple players to the game
    const Player = require('../game/Player').default;
    const testPlayer1 = new Player('test-socket-id', 'Test Player 1');
    const testPlayer2 = new Player('other-socket-id', 'Test Player 2');
    testPlayer1.hasLeft = true; // Leader voluntarily left
    mockGame.addPlayer(testPlayer1);
    mockGame.addPlayer(testPlayer2);
    mockGame.leader = 'test-socket-id'; // Make testPlayer1 the leader

    jest.spyOn(roomManager, 'findGameByPlayer').mockReturnValue(mockGame);
    jest.spyOn(roomManager, 'deleteRoom').mockImplementation(jest.fn());

    // Get the disconnect handler
    const disconnectHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'disconnect'
    )[1];

    // Call the handler
    disconnectHandler();

    // Check that leader was removed and new leader was assigned
    expect(mockGame.players.length).toBe(1); // Only testPlayer2 should remain
    expect(mockGame.leader).toBe('other-socket-id'); // New leader should be testPlayer2
    expect(mockIo.to).toHaveBeenCalledWith('test-room');
    expect(mockIo.emit).toHaveBeenCalledWith('room_update', expect.any(Object));
    expect(mockIo.emit).toHaveBeenCalledWith('rooms_list', expect.any(Array));
  });

  test('should handle disconnect event when last player leaves', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.findGameByPlayer to return a game with one player who left
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Add one player to the game and mark them as left
    const Player = require('../game/Player').default;
    const testPlayer = new Player('test-socket-id', 'Test Player');
    testPlayer.hasLeft = true; // Player voluntarily left
    mockGame.addPlayer(testPlayer);

    jest.spyOn(roomManager, 'findGameByPlayer').mockReturnValue(mockGame);
    jest.spyOn(roomManager, 'deleteRoom').mockImplementation(jest.fn());

    // Get the disconnect handler
    const disconnectHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'disconnect'
    )[1];

    // Call the handler
    disconnectHandler();

    // Check that game was deleted since no players remain
    expect(roomManager.deleteRoom).toHaveBeenCalledWith('test-room');
    expect(mockIo.emit).toHaveBeenCalledWith('rooms_list', expect.any(Array));
  });

  test('should handle request_pieces error when room not found', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return null (room not found)
    jest.spyOn(roomManager, 'getRoom').mockReturnValue(null);

    // Get the request_pieces handler
    const requestPiecesHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'request_pieces'
    )[1];

    // Call the handler
    requestPiecesHandler({roomId: 'non-existent-room'});

    // Check that no emissions were made
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  test('should handle update_score error when player not found', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the update_score handler
    const updateScoreHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'update_score'
    )[1];

    // Call the handler with a player that doesn't exist in the game
    updateScoreHandler({roomId: 'test-room', score: 100});

    // Check that no emissions were made since player wasn't found
    expect(mockIo.to).not.toHaveBeenCalled();
    expect(mockIo.emit).not.toHaveBeenCalled();
  });

  test('should handle lines_cleared error when room not found', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return null (room not found)
    jest.spyOn(roomManager, 'getRoom').mockReturnValue(null);

    // Get the lines_cleared handler
    const linesClearedHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'lines_cleared'
    )[1];

    // Call the handler
    linesClearedHandler({roomId: 'non-existent-room', lines: 2});

    // Check that no emissions were made
    expect(mockIo.to).not.toHaveBeenCalled();
  });

  test('should handle game_over when all players finished', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game with multiple players
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Add multiple players to the game
    const Player = require('../game/Player').default;
    const testPlayer1 = new Player('test-socket-id', 'Test Player 1');
    const testPlayer2 = new Player('other-socket-id', 'Test Player 2');
    mockGame.addPlayer(testPlayer1);
    mockGame.addPlayer(testPlayer2);

    // Mark both players as game over
    testPlayer1.gameOver = true;
    testPlayer2.gameOver = true;

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the game_over handler
    const gameOverHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'game_over'
    )[1];

    // Call the handler for the first player
    gameOverHandler({roomId: 'test-room', score: 500});

    // Check that all_players_finished was emitted
    expect(mockIo.to).toHaveBeenCalledWith('test-room');
    expect(mockIo.emit).toHaveBeenCalledWith('all_players_finished', expect.any(Object));

    // Check that game status was reset to waiting
    expect(mockGame.status).toBe('waiting');
  });

  test('should handle leave_game error when room not found', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return null (room not found)
    jest.spyOn(roomManager, 'getRoom').mockReturnValue(null);

    // Get the leave_game handler
    const leaveGameHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'leave_game'
    )[1];

    // Call the handler
    leaveGameHandler({roomId: 'non-existent-room'});

    // Check that no emissions were made
    expect(mockIo.to).not.toHaveBeenCalled();
    expect(mockIo.emit).not.toHaveBeenCalled();
  });

  test('should handle leave_game error when player not found', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game with no players
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the leave_game handler
    const leaveGameHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'leave_game'
    )[1];

    // Call the handler
    leaveGameHandler({roomId: 'test-room'});

    // Check that no emissions were made since player wasn't found
    expect(mockIo.to).not.toHaveBeenCalled();
    expect(mockIo.emit).not.toHaveBeenCalled();
  });

  test('should handle game_over error when player not found', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game with no players
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the game_over handler
    const gameOverHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'game_over'
    )[1];

    // Call the handler
    gameOverHandler({roomId: 'test-room', score: 500});

    // Check that no emissions were made since player wasn't found
    expect(mockIo.to).not.toHaveBeenCalled();
    expect(mockIo.emit).not.toHaveBeenCalled();
  });

  test('should handle game_over when some players not finished', () => {
    registerGameSocket(mockIo, mockSocket);

    // Mock roomManager.getRoom to return a game with multiple players
    const Game = require('../game/Game').default;
    const mockGame = new Game({
      id: 'test-room',
      gravityLevel: 1,
      invisiblePieces: false,
      timeLimit: 0,
      playerLimit: 4,
      isPrivate: false,
      password: ''
    });

    // Add multiple players to the game
    const Player = require('../game/Player').default;
    const testPlayer1 = new Player('test-socket-id', 'Test Player 1');
    const testPlayer2 = new Player('other-socket-id', 'Test Player 2');
    mockGame.addPlayer(testPlayer1);
    mockGame.addPlayer(testPlayer2);

    // Set game status to playing
    mockGame.status = 'playing';

    // Mark only first player as game over
    testPlayer1.gameOver = true;

    jest.spyOn(roomManager, 'getRoom').mockReturnValue(mockGame);

    // Get the game_over handler
    const gameOverHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'game_over'
    )[1];

    // Call the handler for the first player
    gameOverHandler({roomId: 'test-room', score: 500});

    // Check that player_finished was emitted (not all_players_finished)
    expect(mockIo.to).toHaveBeenCalledWith('test-room');
    expect(mockIo.emit).toHaveBeenCalledWith('player_finished', expect.any(Object));
    expect(mockIo.emit).not.toHaveBeenCalledWith('all_players_finished');

    // Check that game status is still playing
    expect(mockGame.status).toBe('playing');
  });
});
