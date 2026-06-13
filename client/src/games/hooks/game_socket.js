import {useEffect} from "react"
import {useDispatch} from "react-redux"

import {setState, setPieces, setBoard, setCurrentPiece, setScore, setGameOver} from "../../store/game_slice"
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
			// Don't update status if we're in gameover state
			const currentState = store.getState().game
			if (currentState.status === "gameover") {
				// Only update players list, not status
				dispatch(setState({
					players: data.players,
					leader: data.leader,
					status: "gameover"  // Keep gameover status
				}))
			} else {
				dispatch(setState(data))
			}
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

		socket.on("all_players_finished", ({players}) => {
			// All players have finished, return to lobby
			dispatch(setState({
				players: players,
				leader: store.getState().game.leader,
				status: "waiting"  // Return to waiting status to show lobby
			}))
		})

		socket.on("player_finished", ({playerId, score}) => {
			// A player has finished, update their status
			const state = store.getState().game
			const updatedPlayers = state.players.map(p =>
				p.id === playerId ? {...p, gameOver: true, score} : p
			)
			dispatch(setState({
				players: updatedPlayers,
				leader: state.leader,
				status: state.status
			}))
		})

		return () => {
			socket.off("room_update")
			socket.off("game_started")
			socket.off("pieces")
			socket.off("add_blocked_lines")
			socket.off("all_players_finished")
			socket.off("player_finished")
		}
	}, [dispatch])
}
