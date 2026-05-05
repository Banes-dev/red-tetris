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
		io.to(roomName).emit("room_update", {
			players: game.players,
			leader: game.leader,
			status: game.status
		})
		io.emit("rooms_list", roomManager.getRoomsList())

		callback({success: true, players: game.players, leader: game.leader, status: game.status});
	})

	// Join room
	socket.on("join_room", ({roomId, playerName, password}, callback) => {
		const game = roomManager.getRoom(roomId)

		if (!game)
		{
			callback({success: false, message: "Room does not exist"});
			return
		}
		// Reconnect
		let existingPlayer = game.players.find(p => p.name === playerName)
		if (existingPlayer)
		{
			// update socket.id
			if (existingPlayer.id == game.leader)
				game.leader = socket.id
			existingPlayer.id = socket.id
			socket.join(roomId)
			io.to(roomId).emit("room_update", {
				players: game.players,
				leader: game.leader,
				status: game.status
			})
			callback({success: true, reconnected: true, players: game.players, leader: game.leader, status: game.status})
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
		io.to(roomId).emit("room_update", {
			players: game.players,
			leader: game.leader,
			status: game.status
		})
		io.emit("rooms_list", roomManager.getRoomsList())

		// console.log("rooms:", roomManager.getRoomsList())
		callback({success: true, players: game.players, leader: game.leader, status: game.status});
	})

	// Disconnect player
	socket.on("disconnect", () => {
		const game = roomManager.findGameByPlayer(socket.id)
		if (!game)
			return

		const player = game.players.find(p => p.id === socket.id)
		if (!player)
			return

		// wait before disconnect, check if reconnect
		setTimeout(() => {
			// si le joueur s'est reconnecté entre temps → ne rien faire
			const stillThere = game.players.find(p => p.name === player.name && p.id !== socket.id)
			if (stillThere)
				return

			game.removePlayer(socket.id)

			// si plus de joueurs → supprimer la room
			if (game.players.length === 0)
			{
				roomManager.deleteRoom(game.id)
				io.emit("rooms_list", roomManager.getRoomsList())
				return
			}

			// si leader parti → nouveau leader
			if (game.leader === socket.id)
				game.leader = game.players[0].id

			io.to(game.id).emit("room_update", {
				players: game.players,
				leader: game.leader,
				status: game.status
			})
			io.emit("rooms_list", roomManager.getRoomsList())
		}, 2000) // 2s delay
	})

	// Start game
	socket.on("start_game", ({roomId}, callback) => {
		const game = roomManager.getRoom(roomId)
		if (!game)
			return

		// seul leader
		if (game.leader !== socket.id)
		{
			callback({success: false, message: "You are not the leader"});
			return
		}
		if (game.players.length === 0)
		{
			callback({success: false, message: "Not enought players"});
			return
		}
		game.status = "playing"
		game.fillQueue()
		io.to(roomId).emit("game_started", {roomId, seed: game.seed, pieces: game.pieceQueue.slice(0, 10)})
		io.to(roomId).emit("room_update", {players: game.players, leader: game.leader, status: game.status})

		console.log("game started : ", roomId)
		callback({success: true});
	})

	// Request piece by client
	socket.on("request_pieces", ({roomId}) => {
		const game = roomManager.getRoom(roomId)
		if (!game)
			return

		const pieces = game.getNextPieces(5)
		socket.emit("pieces", pieces)
	})
}
