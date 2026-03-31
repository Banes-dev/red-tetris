import Game from "../game/Game.js"

function RoomManager()
{
	this.rooms = new Map()
}

RoomManager.prototype.createRoom = function(roomId)
{
	if (this.rooms.has(roomId))
		return this.rooms.get(roomId)

	const game = new Game(roomId)
	this.rooms.set(roomId, game)

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
		status: game.status // waiting | playing | finished
	}))
}

export const roomManager = new RoomManager()
