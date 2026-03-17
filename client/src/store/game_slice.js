import {createSlice} from "@reduxjs/toolkit"

const initialState = {
	players: [],
	me: null
}

const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		setState: (state, action) => {
			state.players = action.payload.players
		},
		setMe: (state, action) => {
			state.me = action.payload
		}
	}
})

export const {setState, setMe} = gameSlice.actions
export default gameSlice.reducer
