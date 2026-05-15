import {PIECES} from "./pieces"

export function spawnPiece(type)
{
	return {
		type,
		shape: PIECES[type],
		x: 3,
		y: 0
	}
}
