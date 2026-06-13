import {useSelector} from "react-redux"

export default function GameOver()
{
	const score = useSelector(state => state.game.gameOverScore)
	const players = useSelector(state => state.game.players)
	const me = useSelector(state => state.game.me)

	// Find current player's position
	const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
	const currentPlayer = sortedPlayers.find(p => p.id === me)
	const position = currentPlayer ? sortedPlayers.indexOf(currentPlayer) + 1 : players.length

	return (
		<>
			<h1 className="absolute bottom-80 text-6xl font-bold text-neon-red font-arcade animate-pulse whitespace-nowrap mb-8 text-center">GAME OVER</h1>

			<div className="w-full pr-6 pl-6">
				<div className="mb-6 text-left">
					<h2 className="text-2xl text-neon-green font-arcade mb-2">Your Score : {score}</h2>
					<h3 className="text-xl text-neon-cyan font-arcade">Position : {position}/{players.length}</h3>
				</div>

				<div className="mb-6 text-left">
					<h4 className="text-lg text-neon-purple font-arcade mb-2 border-b-2 border-neon-purple pb-1">Scores :</h4>
					<ul className="space-y-1 max-h-60 overflow-y-auto">
						{sortedPlayers.map((player, index) => (
							<li key={player.id} className="flex justify-between items-center p-1">
								<span className={`font-arcade ${player.id === me ? 'text-neon-yellow' : 'text-neon-purple'}`}>
									{index + 1}. {player.name}
								</span>
								<span className="font-arcade text-neon-green">{player.score}</span>
							</li>
						))}
					</ul>
				</div>

				<p className="text-neon-blue font-arcade text-center text-sm">Waiting for other players to finish...</p>
			</div>
		</>
	)
}