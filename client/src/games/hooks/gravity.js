import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {
	setCurrentPiece,
	setBoard,
	consumePiece
} from "../../store/game_slice"

import {movePiece} from "../game/move"
import {hasCollision} from "../game/collisions"
import {lockPiece} from "../game/lock_piece"
import {spawnPiece} from "../game/spawn_piece"

import {socket} from "../../socket/socket"

export default function Gravity()
{
	const dispatch = useDispatch()

	const board = useSelector(state => state.game.board)
	const currentPiece = useSelector(state => state.game.currentPiece)
	const pieces = useSelector(state => state.game.pieces)
	const status = useSelector(state => state.game.status)
	const roomId = useSelector(state => state.game.roomId)

	useEffect(() => {

		if (!currentPiece || status !== "playing")
			return

		const interval = setInterval(() => {

			const moved = movePiece(
				board,
				currentPiece,
				0,
				1
			)

			// collision floor/pile
			if (moved === currentPiece) {

				const newBoard = lockPiece(board, currentPiece)

				dispatch(setBoard(newBoard))

				dispatch(consumePiece())

				// demander nouvelles pièces
				if (pieces.length < 5) {
					socket.emit("request_pieces", {roomId})
				}

				const nextType = pieces[1]

				if (nextType) {
					dispatch(setCurrentPiece(
						spawnPiece(nextType)
					))
				}

				return
			}

			dispatch(setCurrentPiece(moved))

		}, 500)

		return () => clearInterval(interval)

	}, [
		board,
		currentPiece,
		pieces,
		status,
		roomId,
		dispatch
	])
}
