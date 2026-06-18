import gameReducer, {
  setRooms,
  setState,
  setMe,
  setRoomId,
  setPieces,
  setBoard,
  setCurrentPiece,
  consumePiece,
  setScore,
  setGameOver,
  resetGame,
  setTimeLimit,
  setStartTime,
  setTimeLeft,
  setInvisiblePieces,
  setGravity
} from './game_slice';

describe('game slice', () => {
  const initialState = {
    rooms: [],
    players: [],
    me: null,
    roomId: null,
    leader: null,
    status: "waiting",
    pieces: [],
    board: Array(20).fill().map(() => Array(10).fill(0)),
    currentPiece: null,
    score: -1,
    gameOver: false,
    gameOverScore: 0,
    timeLimit: 0,
    startTime: null,
    timeLeft: null,
    invisiblePieces: false,
    gravity: 1
  };

  test('should handle setRooms', () => {
    const newState = gameReducer(initialState, setRooms([{id: 'room1', players: []}]));
    expect(newState.rooms.length).toBe(1);
    expect(newState.rooms[0].id).toBe('room1');
  });

  test('should handle setState', () => {
    const newState = gameReducer(initialState, setState({
      players: [{id: 'player1', name: 'Player 1'}],
      leader: 'player1',
      status: 'playing'
    }));
    expect(newState.players.length).toBe(1);
    expect(newState.leader).toBe('player1');
    expect(newState.status).toBe('playing');
  });

  test('should handle setMe', () => {
    const newState = gameReducer(initialState, setMe('player1'));
    expect(newState.me).toBe('player1');
  });

  test('should handle setRoomId', () => {
    const newState = gameReducer(initialState, setRoomId('room1'));
    expect(newState.roomId).toBe('room1');
  });

  test('should handle setPieces', () => {
    const newState = gameReducer(initialState, setPieces(['I', 'O', 'T']));
    expect(newState.pieces).toEqual(['I', 'O', 'T']);
  });

  test('should handle setScore', () => {
    const newState = gameReducer(initialState, setScore(100));
    expect(newState.score).toBe(100);
  });

  test('should handle setGameOver', () => {
    const newState = gameReducer(initialState, setGameOver({gameOver: true, score: 500}));
    expect(newState.gameOver).toBe(true);
    expect(newState.gameOverScore).toBe(500);
    expect(newState.status).toBe('gameover');
  });

  test('should handle resetGame', () => {
    const stateWithData = {
      ...initialState,
      score: 100,
      pieces: ['I', 'O'],
      currentPiece: {type: 'I', shape: [[1,1,1,1]], x: 3, y: 0}
    };

    const newState = gameReducer(stateWithData, resetGame());
    expect(newState.score).toBe(0);
    expect(newState.pieces).toEqual([]);
    expect(newState.currentPiece).toBeNull();
    expect(newState.status).toBe('waiting');
  });

  test('should handle setBoard', () => {
    const newBoard = Array(20).fill().map(() => Array(10).fill(1));
    const newState = gameReducer(initialState, setBoard(newBoard));
    expect(newState.board).toBe(newBoard);
  });

  test('should handle setCurrentPiece', () => {
    const piece = {type: 'I', shape: [[1,1,1,1]], x: 3, y: 0};
    const newState = gameReducer(initialState, setCurrentPiece(piece));
    expect(newState.currentPiece).toBe(piece);
  });

  test('should handle consumePiece', () => {
    const stateWithPieces = {
      ...initialState,
      pieces: ['I', 'O', 'T', 'L', 'J']
    };
    const newState = gameReducer(stateWithPieces, consumePiece());
    expect(newState.pieces).toEqual(['O', 'T', 'L', 'J']);
  });

  test('should handle setTimeLimit', () => {
    const newState = gameReducer(initialState, setTimeLimit(60));
    expect(newState.timeLimit).toBe(60);
  });

  test('should handle setStartTime', () => {
    const startTime = Date.now();
    const newState = gameReducer(initialState, setStartTime(startTime));
    expect(newState.startTime).toBe(startTime);
  });

  test('should handle setTimeLeft', () => {
    const newState = gameReducer(initialState, setTimeLeft(30));
    expect(newState.timeLeft).toBe(30);
  });

  test('should handle setInvisiblePieces', () => {
    const newState = gameReducer(initialState, setInvisiblePieces(true));
    expect(newState.invisiblePieces).toBe(true);
  });

  test('should handle setGravity', () => {
    const newState = gameReducer(initialState, setGravity(2));
    expect(newState.gravity).toBe(2);
  });
});
