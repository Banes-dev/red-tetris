import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser, faUsers} from '@fortawesome/free-solid-svg-icons'

export default function Home()
{
    return (
        <div className="w-screen min-h-screen flex flex-col hidden-scrollbar relative">

            {/* Background color */}
            <div className="absolute top-0 inset-0 -z-10 bg-arcade-black"></div>

            {/* Background image */}
            <div className="absolute inset-0 -z-10 opacity-20">
				<img src="/background.jpg" alt="Image de fond" className="w-full h-full object-cover" loading="eager"/>
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-arcade-purple/20 to-arcade-black"></div>
            </div>

			{/* Game title */}
			<div className="absolute flex flex-row items-center justify-center w-full p-2 md:p-6 mt-0">
				<img src="/red-tetris_logo.png" alt="Logo Tetris" className="w-24 md:w-36 mr-6 mb-0" loading="eager"/>
				<h1 className="text-2xl md:text-5xl font-bold text-neon-red font-arcade text-center animate-flicker">red-tetris</h1>
			</div>

            <main className="flex flex-col items-center justify-center w-full min-h-screen">
				<div className="flex flex-col items-center justify-center flex-grow w-full">
					<div className="flex flex-col items-center justify-center w-full min-h-screen flex-grow">
						<Link to="/solo_param" className="flex items-center px-6 py-3 bg-arcade-purple text-neon-cyan font-arcade text-xl border-4
							border-neon-purple rounded-lg shadow-[0_0_10px_#00F7FF,0_0_20px_#9C27B0] animate-slide_down_pulse
							transition-all duration-200 hover:scale-105 hover:shadow-[0_0_15px_#00F7FF,0_0_25px_#9C27B0] active:translate-y-1"
						><FontAwesomeIcon icon={faUser} className="text-neon-cyan text-2xl mr-2"/>SOLO</Link>
						<Link to="/rooms" className="mt-12 flex items-center px-6 py-3 bg-arcade-purple text-neon-cyan font-arcade text-xl border-4
							border-neon-purple rounded-lg shadow-[0_0_10px_#00F7FF,0_0_20px_#9C27B0] animate-slide_up_pulse
							transition-all duration-200 hover:scale-105 hover:shadow-[0_0_15px_#00F7FF,0_0_25px_#9C27B0] active:translate-y-1"
						><FontAwesomeIcon icon={faUsers} className="text-neon-cyan text-2xl mr-3"/>MULTIPLAYER</Link>
					</div>
				</div>
            </main>
        </div>
    );
}

// Utils buttons
// <button className="px-6 py-3 bg-arcade-purple text-neon-cyan font-arcade text-base border-4
// 	border-neon-purple rounded-lg shadow-[0_0_10px_#00F7FF,0_0_20px_#9C27B0] transition-all
// 	hover:shadow-[0_0_15px_#00F7FF,0_0_25px_#9C27B0] active:translate-y-1"
// >START GAME</button>
// <button className="mt-8 px-7 py-2.5 bg-arcade-purple text-neon-cyan font-retro text-xl border-4
// 	border-neon-purple rounded-lg shadow-[0_0_10px_#00F7FF,0_0_20px_#9C27B0] transition-all
// 	hover:shadow-[0_0_15px_#00F7FF,0_0_25px_#9C27B0] active:translate-y-1"
// >START GAME</button>
