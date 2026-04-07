import {useEffect} from "react"
import {useParams} from "react-router-dom"
import {useSelector} from "react-redux"
import {socket} from "../socket/socket"

export default function GamePage()
{
	const {roomId, playerName} = useParams()
	const rooms = useSelector(state => state.game.rooms)

	useEffect(() => {
		console.log(rooms[roomId]);
	})

	// useEffect(() => {
	// 	socket.emit("join_room", {
	// 		roomId,
	// 		playerName
	// 	})

	// 	socket.on("join_error", (err) => {
	// 		console.error(err)
	// 	})

	// 	socket.on("joined_room", (data) => {
	// 		console.log("joined:", data)
	// 	})

	// 	return () => {
	// 		socket.off("join_error")
	// 		socket.off("joined_room")
	// 	}
	// }, [roomId, playerName])

	// const startGame = () => {
	// 	socket.emit("start_game", {roomId})
	// }

	return (
		<div className="text-black">
			Joining room {roomId} as {playerName}...
		</div>
		// {playerName === leader && (
		// 	<button onClick={startGame}>Start Game</button>
		// )}
	)
}
