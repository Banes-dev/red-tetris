export function hasCollision(board, piece, x, y)
{
	if (!piece || !piece.shape)
		return true

	for (let py = 0; py < piece.shape.length; py++)
	{
		for (let px = 0; px < piece.shape[py].length; px++)
		{
			if (!piece.shape[py][px])
				continue

			const newX = x + px
			const newY = y + py

			if (newX < 0 || newX >= 10)
				return true

			if (newY >= 20)
				return true

			if (
				newY >= 0 &&
				board[newY] &&
				board[newY][newX]
			)
				return true
		}
	}

	return false
}
