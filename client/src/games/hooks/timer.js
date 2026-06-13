import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {socket} from "../../socket/socket"
import {setTimeLeft, setGameOver} from "../../store/game_slice"

export default function useTimer() {
    const dispatch = useDispatch()
    const timeLimit = useSelector(state => state.game.timeLimit)
    const startTime = useSelector(state => state.game.startTime)
    const status = useSelector(state => state.game.status)
    const roomId = useSelector(state => state.game.roomId)
    const score = useSelector(state => state.game.score)

    useEffect(() => {
        if (status !== "playing" || !timeLimit || !startTime) {
            return
        }

        // Calculate end time (startTime + timeLimit in minutes converted to milliseconds)
        const endTime = startTime + (timeLimit * 60 * 1000)

        const interval = setInterval(() => {
            const now = Date.now()
            const remaining = endTime - now

            if (remaining <= 0) {
                // Time's up! Force game over
                clearInterval(interval)
                socket.emit("game_over", {roomId, score: score})
                dispatch(setGameOver({gameOver: true, score: score}))
                return
            }

            // Update time left in store (in seconds)
            const secondsLeft = Math.ceil(remaining / 1000)
            dispatch(setTimeLeft(secondsLeft))
        }, 1000)

        return () => clearInterval(interval)
    }, [timeLimit, startTime, status, roomId, score, dispatch])
}