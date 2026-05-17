import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {store} from "../../store/store"
import {setCurrentPiece, setBoard, consumePiece} from "../../store/game_slice"

import {movePiece} from "../game/move"
import {lockPiece} from "../game/lock_piece"
import {spawnPiece} from "../game/spawn_piece"
import {clearLines} from "../game/clear_lines"

import {socket} from "../../socket/socket"

export default function useGravity() {

	const dispatch = useDispatch()

	const status = useSelector(state => state.game.status)
	const roomId = useSelector(state => state.game.roomId)

	useEffect(() => {

		if (status !== "playing")
			return

		const interval = setInterval(() => {

			const state = store.getState().game

			const {
				board,
				currentPiece,
				pieces
			} = state

			if (!currentPiece)
				return

			const moved = movePiece(
				board,
				currentPiece,
				0,
				1
			)

			// piece blocked
			if (moved === currentPiece) {

				let newBoard = lockPiece(
					board,
					currentPiece
				)

				// clear lines
				const clearedData = clearLines(newBoard)

				newBoard = clearedData.board

				dispatch(setBoard(newBoard))

				dispatch(consumePiece())

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

	}, [status, roomId, dispatch])
}
