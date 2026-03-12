import {useRef, useEffect} from "react"

export default function GameCanvas() {
	const canvasRef = useRef()

	useEffect(() => {

		const canvas = canvasRef.current
		const ctx = canvas.getContext("2d")

		ctx.fillStyle = "black"
		ctx.fillRect(0, 0, canvas.width, canvas.height)

	}, [])

	return (
		<canvas
		ref={canvasRef}
		width={300}
		height={600}
		className="border border-white"
		/>
	)
}
