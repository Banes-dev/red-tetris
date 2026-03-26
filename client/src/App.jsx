import {useEffect} from "react"
import {useDispatch} from "react-redux"
import {socket} from "./socket/socket"
import {setState, setMe} from "./store/game_slice"
import Router from "./Router";

export default function App() {
	const dispatch = useDispatch()

	// connect socket + state
	useEffect(() => {
		socket.emit("join_game")
		socket.on("joined", (data) => {
			dispatch(setMe(data.id))
		})
		socket.on("game_state", (state) => {
			dispatch(setState(state))
		})
		// cleanup for no duplication
		return () => {
			socket.off("joined")
			socket.off("game_state")
		}
	}, [dispatch])

	useEffect(() => {
		const handleKey = (e) => {
			if (e.key === "ArrowLeft")
				socket.emit("player_input", "LEFT")
			if (e.key === "ArrowRight")
				socket.emit("player_input", "RIGHT")
			if (e.key === "ArrowDown")
				socket.emit("player_input", "DOWN")
		}
		window.addEventListener("keydown", handleKey)
		return () => {
			window.removeEventListener("keydown", handleKey)
		}
	}, [])

	return (
		<Router/>
		// <div className="flex items-center justify-center h-screen bg-black">
		// 	<GameGrid/>
		// </div>
	)
}
