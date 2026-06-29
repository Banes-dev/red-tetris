import Game from "../game/Game.js"

function RoomManager()
{
	this.rooms = new Map()
}

RoomManager.prototype.createRoom = function(config)
{
	if (this.rooms.has(config.roomName))
		return null

	// Generate a consistent seed based on room name to ensure all players get same pieces
	// but add a room creation counter to ensure different sequences when room is recreated
	// Initialize room counter if it doesn't exist
	if (!this.roomCreationCounts) {
		this.roomCreationCounts = new Map()
	}

	// Get creation count for this room name and increment it
	let creationCount = this.roomCreationCounts.get(config.roomName) || 0
	creationCount++
	this.roomCreationCounts.set(config.roomName, creationCount)

	// Use room name + creation count for seed
	const seed = this.hashStringToNumber(config.roomName + creationCount)

	const game = new Game({
		id: config.roomName,
		gravityLevel: config.gravityLevel,
		invisiblePieces: config.invisiblePieces,
		opponentSpecters: config.opponentSpecters,
		timeLimit: config.timeLimit,
		playerLimit: config.playerLimit,
		isPrivate: config.isPrivate,
		password: config.roomPassword,
		seed: seed
	})
	this.rooms.set(config.roomName, game)

	return game
}

// Helper function to generate consistent seed from room name
RoomManager.prototype.hashStringToNumber = function(str)
{
	let hash = 0
	for (let i = 0; i < str.length; i++)
	{
		const char = str.charCodeAt(i)
		hash = ((hash << 5) - hash) + char
		hash = hash & hash // Convert to 32bit integer
	}
	return Math.abs(hash)
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

RoomManager.prototype.findGameByPlayer = function(playerId)
{
	for (const game of this.rooms.values())
	{
		if (game.players.find(p => p.id === playerId))
			return game
	}
	return null
}

RoomManager.prototype.deleteRoom = function(roomId)
{
	this.rooms.delete(roomId)
}

export const roomManager = new RoomManager()
export default RoomManager
