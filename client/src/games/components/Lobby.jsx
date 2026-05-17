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
			{/* <div className="w-full flex justify-center mb-6">
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
			)} */}

			{/* Room name */}
            <div className="w-full flex justify-center md:justify-start px-4 md:px-6 mb-4 md:mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-neon-red font-arcade">{roomId}</h2>
            </div>
			
            {/* Players list */}
            <div className="w-3/4 md:w-full max-w-sm md:max-w-md mb-4 md:mb-8">
                <h3 className="text-neon-cyan font-arcade text-lg md:text-xl mb-2 md:mb-4 text-center">Players</h3>
                <ul className="space-y-2">
                    {players.map((p) => (
                        <li key={p.id} className="flex items-center justify-between p-2 md:p-3 bg-arcade-purple/30 border-2 border-neon-purple rounded-lg hover:shadow-[0_0_5px_#00F7FF,0_0_10px_#9C27B0] transition-all duration-200 hover:scale-101">
                            <span className="text-neon-cyan font-arcade text-sm md:text-base truncate">{p.name}</span>
                            {p.id === leader && (
                                <FontAwesomeIcon icon={faCrown} className="text-neon-yellow text-base md:text-lg" />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
			
            {/* Btn to start / Wait text */}
            <div className="flex flex-col items-center w-full">
                {me === leader ? (
                    <button onClick={startGame} className="mt-4 md:mt-6 px-2 md:px-6 py-2 md:py-3 bg-arcade-purple text-neon-cyan font-arcade text-base md:text-xl border-4 border-neon-purple rounded-lg shadow-[0_0_5px_#00F7FF,0_0_10px_#9C27B0] animate-arcade-pulse transition-all duration-200 hover:scale-105 hover:shadow-[0_0_10px_#00F7FF,0_0_15px_#9C27B0] active:translate-y-1">
                        <FontAwesomeIcon icon={faPlay} className="text-neon-cyan text-base md:text-xl mr-0 md:mr-2"/> Start the game
                    </button>
                ) : (
                    <p className="text-neon-cyan font-arcade text-base md:text-xl text-center animate-pulse whitespace-normal break-words">Waiting for the game launch ...</p>
                )}
            </div>
		</>
	)
}
