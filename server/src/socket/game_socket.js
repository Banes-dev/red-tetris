import {gameManager} from "../game/game_manager.js"

export function registerGameSocket(io, socket) {
	socket.on("join_game", () => {
		gameManager.addPlayer(socket.id)
		socket.emit("joined", {
			id: socket.id
		})
	})

	socket.on("player_input", (input) => {
		gameManager.handleInput(socket.id, input)
	})
}
