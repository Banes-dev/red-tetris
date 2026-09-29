import {useEffect, useState} from "react"
import {useParams, useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"

import {setState, setMe, setRoomId, setPieces, setBoard, setCurrentPiece, setScore, setGameOver, setTimeLimit, setStartTime, setInvisiblePieces, setGravity, resetGame} from "../store/game_slice"
import {createBoard} from "../games/game/board"
import {PIECES} from "../games/game/pieces"
import {store} from "../store/store"

import GameSocket from "../games/hooks/game_socket"
import Gravity from "../games/hooks/gravity"
import Keyboard from "../games/hooks/keyboard"
import Timer from "../games/hooks/timer"

import GameGrid from "../games/components/GameGrid"
import GameOver from "../games/components/GameOver"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCircleLeft} from "@fortawesome/free-solid-svg-icons"

export default function SoloGame()
{
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [errorMessage, setErrorMessage] = useState("")

	// Get parameters from URL
	const {gravityLevel, invisiblePieces, timeLimit} = useParams()

	const status = useSelector(state => state.game.status)
	const score = useSelector(state => state.game.score)

	// Initialize solo game
	useEffect(() => {
		// Set up solo game with parameters from URL
		// Generate a random piece sequence for solo mode
		function generateRandomPieces(count = 50) {
			const pieces = []
			const pieceTypes = ["I", "O", "T", "L", "J", "S", "Z"]
			// Create a copy of piece types for shuffling
			const shuffledPieces = [...pieceTypes]

			// Use Fisher-Yates shuffle algorithm for better randomization
			for (let i = shuffledPieces.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
				;[shuffledPieces[i], shuffledPieces[j]] = [shuffledPieces[j], shuffledPieces[i]]
			}

			// Create sequence by cycling through shuffled pieces
			for (let i = 0; i < count; i++) {
				pieces.push(shuffledPieces[i % shuffledPieces.length])
			}
			return pieces
		}

		dispatch(setPieces(generateRandomPieces())) // Random pieces queue
		dispatch(setBoard(createBoard()))
		dispatch(setScore(0))
		dispatch(setTimeLimit(parseInt(timeLimit) || 0))
		dispatch(setStartTime(Date.now()))
		dispatch(setInvisiblePieces(invisiblePieces === 'true'))
		dispatch(setGravity(parseInt(gravityLevel) || 1))
		dispatch(setMe("solo-player"))
		dispatch(setRoomId("solo-room-" + Date.now())) // Unique room ID for each session
		dispatch(setState({
			players: [{id: "solo-player", name: "You", score: 0}],
			leader: "solo-player",
			status: "playing"
		}))

		// Set first piece - use first piece from the random sequence
		const pieces = store.getState().game.pieces
		const firstType = pieces[0]
		dispatch(setCurrentPiece({
			type: firstType,
			rotation: 0,
			shape: PIECES[firstType][0],
			x: 3,
			y: 0
		}))
	}, [dispatch, gravityLevel, invisiblePieces, timeLimit])

	// Use hooks for game mechanics
	GameSocket()
	Gravity()
	Keyboard()
	Timer()

	const handleQuit = () => {
		dispatch(resetGame())
		navigate("/solo_param")
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
			{/* <div className="absolute flex flex-row items-center justify-center w-full p-2 md:p-6 mt-8 md:mt-0">
				<img src="/red-tetris_logo.png" alt="Logo Tetris" className="w-24 md:w-36 mr-6 mb-0" loading="eager"/>
				<h1 className="text-2xl md:text-5xl font-bold text-neon-red font-arcade text-center animate-flicker">red-tetris</h1>
			</div> */}

            <main className="flex flex-col items-center justify-center w-full min-h-screen overflow-hidden pt-36 md:pt-0 pb-12 md:pb-0">
				<button
					onClick={handleQuit}
					className="absolute top-0 left-0 w-36 h-12 flex items-center justify-center rounded-br-lg bg-arcade-black border-b-4 border-r-4 border-neon-blue font-arcade text-white"
				>
					<FontAwesomeIcon icon={faCircleLeft} className="mr-4"/>quit
				</button>

				<div className="flex flex-col items-center justify-center flex-grow w-full">
					<div className="flex flex-col items-center justify-center w-10/12 md:w-3/10 h-auto py-8 rounded-lg bg-arcade-black border-4 border-neon-yellow animate-slide_in_up">
						{errorMessage && (
							<p className="text-red-500 mb-4">{errorMessage}</p>
						)}
						{status === "gameover" ?
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