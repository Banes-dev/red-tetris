import {configureStore} from "@reduxjs/toolkit"
import gameReducer from "./game_slice"

export const store = configureStore({
	reducer: {
		game: gameReducer
	}
})
