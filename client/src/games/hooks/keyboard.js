import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {setCurrentPiece} from "../../store/game_slice"

import {movePiece} from "../game/move"
import {rotatePiece} from "../game/rotation"
import {hasCollision} from "../game/collisions"

export default function Keyboard()
{
	const dispatch = useDispatch()

	const board = useSelector(state => state.game.board)
	const currentPiece = useSelector(state => state.game.currentPiece)

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (!currentPiece)
				return

			switch (e.key) {
				case "ArrowLeft":
					dispatch(setCurrentPiece(
						movePiece(board, currentPiece, -1, 0)
					))
					break

				case "ArrowRight":
					dispatch(setCurrentPiece(
						movePiece(board, currentPiece, 1, 0)
					))
					break

				case "ArrowDown":
					dispatch(setCurrentPiece(
						movePiece(board, currentPiece, 0, 1)
					))
					break

				case "ArrowUp":
					dispatch(setCurrentPiece(
						rotatePiece(board, currentPiece)
					))
					break

				case " ":
					let dropped = currentPiece
					while (!hasCollision(board,	dropped, dropped.x, dropped.y + 1))
						dropped = {...dropped, y: dropped.y + 1}
					dispatch(setCurrentPiece(dropped))
					break
			}
		}

		window.addEventListener("keydown", handleKeyDown)

		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}

	}, [board, currentPiece, dispatch])
}
