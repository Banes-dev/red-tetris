// import {useSelector} from "react-redux"

// const WIDTH = 10
// const HEIGHT = 20

// export default function GameGrid() {
// 	const players = useSelector((state) => state.game.players)

// 	// on prend le premier joueur pour l'instant
// 	const player = players?.[0]?.[1]

// 	// créer grille vide
// 	const grid = Array.from({ length: HEIGHT }, () =>
// 		Array(WIDTH).fill(0)
// 	)

// 	// injecter pièce active
// 	if (player?.piece) {
// 		const { shape, x, y } = player.piece

// 		shape.forEach((row, dy) => {
// 		row.forEach((value, dx) => {
// 			if (value) {
// 			const gx = x + dx
// 			const gy = y + dy

// 			if (grid[gy] && grid[gy][gx] !== undefined) {
// 				grid[gy][gx] = 1
// 			}
// 			}
// 		})
// 		})
// 	}

// 	return (
// 		<div className="grid grid-cols-10 gap-[1px] bg-gray-700">
// 			{grid.flat().map((cell, i) => (
// 				<div key={i} className={`w-6 h-6 ${cell ? "bg-blue-500" : "bg-black" }`}/>
// 			))}
// 		</div>
// 	)
// }

import {useSelector} from "react-redux"

export default function GameGrid() {

	const board = useSelector(state => state.game.board)
	const currentPiece = useSelector(state => state.game.currentPiece)

	if (!board || board.length === 0)
		return null

	const displayBoard = board.map(row => [...row])

	if (currentPiece) {

		currentPiece.shape.forEach((row, y) => {

			row.forEach((value, x) => {

				if (value) {

					const px = currentPiece.x + x
					const py = currentPiece.y + y

					if (
						displayBoard[py] &&
						displayBoard[py][px] !== undefined
					) {
						displayBoard[py][px] = 1
					}
				}
			})
		})
	}

	return (
		<div
			className="grid gap-[1px] bg-gray-700 p-1"
			style={{
				gridTemplateColumns: "repeat(10, 30px)"
			}}
		>
			{displayBoard.flat().map((cell, index) => (
				<div
					key={index}
					className={`
						w-[30px]
						h-[30px]
						border
						border-gray-800
						${cell ? "bg-cyan-400" : "bg-black"}
					`}
				/>
			))}
		</div>
	)
}
