import {createSlice} from "@reduxjs/toolkit"

const initialState = {
	rooms: [],
	players: [],
	me: null
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
		},
		setMe: (state, action) => {
			state.me = action.payload
		}
	}
})

export const {setRooms, setState, setMe} = gameSlice.actions
export default gameSlice.reducer
