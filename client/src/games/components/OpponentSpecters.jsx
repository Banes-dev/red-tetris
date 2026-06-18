import {useSelector} from "react-redux"

export default function OpponentSpecters()
{
	const opponentSpecters = useSelector(state => state.game.opponentSpecters)
	const me = useSelector(state => state.game.me)
	const opponentSpectersEnabled = useSelector(state => state.game.opponentSpectersEnabled)
	const roomId = useSelector(state => state.game.roomId)

	if (roomId === "solo-room")
		return null

	// Don't show in solo mode, if feature is disabled, or if no opponents
	if (!me || !opponentSpectersEnabled || Object.keys(opponentSpecters).length === 0)
		return null

	return (
		<div className="mt-6 p-4 rounded-lg bg-arcade-black border-2 border-neon-purple w-full max-w-md">
			<h3 className="text-neon-purple font-arcade text-lg mb-4 text-center">Opponents' Specters</h3>
			<div className="space-y-4">
				{Object.entries(opponentSpecters).map(([playerId, data]) => (
					<div key={playerId} className="flex items-center space-x-3">
						<span className="text-neon-green font-arcade w-24">{data.name}:</span>
						<div className="flex-1 flex space-x-1">
							{data.specter.map((height, colIndex) => (
								<div
									key={colIndex}
									className="w-4 h-8 rounded-sm"
									style={{
										backgroundColor: height === -1 ? '#1a1a1a' : '#00ff00',
										opacity: height === -1 ? 0.3 : 0.8,
										height: height === -1 ? '8px' : `${Math.max(8, 32 - height * 2)}px`
									}}
									title={`Column ${colIndex}: ${height === -1 ? 'Empty' : `First block at row ${height}`}`}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}