import {useEffect} from "react"
import {useSelector} from "react-redux"
import {socket} from "../../socket/socket"

export default function BoardUpdates()
{
	const roomId = useSelector(state => state.game.roomId)
	const board = useSelector(state => state.game.board)
	const me = useSelector(state => state.game.me)
	const opponentSpectersEnabled = useSelector(state => state.game.opponentSpectersEnabled)

	useEffect(() => {
		// Skip for solo mode or if feature is disabled
		if (roomId === "solo-room" || !me || !opponentSpectersEnabled)
			return

		// Send board updates to server when board changes
		socket.emit("update_board", {roomId, board})

	}, [roomId, board, me, opponentSpectersEnabled])
}
