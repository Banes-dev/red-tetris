import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {setCurrentPiece} from "../../store/game_slice"

export default function Keyboard()
{
	const dispatch = useDispatch()

	const currentPiece = useSelector(state => state.game.currentPiece)

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (!currentPiece)
				return
			switch (e.key) {
				case "ArrowLeft":
					dispatch(setCurrentPiece({
						...currentPiece,
						x: currentPiece.x - 1
					}))
					break
				case "ArrowRight":
					dispatch(setCurrentPiece({
						...currentPiece,
						x: currentPiece.x + 1
					}))
					break
				case "ArrowDown":
					dispatch(setCurrentPiece({
						...currentPiece,
						y: currentPiece.y + 1
					}))
					break
			}
		}
		window.addEventListener("keydown", handleKeyDown)

		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [currentPiece, dispatch])
}
