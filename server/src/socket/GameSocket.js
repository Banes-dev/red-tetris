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
			const {roomName, playerName, gravityLevel, invisiblePieces, opponentSpecters, timeLimit, playerLimit, isPrivate, roomPassword} = data
			const existing = roomManager.getRoom(roomName)
			if (existing)
			{
				callback({success: false, message: "Room already exists"});
				return
			}

			const game = roomManager.createRoom({roomName, gravityLevel, invisiblePieces, opponentSpecters, timeLimit, playerLimit, isPrivate, roomPassword})
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
			// Check if player left voluntarily - if so, don't allow reconnect
			if (existingPlayer.hasLeft)
			{
				callback({success: false, message: "You left the game voluntarily"});
				return
			}

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

		// Only remove player if they left voluntarily
		// For normal disconnections (refresh), keep them in the game for reconnection
		if (player.hasLeft)
		{
			game.removePlayer(socket.id)

			// si plus de joueurs → supprimer la room
			if (game.players.length === 0)
			{
				roomManager.deleteRoom(game.id)
				io.emit("rooms_list", roomManager.getRoomsList())
				return
			}

			// si leader parti → nouveau leader
			if (game.leader === socket.id && game.players.length > 0)
				game.leader = game.players[0].id

			io.to(game.id).emit("room_update", {
				players: game.players,
				leader: game.leader,
				status: game.status
			})
			io.emit("rooms_list", roomManager.getRoomsList())
		}
		// For normal disconnections (refresh), don't remove the player
		// They can reconnect within a reasonable time
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
		game.startTime = Date.now()  // Set game start time
		game.fillQueue() // Fill the initial piece queue

		// Send ALL pieces to clients at once to ensure synchronization
		// This prevents desynchronization from individual piece requests
		io.to(roomId).emit("game_started", {
			roomId,
			seed: game.seed,
			pieces: [...game.pieceQueue], // Send ALL pieces, not just first 10
			timeLimit: game.timeLimit,  // Send time limit to clients
			invisiblePieces: game.invisiblePieces,  // Send invisible pieces option
			opponentSpecters: game.opponentSpecters  // Send opponent specters option
		})
		io.to(roomId).emit("room_update", {players: game.players, leader: game.leader, status: game.status})

		console.log("game started : ", roomId)
		callback({success: true});
	})

	// Update player score
	socket.on("update_score", ({roomId, score}) => {
		const game = roomManager.getRoom(roomId)
		if (!game)
			return

		const player = game.players.find(p => p.id === socket.id)
		if (player)
		{
			player.score = score
			io.to(roomId).emit("room_update", {
				players: game.players,
				leader: game.leader,
				status: game.status
			})
		}
	})

	// Update player board and send specter updates to opponents
	socket.on("update_board", ({roomId, board}) => {
		const game = roomManager.getRoom(roomId)
		if (!game)
			return

		// Only process if opponent specters feature is enabled
		if (!game.opponentSpecters)
			return

		const player = game.players.find(p => p.id === socket.id)
		if (player)
		{
			player.board = board
			// Calculate specter and send to all other players
			const specter = game.calculateSpecter(board)

			game.players.forEach(opponent => {
				if (opponent.id !== socket.id)  // Don't send to the player who updated
				{
					io.to(opponent.id).emit("opponent_specter_update", {
						playerId: socket.id,
						playerName: player.name,
						specter: specter
					})
				}
			})
		}
	})

	// Player voluntarily leaves the game
	socket.on("leave_game", ({roomId}) => {
		const game = roomManager.getRoom(roomId)
		if (!game)
			return

		const player = game.players.find(p => p.id === socket.id)
		if (player)
		{
			player.hasLeft = true
			game.removePlayer(socket.id)

			// si plus de joueurs → supprimer la room
			if (game.players.length === 0)
			{
				roomManager.deleteRoom(game.id)
				io.emit("rooms_list", roomManager.getRoomsList())
				return
			}

			// si leader parti → nouveau leader
			if (game.leader === socket.id && game.players.length > 0)
				game.leader = game.players[0].id

			io.to(roomId).emit("room_update", {
				players: game.players,
				leader: game.leader,
				status: game.status
			})
			io.emit("rooms_list", roomManager.getRoomsList())
		}
	})

	// Handle lines cleared by a player - send blocked lines to other players
	socket.on("lines_cleared", ({roomId, lines}) => {
		const game = roomManager.getRoom(roomId)
		if (!game)
			return

		// Send blocked lines to all other players in the room
		game.players.forEach(player => {
			if (player.id !== socket.id)  // Don't send to the player who cleared the lines
			{
				io.to(player.id).emit("add_blocked_lines", {lines})
			}
		})
	})

	// Handle game over event
	socket.on("game_over", ({roomId, score}) => {
		const game = roomManager.getRoom(roomId)
		if (!game)
			return

		const player = game.players.find(p => p.id === socket.id)
		if (player)
		{
			player.score = score
			player.gameOver = true

			// Update room status with updated player scores
			io.to(roomId).emit("room_update", {
				players: game.players,
				leader: game.leader,
				status: game.status
			})

			// Check if all players have finished
			const allFinished = game.players.every(p => p.gameOver)
			if (allFinished)
			{
				// All players finished, send final scores to all players
				io.to(roomId).emit("all_players_finished", {
					players: game.players.map(p => ({
						id: p.id,
						name: p.name,
						score: p.score
					}))
				})

				// Reset game state for next round
				game.players.forEach(p => {
					p.gameOver = false
					// Keep scores for display in lobby, but reset for next game
					// p.score = 0
				})
				game.status = "waiting"
			}
			else
			{
				// Notify other players that a player has finished
				io.to(roomId).emit("player_finished", {
					playerId: socket.id,
					score: score
				})
			}
		}
	})
}
