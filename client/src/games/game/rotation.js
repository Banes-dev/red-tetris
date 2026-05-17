import {PIECES} from "./pieces"
import {hasCollision} from "./collisions"

export function rotatePiece(board, piece)
{
	if (!piece)
		return piece

	const rotations = PIECES[piece.type]

	if (!rotations)
		return piece

	const nextRotation =
		(piece.rotation + 1) % rotations.length

	const rotatedPiece = {
		...piece,
		rotation: nextRotation,
		shape: rotations[nextRotation]
	}

	if (
		hasCollision(
			board,
			rotatedPiece,
			rotatedPiece.x,
			rotatedPiece.y
		)
	)
		return piece

	return rotatedPiece
}
