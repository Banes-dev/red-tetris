import {useEffect} from "react"
import {useParams} from "react-router-dom"
import {socket} from "../socket/socket"

export default function GamePage()
{
	const {roomId, playerName} = useParams()

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

	return (
		<div className="text-black">
			Joining room {roomId} as {playerName}...
		</div>
	)
}
