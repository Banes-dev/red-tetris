import {useEffect} from "react"
import {useDispatch} from "react-redux"

import {setState, setPieces, setBoard, setCurrentPiece} from "../../store/game_slice"

import {socket} from "../../socket/socket"
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

		return () => {
			socket.off("room_update")
			socket.off("game_started")
			socket.off("pieces")
		}
	}, [dispatch])
}
