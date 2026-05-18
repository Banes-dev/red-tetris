export function lockPiece(board, piece)
{
	const newBoard = board.map(row => [...row])

	piece.shape.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value)
            {
				const px = piece.x + x
				const py = piece.y + y

				if (py >= 0 && py < 20 && px >= 0 && px < 10)
					newBoard[py][px] = piece.type
			}
		})
	})
	return newBoard
}
