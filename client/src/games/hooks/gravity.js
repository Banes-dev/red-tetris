import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {setCurrentPiece} from "../../store/game_slice"

export default function Gravity()
{
	const dispatch = useDispatch()

	const currentPiece = useSelector(state => state.game.currentPiece)
	const status = useSelector(state => state.game.status)

	useEffect(() => {
		if (!currentPiece || status !== "playing")
			return
		const interval = setInterval(() => {
			dispatch(setCurrentPiece({
				...currentPiece,
				y: currentPiece.y + 1
			}))
		}, 1000)

		return () => clearInterval(interval)
	}, [currentPiece, status, dispatch])
}
