function Game(id)
{
	this.id = id
	this.players = []
	this.status = "waiting"
	this.leader = null
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
