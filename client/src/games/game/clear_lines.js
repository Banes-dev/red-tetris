export function clearLines(board, currentScore = 0)
{
	const filtered = board.filter(
		row => row.some(cell => cell === 0)
	)

	const cleared = 20 - filtered.length

	const newRows = Array.from(
		{length: cleared},
		() => Array(10).fill(0)
	)

	// Calculate score based on number of lines cleared
	// Standard Tetris scoring: 1 line = 100, 2 lines = 300, 3 lines = 500, 4 lines = 800
	let scoreIncrement = 0
	if (cleared === 1)
		scoreIncrement = 100
	else if (cleared === 2)
		scoreIncrement = 300
	else if (cleared === 3)
		scoreIncrement = 500
	else if (cleared === 4)
		scoreIncrement = 800

	return {
		board: [...newRows, ...filtered],
		cleared,
		score: currentScore + scoreIncrement
	}
}
