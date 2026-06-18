import {useEffect, useState} from "react"
import {useParams, Link} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"

import {setState, setMe, setRoomId} from "../store/game_slice"
import {socket} from "../socket/socket"
import {useNavigate} from "react-router-dom"

import GameSocket from "./hooks/game_socket"
import Gravity from "./hooks/gravity"
import Keyboard from "./hooks/keyboard"
import Timer from "./hooks/timer"
import BoardUpdates from "./hooks/board_updates"

import Lobby from "./components/Lobby"
import GameGrid from "./components/GameGrid"
import GameOver from "./components/GameOver"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCircleLeft} from "@fortawesome/free-solid-svg-icons"

export default function GamePage()
{
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [errorMessage, setErrorMessage] = useState("")

	const {paramRoomId, paramPlayerName} = useParams()

	const status = useSelector(state => state.game.status)
	const roomId = useSelector(state => state.game.roomId)

	GameSocket()
	Gravity()
	Keyboard()
	Timer()
	BoardUpdates()

	useEffect(() => {
		socket.emit("join_room", {roomId: paramRoomId, playerName: paramPlayerName}, (response) => {
			if (response.success)
			{
				dispatch(setState({players: response.players, leader: response.leader, status: response.status}))
				dispatch(setMe(socket.id))
				dispatch(setRoomId(paramRoomId))
				setErrorMessage("")
			}
			else
				setErrorMessage(response.message || "An error occurred while joining the room.")
		})

	}, [dispatch, paramRoomId, paramPlayerName])

	const startGame = () => {
		socket.emit("start_game", {roomId}, (response) => {
			if (response.success)
				setErrorMessage("");
            else
			{
                console.error("Server error :", response.message);
				setErrorMessage(response.message || "An error occurred while creating the room.");
            }
		})
	}

	return (
		<div className="w-screen min-h-screen flex flex-col hidden-scrollbar relative">
            {/* Background color */}
            <div className="absolute top-0 inset-0 -z-10 bg-arcade-black"></div>

            {/* Background image */}
            <div className="absolute inset-0 -z-10 opacity-20">
				<img src="/background.jpg" alt="Image de fond" className="w-full h-full object-cover" loading="eager"/>
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-arcade-purple/20 to-arcade-black"></div>
            </div>

			{/* Game title */}
			{status === "waiting" &&
				<div className="absolute flex flex-row items-center justify-center w-full p-2 md:p-6 mt-8 md:mt-0">
					<img src="/red-tetris_logo.png" alt="Logo Tetris" className="w-24 md:w-36 mr-6 mb-0" loading="eager"/>
					<h1 className="text-2xl md:text-5xl font-bold text-neon-red font-arcade text-center animate-flicker">red-tetris</h1>
				</div>
			}

            <main className="flex flex-col items-center justify-center w-full min-h-screen overflow-hidden pt-36 md:pt-0 pb-12 md:pb-0">
				<button
					onClick={() => {
						socket.emit("leave_game", {roomId})
						navigate("/")
					}}
					className="absolute top-0 left-0 w-36 h-12 flex items-center justify-center rounded-br-lg bg-arcade-black border-b-4 border-r-4 border-neon-blue font-arcade text-white"
				>
					<FontAwesomeIcon icon={faCircleLeft} className="mr-4"/>quit
				</button>

				<div className="flex flex-col items-center justify-center flex-grow w-full">
					<div className="flex flex-col items-center justify-center w-10/12 md:w-3/10 h-auto py-8 rounded-lg bg-arcade-black border-4 border-neon-yellow animate-slide_in_up">
					{/* <div className="flex flex-col items-center justify-center"> */}
						{errorMessage && (
							<p className="text-red-500 mb-4">{errorMessage}</p>
						)}
						{status === "waiting" ?
							<Lobby startGame={startGame}/>
						: status === "gameover" ?
							<GameOver/>
						:
							<GameGrid/>
						}
					</div>
				</div>
			</main>
        </div>
	)
}
