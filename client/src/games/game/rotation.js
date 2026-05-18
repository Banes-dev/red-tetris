import {PIECES} from "./pieces"
import {hasCollision} from "./collisions"

const WALL_KICKS = [
	[0, 0],
	[-1, 0],
	[1, 0],
	[-2, 0],
	[2, 0]
]

export function rotatePiece(board, piece)
{
	if (!piece)
		return piece

	const rotations = PIECES[piece.type]
	if (!rotations)
		return piece

	const nextRotation = (piece.rotation + 1) % rotations.length
	const rotatedShape = rotations[nextRotation]

	for (const [kickX, kickY] of WALL_KICKS)
	{
		const rotatedPiece = {
			...piece,
			rotation: nextRotation,
			shape: rotatedShape,
			x: piece.x + kickX,
			y: piece.y + kickY
		}

		if (!hasCollision(board, rotatedPiece, rotatedPiece.x, rotatedPiece.y))
			return rotatedPiece
	}

	return piece
}
