function Player(id, name)
{
	this.id = id
	this.name = name
	this.score = 0
	this.hasLeft = false  // Flag to indicate if player left voluntarily
	this.gameOver = false  // Flag to indicate if player has finished the game
	this.board = []  // Store the player's board state for specter calculation
}

export default Player
