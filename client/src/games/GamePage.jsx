import {useEffect, useState} from "react"
import {useParams, Link} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"

import {setState, setMe, setRoomId} from "../store/game_slice"
import {socket} from "../socket/socket"

import GameSocket from "./hooks/game_socket"
import Gravity from "./hooks/gravity"
import Keyboard from "./hooks/keyboard"

import Lobby from "./components/Lobby"
import GameGrid from "./components/GameGrid"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCircleLeft} from "@fortawesome/free-solid-svg-icons"

export default function GamePage()
{
	const dispatch = useDispatch()

	const [errorMessage, setErrorMessage] = useState("")

	const {paramRoomId, paramPlayerName} = useParams()

	const status = useSelector(state => state.game.status)
	const roomId = useSelector(state => state.game.roomId)

	GameSocket()
	Gravity()
	Keyboard()

	useEffect(() => {

		socket.emit(
			"join_room",
			{
				roomId: paramRoomId,
				playerName: paramPlayerName
			},
			(response) => {

				if (response.success) {

					dispatch(setState({
						players: response.players,
						leader: response.leader,
						status: response.status
					}))

					dispatch(setMe(socket.id))
					dispatch(setRoomId(paramRoomId))

					setErrorMessage("")

				} else {

					setErrorMessage(
						response.message ||
						"An error occurred while joining the room."
					)
				}
			}
		)
	}, [dispatch, paramRoomId, paramPlayerName])

	const startGame = () => {
		socket.emit("start_game", {roomId}, (response) => {
			if (response.success) {
				setErrorMessage("");
			}
            else {
                console.error("Server error :", response.message);
				setErrorMessage(response.message || "An error occurred while creating the room.");
            }
		})
	}

	return (
		<div className="w-screen min-h-screen flex items-center justify-center bg-black relative">
			<Link
				to="/"
				className="absolute top-0 left-0 w-36 h-12 flex items-center justify-center rounded-br-lg bg-arcade-black border-b-4 border-r-4 border-neon-blue font-arcade text-white"
			><FontAwesomeIcon icon={faCircleLeft} className="mr-4"/>quit</Link>

			<div className="p-8 border-4 border-neon-yellow rounded-lg bg-arcade-black">
				{errorMessage && (
					<p className="text-red-500 mb-4">{errorMessage}</p>
				)}
				{status === "waiting" ?
					<Lobby startGame={startGame}/>
				:
					<GameGrid/>
				}
			</div>
		</div>
	)
}
