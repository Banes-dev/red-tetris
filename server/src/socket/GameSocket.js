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
		const player = new Player(socket.id, playerName)
		game.addPlayer(player)

		socket.join(roomName)
		socket.emit("joined_room", {roomName, playerId: socket.id, isLeader: true})
		io.emit("room_update", {players: game.players})

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
		io.emit("room_update", {
			players: game.players,
			// leader: game.leader,
			status: game.status
		})

		// console.log("rooms:", roomManager.getRoomsList())
		callback({success: true});
	})

	// Disconnect player
	socket.on("disconnect", () => {
		const game = roomManager.findGameByPlayer(socket.id)
		if (!game)
			return

		game.removePlayer(socket.id)
		console.log(game.players.length)

		// si plus de joueurs → supprimer la room
		if (game.players.length === 0)
		{
			roomManager.deleteRoom(game.id)
			io.emit("room_update", {
				players: game.players,
				// leader: game.leader,
				status: game.status
			})
			return
		}

		// si leader parti → nouveau leader
		if (game.leader === socket.id)
			game.leader = game.players[0].id

		io.emit("room_update", {
			players: game.players,
			// leader: game.leader,
			status: game.status
		})

		console.log("rooms :", roomManager.getRoomsList())
	})

	// Start game
	socket.on("start_game", ({roomId}) => {
		const game = roomManager.getRoom(roomId)
		if (!game)
			return

		// seul leader
		if (game.leader !== socket.id)
		{
			socket.emit("start_error", "Not leader")
			return
		}
		if (game.players.length === 0)
		{
			socket.emit("start_error", "No players")
			return
		}
		game.status = "playing"

		io.to(roomId).emit("game_started", {
			roomId
		})

		console.log("game started :", roomId)
	})
}
