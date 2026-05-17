import {hasCollision} from "./collisions"

export function movePiece(board, piece, dx, dy)
{
	if (!piece)
		return piece

	const movedPiece = {
		...piece,
		x: piece.x + dx,
		y: piece.y + dy
	}

	if (
		hasCollision(
			board,
			movedPiece,
			movedPiece.x,
			movedPiece.y
		)
	)
		return piece

	return movedPiece
}
