class GameManager {
	constructor() {
		this.players = new Map()
	}

	addPlayer(id) {
		this.players.set(id, {
			board: [],
			score: 0
		})
	}

	handleInput(id, input) {
		const player = this.players.get(id)
		if (!player)
			return
		console.log("input from", id, input)
	}
}

export const gameManager = new GameManager()
