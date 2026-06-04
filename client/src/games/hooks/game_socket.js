import {useEffect} from "react"
import {useDispatch} from "react-redux"

import {setState, setPieces, setBoard, setCurrentPiece, setScore} from "../../store/game_slice"
import {addBlockedLines} from "../game/blocked_lines"

import {socket} from "../../socket/socket"
import {store} from "../../store/store"
import {createBoard} from "../game/board"
import {PIECES} from "../game/pieces"

export default function GameSocket()
{
	const dispatch = useDispatch()

	useEffect(() => {
		socket.on("room_update", (data) => {
			dispatch(setState(data))
		})

		socket.on("game_started", ({pieces}) => {
			dispatch(setPieces(pieces))
			dispatch(setBoard(createBoard()))
			dispatch(setScore(0))

			const type = pieces[0]

			dispatch(setCurrentPiece({
				type,
				shape: PIECES[type],
				x: 3,
				y: 0
			}))
		})

		socket.on("pieces", (pieces) => {
			dispatch(setPieces(pieces))
		})

		socket.on("add_blocked_lines", ({lines}) => {
			const state = store.getState().game
			const newBoard = addBlockedLines(state.board, lines)
			dispatch(setBoard(newBoard))
		})

		return () => {
			socket.off("room_update")
			socket.off("game_started")
			socket.off("pieces")
			socket.off("add_blocked_lines")
		}
	}, [dispatch])
}
