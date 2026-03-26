import {useSelector} from "react-redux"

const WIDTH = 10
const HEIGHT = 20

export default function GameGrid() {
	const players = useSelector((state) => state.game.players)

	// on prend le premier joueur pour l'instant
	const player = players?.[0]?.[1]

	// créer grille vide
	const grid = Array.from({ length: HEIGHT }, () =>
		Array(WIDTH).fill(0)
	)

	// injecter pièce active
	if (player?.piece) {
		const { shape, x, y } = player.piece

		shape.forEach((row, dy) => {
		row.forEach((value, dx) => {
			if (value) {
			const gx = x + dx
			const gy = y + dy

			if (grid[gy] && grid[gy][gx] !== undefined) {
				grid[gy][gx] = 1
			}
			}
		})
		})
	}

	return (
		<div className="grid grid-cols-10 gap-[1px] bg-gray-700">
			{grid.flat().map((cell, i) => (
				<div key={i} className={`w-6 h-6 ${cell ? "bg-blue-500" : "bg-black" }`}/>
			))}
		</div>
	)
}
