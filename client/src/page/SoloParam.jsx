import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleLeft} from '@fortawesome/free-solid-svg-icons'

export default function SoloParam() {
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
			<div className="absolute flex flex-row items-center justify-center w-full p-6">
                <img src="/red-tetris_logo.png" alt="Logo Tetris" className="w-36 mr-6" loading="eager"/>
				<h1 className="text-5xl font-bold text-neon-red font-arcade text-center animate-flicker">red-tetris</h1>
            </div>

            <main className="flex flex-col items-center justify-center w-full min-h-screen">
				<Link to="/" className="absolute top-0 left-0 w-36 h-12 flex items-center justify-center rounded-br-lg bg-arcade-black border-b-4 border-r-4 border-neon-blue font-arcade text-base text-white transition-all duration-200 hover:scale-105"
				><FontAwesomeIcon icon={faCircleLeft} className="text-neon-blue text-lg mr-2"/> return</Link>

				<div className="flex flex-col items-center justify-center flex-grow w-full">
					<div className="flex flex-col items-center justify-center w-7/12 h-auto py-8 rounded-lg bg-arcade-black border-4 border-neon-yellow">
						<button className="flex items-center px-6 py-3 bg-arcade-purple text-neon-cyan font-arcade text-xl border-4
							border-neon-purple rounded-lg shadow-[0_0_10px_#00F7FF,0_0_20px_#9C27B0] transition-all duration-200 hover:scale-105
							hover:shadow-[0_0_15px_#00F7FF,0_0_25px_#9C27B0] active:translate-y-1"
						><FontAwesomeIcon icon={faCircleLeft} className="text-neon-cyan text-2xl mr-2"/>TEST</button>
						<button className="mt-12 flex items-center px-6 py-3 bg-arcade-purple text-neon-cyan font-arcade text-xl border-4
							border-neon-purple rounded-lg shadow-[0_0_10px_#00F7FF,0_0_20px_#9C27B0] transition-all duration-200 hover:scale-105
							hover:shadow-[0_0_15px_#00F7FF,0_0_25px_#9C27B0] active:translate-y-1"
						><FontAwesomeIcon icon={faCircleLeft} className="text-neon-cyan text-2xl mr-3"/>jaaj</button>
					</div>
				</div>
            </main>
        </div>
    );
}
