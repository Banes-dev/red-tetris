import {PIECES} from "./pieces"

export function spawnPiece(type)
{
	return {
		type,
		rotation: 0,
		shape: PIECES[type][0],
		x: 3,
		y: 0
	}
}
