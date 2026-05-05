import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {setState, setMe, setRoomId, setPieces} from "../store/game_slice"
import {socket} from "../socket/socket"
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCircleLeft, faPlay, faCrown} from "@fortawesome/free-solid-svg-icons"

export default function GamePage() {
	const dispatch = useDispatch()
	const [errorMessage, setErrorMessage] = useState('');

	const {paramRoomId, paramPlayerName} = useParams()

	const me = useSelector(state => state.game.me)
	const leader = useSelector(state => state.game.leader)
	const status = useSelector(state => state.game.status)
	const players = useSelector(state => state.game.players)
	const roomId = useSelector(state => state.game.roomId)

	useEffect(() => {
		// reconnect
		socket.emit("join_room", {roomId: paramRoomId, playerName: paramPlayerName}, (response) => {
			if (response.success) {
				dispatch(setState({players: response.players, leader: response.leader, status: response.status}))
				dispatch(setMe(socket.id))
				dispatch(setRoomId(paramRoomId))
				setErrorMessage("");
			} else
				setErrorMessage(response.message || "An error occurred while joining the room.");
		});

		socket.on("room_update", (data) => {
			dispatch(setState(data))
		})

		socket.on("game_started", ({pieces}) => {
			dispatch(setPieces(pieces))
			console.log("game started")
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

	useEffect(() => {
		const interval = setInterval(() => {
			socket.emit("request_pieces", { roomId })
		}, 2000)

		return () => clearInterval(interval)
	}, [roomId])

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

	// Test value
	// return (
	// 	<div className="text-black p-4">
	// 		<h1>Room : {roomId}</h1>
	// 		<div>Status : {status}</div>
	// 		<div>Me : {me}</div>
	// 		<div>Leader : {leader}</div>

	// 		<ul>
	// 			{players.map(p => (
	// 				<li key={p.id}>
	// 					{p.name} {p.id === leader && " (leader)"}
	// 				</li>
	// 			))}
	// 		</ul>

	// 		{me === leader && status === "waiting" && (
	// 			<button onClick={startGame} className="bg-neon-red">
	// 				Start Game
	// 			</button>
	// 		)}
	// 	</div>
	// )

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
			<div className="absolute flex flex-row items-center justify-center w-full p-2 md:p-6 mt-8 md:mt-0">
				<img src="/red-tetris_logo.png" alt="Logo Tetris" className="w-24 md:w-36 mr-6 mb-0" loading="eager"/>
				<h1 className="text-2xl md:text-5xl font-bold text-neon-red font-arcade text-center animate-flicker">red-tetris</h1>
			</div>

            <main className="flex flex-col items-center justify-center w-full min-h-screen overflow-hidden pt-36 md:pt-0 pb-12 md:pb-0">
				<Link to="/" className="absolute top-0 left-0 w-36 h-12 flex items-center justify-center rounded-br-lg bg-arcade-black border-b-4 border-r-4 border-neon-blue font-arcade text-base text-white animate-slide_in_right transition-all duration-200 hover:scale-105"
				><FontAwesomeIcon icon={faCircleLeft} className="text-neon-blue text-lg mr-4"/> quit</Link>

				<div className="flex flex-col items-center justify-center flex-grow w-full">
					<div className="flex flex-col items-center justify-center w-10/12 md:w-7/12 h-auto py-8 rounded-lg bg-arcade-black border-4 border-neon-yellow animate-slide_in_up">
                        {status === "waiting" ? (
                            <>
                                {/* Room name (aligné à gauche) */}
                                <div className="w-full flex justify-center md:justify-start px-4 md:px-6 mb-4 md:mb-6">
                                    <h2 className="text-2xl md:text-3xl font-bold text-neon-red font-arcade">{roomId}</h2>
                                </div>

                                {/* Liste des joueurs */}
                                <div className="w-3/4 md:w-full max-w-sm md:max-w-md mb-4 md:mb-8">
                                    <h3 className="text-neon-cyan font-arcade text-lg md:text-xl mb-2 md:mb-4 text-center">Players</h3>
                                    <ul className="space-y-2">
                                        {players.map((p) => (
                                            <li key={p.id} className="flex items-center justify-between p-2 md:p-3 bg-arcade-purple/30 border-2 border-neon-purple rounded-lg hover:shadow-[0_0_5px_#00F7FF,0_0_10px_#9C27B0] transition-all duration-200 hover:scale-101">
                                                <span className="text-neon-cyan font-arcade text-sm md:text-base truncate">{p.name}</span>
                                                {p.id === leader && (
                                                    <FontAwesomeIcon icon={faCrown} className="text-neon-yellow text-base md:text-lg" />
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Bouton Démarrer / Texte d'attente */}
                                <div className="flex flex-col items-center w-full">
                                    {me === leader ? (
                                        <button onClick={startGame} className="mt-4 md:mt-6 px-2 md:px-6 py-2 md:py-3 bg-arcade-purple text-neon-cyan font-arcade text-base md:text-xl border-4 border-neon-purple rounded-lg shadow-[0_0_5px_#00F7FF,0_0_10px_#9C27B0] animate-arcade-pulse transition-all duration-200 hover:scale-105 hover:shadow-[0_0_10px_#00F7FF,0_0_15px_#9C27B0] active:translate-y-1">
                                            <FontAwesomeIcon icon={faPlay} className="text-neon-cyan text-base md:text-xl mr-0 md:mr-2"/> Start the game
                                        </button>
                                    ) : (
                                        <p className="text-neon-cyan font-arcade text-base md:text-xl animate-pulse text-center">Waiting for the game launch ...</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Grille de jeu (à implémenter)
                            <div className="text-neon-magenta font-arcade text-xl md:text-2xl">Game grid (to do)</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
