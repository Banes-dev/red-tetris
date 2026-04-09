import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {setState, setMe, setRoomId} from "../store/game_slice"
import {socket} from "../socket/socket"

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

		socket.on("game_started", () => {
			console.log("game started")
		})

		return () => {
			socket.off("room_update")
			socket.off("game_started")
		}
	}, [dispatch])

	const startGame = () => {
		socket.emit("start_game", {roomId}, (response) => {
			if (response.success) {
				console.error("Ba c bon ....");
				setErrorMessage("");
			}
            else {
                console.error("Server error :", response.message);
				setErrorMessage(response.message || "An error occurred while creating the room.");
            }
		})
		console.log("Game startooooooo")
	}

	return (
		<div className="text-black p-4">
			<h1>Room : {roomId}</h1>
			<div>Status : {status}</div>
			<div>Me : {me}</div>
			<div>Leader : {leader}</div>

			<ul>
				{players.map(p => (
					<li key={p.id}>
						{p.name} {p.id === leader && " (leader)"}
					</li>
				))}
			</ul>

			{me === leader && status === "waiting" && (
				<button onClick={startGame} className="bg-neon-red">
					Start Game
				</button>
			)}
		</div>
	)
}
