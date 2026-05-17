export function clearLines(board)
{
	const filtered = board.filter(
		row => row.some(cell => cell === 0)
	)

	const cleared = 20 - filtered.length

	const newRows = Array.from(
		{length: cleared},
		() => Array(10).fill(0)
	)

	return {
		board: [...newRows, ...filtered],
		cleared
	}
}
