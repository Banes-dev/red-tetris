// import {gameManager} from "../game/GameManager.js"

// export function registerGameSocket(io, socket) {
// 	socket.on("join_game", () => {
// 		gameManager.addPlayer(socket.id)
// 		socket.emit("joined", {
// 			id: socket.id
// 		})
// 	})

// 	socket.on("player_input", (input) => {
// 		gameManager.handleInput(socket.id, input)
// 	})
// }

import {roomManager} from "../game/RoomManager.js"
import Player from "../game/Player.js"

export function registerGameSocket(io, socket)
{
	// récupérer la liste des rooms
	socket.on("get_rooms", () => {
		const rooms = roomManager.getRoomsList()
		socket.emit("rooms_list", rooms)
	})

	// rejoindre une room
	socket.on("join_room", ({roomId, playerName}) => {
		let game = roomManager.getRoom(roomId)

		if (!game)
			game = roomManager.createRoom(roomId)

		const player = new Player(socket.id, playerName)
		const success = game.addPlayer(player)

		if (!success)
		{
			socket.emit("join_error", "Game already started")
			return
		}

		socket.join(roomId)

		socket.emit("joined_room", {
			roomId,
			playerId: socket.id
		})

		io.to(roomId).emit("room_update", {
			players: game.players
		})

		console.log("rooms:", roomManager.getRoomsList())
	})
}
