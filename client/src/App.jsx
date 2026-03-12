import {Routes, Route} from 'react-router-dom';
import {useEffect} from "react"
import {socket} from "./socket/socket"
import GameCanvas from "./canvas/game_canvas"

export default function App() {
	useEffect(() => {
		socket.emit("join_game")

		socket.on("joined", (data) => {
			console.log("joined", data)
		})
	}, [])

	return (
		<div className="flex items-center justify-center h-screen bg-black">
			<GameCanvas />
		</div>
	)
}

		// <Routes>
		// 	<Route path="/" element={<Home />} />
		// 	<Route path="/game" element={<GameCanvas />} />
		// 	<GameCanvas />
		// 	<Route path="/about" element={<About />} />
		// 	<Route path="*" element={<NotFound />} />
		// 	<div className="flex items-center justify-center h-screen bg-black">
		// 		<GameCanvas />
		// 	</div>
		// </Routes>
