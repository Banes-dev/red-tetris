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



function Game({id, gravityLevel, invisiblePieces, opponentSpecters, timeLimit, playerLimit, isPrivate, password, seed})
{
	this.id = id
	this.players = []
	this.status = "waiting"
	this.leader = null

	// settings
	this.gravityLevel = gravityLevel
	this.invisiblePieces = invisiblePieces
	this.opponentSpecters = opponentSpecters
	this.timeLimit = timeLimit
	this.playerLimit = playerLimit
	this.isPrivate = isPrivate
	this.password = password

	// piece system
	this.seed = seed || Date.now()
	this.rng = createRNG(this.seed)
	this.pieceQueue = []

	// game timing
	this.startTime = null
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

// Calculate specter from a board - returns array of first occupied line per column
Game.prototype.calculateSpecter = function (board)
{
	if (!board || board.length === 0)
		return Array(10).fill(-1)  // -1 means no blocks in column

	const specter = []
	for (let col = 0; col < 10; col++)
	{
		for (let row = 0; row < board.length; row++)
		{
			if (board[row][col] !== 0)
			{
				specter[col] = row
				break
			}
		}
		if (specter[col] === undefined)
			specter[col] = -1
	}
	return specter
}

export default Game
