import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {store} from "../../store/store"
import {setCurrentPiece, setBoard, consumePiece, setScore, setGameOver} from "../../store/game_slice"

import {movePiece} from "../game/move"
import {lockPiece} from "../game/lock_piece"
import {spawnPiece} from "../game/spawn_piece"
import {clearLines} from "../game/clear_lines"
import {hasCollision} from "../game/collisions"

import {socket} from "../../socket/socket"

export default function useGravity()
{
	const dispatch = useDispatch()

	const status = useSelector(state => state.game.status)
	const rooms = useSelector(state => state.game.rooms)
	const roomId = useSelector(state => state.game.roomId)

	const currentRoom = rooms.find(room => room.id === roomId)
	const gravity = currentRoom?.gravity || 1
	// console.log(rooms, roomId, currentRoom)

	useEffect(() => {
		if (status !== "playing")
			return

		const interval = setInterval(() => {
			const state = store.getState().game
			const {board, currentPiece, pieces} = state
			if (!currentPiece)
				return

			const moved = movePiece(board, currentPiece, 0, 1)

			// piece blocked
			if (moved === currentPiece)
			{
				let newBoard = lockPiece(board, currentPiece)

				// clear lines
				const clearedData = clearLines(newBoard, state.score)
				newBoard = clearedData.board
				dispatch(setBoard(newBoard))
				dispatch(setScore(clearedData.score))
				socket.emit("update_score", {roomId, score: clearedData.score})

				// Send lines cleared event to server for multiplayer effect
				if (clearedData.cleared > 0)
				{
					socket.emit("lines_cleared", {roomId, lines: clearedData.cleared})
				}

				dispatch(consumePiece())
				if (pieces.length < 5)
					socket.emit("request_pieces", {roomId})
				const nextType = pieces[1]
				if (nextType)
				{
					const newPiece = spawnPiece(nextType)
					// Check if the new piece can be spawned without collision
					if (hasCollision(newBoard, newPiece, newPiece.x, newPiece.y))
					{
					// Game over - cannot spawn new piece
					socket.emit("game_over", {roomId, score: clearedData.score})
					dispatch(setGameOver({gameOver: true, score: clearedData.score}))
					dispatch(setCurrentPiece(null))
					return
					}
					dispatch(setCurrentPiece(newPiece))
				}
				return
			}
			dispatch(setCurrentPiece(moved))
		}, 1250 - (250 * (gravity - 1))) // Gravity level : 1 = 1250, 2 = 1000, 3 = 750, 4 = 500 and 5 = 250

		return () => clearInterval(interval)
	}, [status, roomId, dispatch])
}
