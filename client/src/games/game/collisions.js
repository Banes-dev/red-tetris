export function hasCollision(board, piece, x, y)
{
	for (let py = 0; py < piece.shape.length; py++)
	{
		for (let px = 0; px < piece.shape[py].length; px++)
		{
			if (!piece.shape[py][px])
				continue

			const newX = x + px
			const newY = y + py

			// walls
			if (newX < 0 || newX >= 10)
				return true

			// floor
			if (newY >= 20)
				return true

			// existing blocks
			if (
				newY >= 0 &&
				board[newY][newX]
			)
				return true
		}
	}
	return false
}
