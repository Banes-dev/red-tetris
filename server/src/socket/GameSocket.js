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
	// Get list of active rooms
	socket.on("get_rooms", () => {
		const rooms = roomManager.getRoomsList()
		socket.emit("rooms_list", rooms)
	})

	// Create room
	socket.on("create_room", (data, callback) => {
		const {roomName, playerName, gravityLevel, invisiblePieces, timeLimit, playerLimit, isPrivate, roomPassword} = data
		const existing = roomManager.getRoom(roomName)
		if (existing)
		{
			callback({success: false, message: "Room already exists"});
			return
		}

		const game = roomManager.createRoom({roomName, gravityLevel, invisiblePieces, timeLimit, playerLimit, isPrivate, roomPassword})
		// const player = new Player(socket.id, playerName)
		// game.addPlayer(player)

		// socket.join(roomName)
		// socket.emit("joined_room", {roomName, playerId: socket.id, isLeader: true})
		// io.to(roomName).emit("room_update", {players: game.players})

		callback({success: true});
	})

	// Join room
	socket.on("join_room", ({roomId, playerName, password}, callback) => {
		const game = roomManager.getRoom(roomId)

		if (!game)
		{
			callback({success: false, message: "Room does not exist"});
			return
		}
		if (game.status !== "waiting")
		{
			callback({success: false, message: "Game already started"});
			return
		}
		if (game.players.length >= game.playerLimit)
		{
			callback({success: false, message: "Room is full"});
			return
		}
		if (game.isPrivate && game.password !== password)
		{
			callback({success: false, message: "Wrong password"});
			return
		}

		const player = new Player(socket.id, playerName)
		game.addPlayer(player)

		socket.join(roomId)
		socket.emit("joined_room", {roomId, playerId: socket.id, isLeader: false})
		io.to(roomId).emit("room_update", {players: game.players})

		// console.log("rooms:", roomManager.getRoomsList())
		callback({success: true});
	})
}
