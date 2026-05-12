import {useSelector} from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faPlay, faCrown} from "@fortawesome/free-solid-svg-icons"

export default function Lobby({startGame})
{
	const me = useSelector(state => state.game.me)
	const leader = useSelector(state => state.game.leader)
	const players = useSelector(state => state.game.players)
	const roomId = useSelector(state => state.game.roomId)

	return (
		<>
			<div className="w-full flex justify-center mb-6">
				<h2 className="text-3xl font-bold text-neon-red font-arcade">
					{roomId}
				</h2>
			</div>

			<div className="w-full max-w-md mb-8">
				<h3 className="text-neon-cyan font-arcade text-xl mb-4 text-center">
					Players
				</h3>

				<ul className="space-y-2">
					{players.map((p) => (
						<li
							key={p.id}
							className="flex items-center justify-between p-3 bg-arcade-purple/30 border-2 border-neon-purple rounded-lg"
						>
							<span className="text-neon-cyan font-arcade">
								{p.name}
							</span>

							{p.id === leader && (
								<FontAwesomeIcon
									icon={faCrown}
									className="text-neon-yellow"
								/>
							)}
						</li>
					))}
				</ul>
			</div>

			{me === leader ? (
				<button
					onClick={startGame}
					className="px-6 py-3 bg-arcade-purple text-neon-cyan font-arcade border-4 border-neon-purple rounded-lg"
				>
					<FontAwesomeIcon icon={faPlay} className="mr-2"/>
					Start Game
				</button>
			) : (
				<p className="text-neon-cyan font-arcade animate-pulse">
					Waiting for the game launch ...
				</p>
			)}
		</>
	)
}
