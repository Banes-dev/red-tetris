import {useSelector} from "react-redux"
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react';

export default function GameOver()
{
	const [cookies, setCookie] = useCookies(['best_score', 'last_score']);
	const navigate = useNavigate();
	const score = useSelector(state => state.game.gameOverScore)
	const roomId = useSelector(state => state.game.roomId)

	useEffect(() => {
		// Only handle score saving for solo mode
		if (roomId === "solo-room") {
			// Set last score
			const sixMonthsFromNow = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000);

			// Update last score
			setCookie('last_score', score, { path: '/', expires: sixMonthsFromNow });

			// Update best score if current score is better
			if (!cookies.best_score || score > cookies.best_score) {
				setCookie('best_score', score, { path: '/', expires: sixMonthsFromNow });
			}

			// Redirect to solo params after 3 seconds
			const timer = setTimeout(() => {
				navigate('/solo_param');
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [roomId, cookies.best_score, setCookie, navigate]);
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