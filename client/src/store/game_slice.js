import {createSlice} from "@reduxjs/toolkit"
import {createBoard} from "../games/game/board"

const initialState = {
	rooms: [],
	players: [],
	me: null,
	roomId: null,
	leader: null,
	status: "waiting",
	pieces: [],
	board: createBoard(),
	currentPiece: null
}

const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		setRooms: (state, action) => {
			state.rooms = action.payload
		},
		setState: (state, action) => {
			state.players = action.payload.players
			state.leader = action.payload.leader
			state.status = action.payload.status
		},
		setMe: (state, action) => {
			state.me = action.payload
		},
		setRoomId: (state, action) => {
			state.roomId = action.payload
		},
		setPieces: (state, action) => {
			state.pieces = [...state.pieces, ...action.payload]
		},
		setBoard: (state, action) => {
			state.board = action.payload
		},
		setCurrentPiece: (state, action) => {
			state.currentPiece = action.payload
		},
		consumePiece: (state) => {
			state.pieces.shift()
		}
	}
})

export const {setRooms, setState, setMe, setRoomId, setPieces, setBoard, setCurrentPiece, consumePiece} = gameSlice.actions
export default gameSlice.reducer
