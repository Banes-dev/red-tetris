import Game from "../game/Game.js"

function RoomManager()
{
	this.rooms = new Map()
}

// RoomManager.prototype.createRoom = function(roomId)
// {
// 	if (this.rooms.has(roomId))
// 		return this.rooms.get(roomId)

// 	const game = new Game(roomId)
// 	this.rooms.set(roomId, game)

// 	return game
// }
RoomManager.prototype.createRoom = function(config)
{
	if (this.rooms.has(config.roomName))
		return null

	const game = new Game({
		id: config.roomName,
		gravityLevel: config.gravityLevel,
		invisiblePieces: config.invisiblePieces,
		timeLimit: config.timeLimit,
		playerLimit: config.playerLimit,
		isPrivate: config.isPrivate,
		password: config.roomPassword
	})
	this.rooms.set(config.roomName, game)

	return game
}

RoomManager.prototype.getRoom = function(roomId)
{
	return this.rooms.get(roomId)
}

RoomManager.prototype.getRoomsList = function()
{
	return Array.from(this.rooms.values()).map(game => ({
		id: game.id,
		players: game.players.length,
		maxPlayers: game.playerLimit,
		status: game.status,
		isPrivate: game.isPrivate,
		gravity: game.gravityLevel,
		invisible: game.invisiblePieces,
		timeLimit: game.timeLimit
	}))
}

export const roomManager = new RoomManager()
