import {createSlice} from "@reduxjs/toolkit"

const initialState = {
	rooms: [],
	players: [],
	me: null,
	roomId: null,
	leader: null,
	status: "waiting"
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
		}
	}
})

export const {setRooms, setState, setMe, setRoomId} = gameSlice.actions
export default gameSlice.reducer
