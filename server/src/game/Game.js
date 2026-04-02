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
}

Game.prototype.addPlayer = function(player)
{
	if (this.status !== "waiting")
		return false

	this.players.push(player)

	if (!this.leader)
		this.leader = player.id

	return true
}

export default Game
