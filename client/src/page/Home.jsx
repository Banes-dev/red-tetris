import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser, faUsers} from '@fortawesome/free-solid-svg-icons'

export default function Home() {

    return (
        <div className="w-screen min-h-screen flex flex-col hidden-scrollbar relative">

            {/* Couleur de fond */}
            <div className="absolute top-0 inset-0 -z-10 bg-arcade-black"></div>

            {/* Image de fond */}
            <div className="absolute inset-0 -z-10 opacity-20">
				<img src="/background.jpg" alt="Image de fond" className="w-full h-full object-cover" loading="eager"/>
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-arcade-purple/20 to-arcade-black"></div>
            </div>

            <main className="flex flex-col w-full items-center flex-grow">
				<div className="flex flex-row items-center justify-center w-full p-6">
                    <img src="/red-tetris_logo.png" alt="Logo Tetris" className="w-36 mr-4" loading="eager"/>
					<h1 className="text-5xl font-bold text-neon-red font-arcade text-center animate-flicker">red-tetris</h1>
                </div>

				<div className="flex flex-col items-center justify-center w-full flex-grow">
					<button class="flex items-center px-6 py-3 bg-arcade-purple text-neon-cyan font-arcade text-xl border-4
						border-neon-purple rounded-lg shadow-[0_0_10px_#00F7FF,0_0_20px_#9C27B0] transition-all duration-200 hover:scale-105
						hover:shadow-[0_0_15px_#00F7FF,0_0_25px_#9C27B0] active:translate-y-1"
					><FontAwesomeIcon icon={faUser} className="text-neon-cyan text-2xl mr-2"/>SOLO</button>
					<button class="mt-12 flex items-center px-6 py-3 bg-arcade-purple text-neon-cyan font-arcade text-xl border-4
						border-neon-purple rounded-lg shadow-[0_0_10px_#00F7FF,0_0_20px_#9C27B0] transition-all duration-200 hover:scale-105
						hover:shadow-[0_0_15px_#00F7FF,0_0_25px_#9C27B0] active:translate-y-1"
					><FontAwesomeIcon icon={faUsers} className="text-neon-cyan text-2xl mr-3"/>MULTIPLAYER</button>
				</div>

				<div className="flex-grow invisible"></div>
            </main>
        </div>
    );
}

// Utils buttons
// <button class="px-6 py-3 bg-arcade-purple text-neon-cyan font-arcade text-base border-4
// 	border-neon-purple rounded-lg shadow-[0_0_10px_#00F7FF,0_0_20px_#9C27B0] transition-all
// 	hover:shadow-[0_0_15px_#00F7FF,0_0_25px_#9C27B0] active:translate-y-1"
// >START GAME</button>
// <button class="mt-8 px-7 py-2.5 bg-arcade-purple text-neon-cyan font-retro text-xl border-4
// 	border-neon-purple rounded-lg shadow-[0_0_10px_#00F7FF,0_0_20px_#9C27B0] transition-all
// 	hover:shadow-[0_0_15px_#00F7FF,0_0_25px_#9C27B0] active:translate-y-1"
// >START GAME</button>
