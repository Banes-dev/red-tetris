import {useSelector} from "react-redux"
import {PIECE_COLORS} from "../game/pieces"

export default function GameGrid()
{
	const board = useSelector(state => state.game.board)
	const currentPiece = useSelector(state => state.game.currentPiece)

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
		<div className="grid gap-[2px] bg-black" style={{gridTemplateColumns: "repeat(10, 30px)"}}>
			{displayBoard.flat().map((cell, i) => (
				<div key={i} className="w-[30px] h-[30px] rounded-sm border border-gray-900" style={{backgroundColor: cell ? PIECE_COLORS[cell] : "#000", boxShadow: cell ? `0 0 4px ${PIECE_COLORS[cell]}80, 0 0 6px ${PIECE_COLORS[cell]}40` : "none",}}/>
			))}
		</div>
	)
}
