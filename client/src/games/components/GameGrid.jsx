import {useSelector} from "react-redux"
import {PIECE_COLORS} from "../game/pieces"

export default function GameGrid()
{
	const board = useSelector(state => state.game.board)
	const currentPiece = useSelector(state => state.game.currentPiece)
	const score = useSelector(state => state.game.score)

	if (!board || board.length === 0)
		return null

	const displayBoard = board.map(row => [...row])

	if (currentPiece)
	{
		currentPiece.shape.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value)
				{
					const px = currentPiece.x + x
					const py = currentPiece.y + y

					if (displayBoard[py] && displayBoard[py][px] !== undefined)
						displayBoard[py][px] = currentPiece.type
				}
			})
		})
	}

	return (
		<div className="flex flex-col items-center">
			<div className="mb-4">
				<h3 className="text-neon-green font-arcade text-xl">Score : {score}</h3>
			</div>
			<div className="grid gap-[2px] bg-black" style={{gridTemplateColumns: "repeat(10, 30px)"}}>
				{displayBoard.flat().map((cell, i) => {
					// Special color for blocked lines (value 2)
					const isBlockedLine = cell === 2
					const cellColor = isBlockedLine ? "#8B4513" : (cell ? PIECE_COLORS[cell] : "#000")
					const shadowColor = isBlockedLine ? "#8B4513" : (cell ? PIECE_COLORS[cell] : "none")
					return (
						<div key={i} className="w-[30px] h-[30px] rounded-sm border border-gray-900" style={{
							backgroundColor: cellColor,
							boxShadow: cell ? `0 0 4px ${shadowColor}80, 0 0 6px ${shadowColor}40` : "none"
						}}/>
					)
				})}
			</div>
		</div>
	)
}
