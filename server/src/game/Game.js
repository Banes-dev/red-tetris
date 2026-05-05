// Utils
export const PIECES = ["I", "O", "T", "L", "J", "S", "Z"]

export function createRNG(seed)
{
	let value = seed
	return function ()
	{
		value = (value * 16807) % 2147483647
		return value / 2147483647
	}
}



function Game({id, gravityLevel, invisiblePieces, timeLimit, playerLimit, isPrivate, password})
{
	this.id = id
	this.players = []
	this.status = "waiting"
	this.leader = null

	// settings
	this.gravityLevel = gravityLevel
	this.invisiblePieces = invisiblePieces
	this.timeLimit = timeLimit
	this.playerLimit = playerLimit
	this.isPrivate = isPrivate
	this.password = password

	// piece system
	this.seed = Date.now()
	this.rng = createRNG(this.seed)
	this.pieceQueue = []
}

// Player function
Game.prototype.addPlayer = function(player)
{
	if (this.status !== "waiting")
		return false

	this.players.push(player)

	if (!this.leader)
		this.leader = player.id

	return true
}
Game.prototype.removePlayer = function(playerId)
{
	this.players = this.players.filter(p => p.id !== playerId)
}

// Piece function
Game.prototype.generatePiece = function ()
{
	const index = Math.floor(this.rng() * PIECES.length)
	return PIECES[index]
}
Game.prototype.fillQueue = function ()
{
	while (this.pieceQueue.length < 50)
		this.pieceQueue.push(this.generatePiece())
}
Game.prototype.getNextPieces = function (count = 5)
{
	const pieces = this.pieceQueue.splice(0, count)
	this.fillQueue()
	return pieces
}

export default Game
