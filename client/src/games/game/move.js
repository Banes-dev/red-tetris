import {hasCollision} from "./collisions"

export function movePiece(board, piece, dx, dy)
{
	const newX = piece.x + dx
	const newY = piece.y + dy

	if (hasCollision(board, piece, newX, newY))
		return piece

	return {
		...piece,
		x: newX,
		y: newY
	}
}
