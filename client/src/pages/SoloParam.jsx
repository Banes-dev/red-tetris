import {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {Link, useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleLeft, faPlay} from '@fortawesome/free-solid-svg-icons'

export default function SoloParam()
{
	const [cookies, setCookie] = useCookies(['best_score', 'last_score']);
	const navigate = useNavigate();

    useEffect(() => {
        // Init cookies at 0 if not exist
        if (!cookies.best_score || !cookies.last_score)
		{
            const sixMonthsFromNow = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000);
            setCookie('best_score', 0, { path: '/', expires: sixMonthsFromNow });
            setCookie('last_score', 0, { path: '/', expires: sixMonthsFromNow });
        }
    }, [setCookie, cookies.best_score, cookies.last_score]);

    const [gravityLevel, setGravityLevel] = useState(1);
    const [invisiblePieces, setInvisiblePieces] = useState(false);
    const [timeLimit, setTimeLimit] = useState(2);

    const timeOptions = [1, 2, 3, 5, 8, 10, 15];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Redirect to solo game with parameters
        navigate(`/solo-game/${gravityLevel}/${invisiblePieces}/${timeLimit}`);
    };

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
			<div className="absolute flex flex-row items-center justify-center w-full p-2 md:p-6 mt-8 md:mt-0">
				<img src="/red-tetris_logo.png" alt="Logo Tetris" className="w-24 md:w-36 mr-6 mb-0" loading="eager"/>
				<h1 className="text-2xl md:text-5xl font-bold text-neon-red font-arcade text-center animate-flicker">red-tetris</h1>
			</div>

            <main className="flex flex-col items-center justify-center w-full min-h-screen overflow-hidden pt-36 md:pt-0 pb-12 md:pb-0">
				<Link to="/" className="absolute top-0 left-0 w-36 h-12 flex items-center justify-center rounded-br-lg bg-arcade-black border-b-4 border-r-4 border-neon-blue font-arcade text-base text-white animate-slide_in_right transition-all duration-200 hover:scale-105"
				><FontAwesomeIcon icon={faCircleLeft} className="text-neon-blue text-lg mr-2"/> return</Link>

				<div className="flex flex-col items-center justify-center flex-grow w-full">
					<div className="flex flex-col items-center justify-center w-10/12 md:w-7/12 h-auto py-8 rounded-lg bg-arcade-black border-4 border-neon-yellow animate-slide_in_up">
						{/* Display score */}
						<div className="flex flex-row justify-between w-full px-12 mb-8">
                            <div className="text-center">
                                <p className="text-neon-cyan font-arcade text-lg">Best score</p>
                                <p className="text-neon-red font-arcade text-3xl">{cookies.best_score || 0}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-neon-cyan font-arcade text-lg">Last score</p>
                                <p className="text-neon-red font-arcade text-3xl">{cookies.last_score || 0}</p>
                            </div>
						</div>
						{/* Settings form */}
						<form onSubmit={handleSubmit} className="flex flex-col items-center w-full px-6 md:px-12">
							{/* Gravity level */}
							<div className="mb-6 w-full">
								<label className="block text-neon-cyan font-arcade text-lg mb-2">Gravity level</label>
								<div className="flex justify-between">
									{[1, 2, 3, 4, 5].map((level) => (
										<button key={level} type="button" onClick={() => setGravityLevel(level)} className={`px-4 py-2 rounded-lg font-arcade text-xl cursor-pointer ${gravityLevel === level ? 'bg-arcade-purple text-neon-cyan border-2 border-neon-purple' : 'bg-arcade-black text-white border-2 border-transparent'}`}>{level}</button>
									))}
								</div>
							</div>

							{/* Invisible pieces */}
							<div className="mb-6 w-full">
								<label className="block text-neon-cyan font-arcade text-lg mb-2">Invisible pieces</label>
								<label className="relative inline-flex items-center cursor-pointer">
									<input type="checkbox" checked={invisiblePieces} onChange={() => setInvisiblePieces(!invisiblePieces)} className="sr-only peer"/>
									<div className="w-11 h-6 bg-arcade-purple border-2 border-neon-magenta rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-neon-cyan after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-neon-cyan after:border-neon-cyan after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-red peer-checked:border-neon-red"></div>
								</label>
							</div>

							{/* Time limit */}
							<div className="mb-6 w-full">
								<label className="block text-neon-cyan font-arcade text-lg mb-2">Time limit (minutes)</label>
								<input type="range" min="0" max={timeOptions.length - 1} step="1" value={timeOptions.indexOf(timeLimit)} onChange={(e) => setTimeLimit(timeOptions[Number(e.target.value)])} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"/>
								<div className="relative w-full mt-2 h-4">
									{timeOptions.map((minutes, index) => {
									const position = (index / (timeOptions.length - 1)) * 100;
									return (
										<span key={minutes} className="absolute text-neon-red font-arcade text-sm" style={{left: `${position}%`, transform: 'translateX(-50%)'}}>{minutes}</span>
									);
									})}
								</div>
								<p className="text-center text-neon-red font-arcade text-xl mt-2">{timeLimit} min</p>
							</div>

							{/* Btn start game*/}
							<button type="submit" className="mt-2 px-6 py-3 bg-arcade-purple text-neon-cyan font-arcade text-xl border-4 border-neon-purple rounded-lg shadow-[0_0_10px_#00F7FF,0_0_20px_#9C27B0] animate-arcade-pulse transition-all duration-200 hover:scale-105 hover:shadow-[0_0_15px_#00F7FF,0_0_25px_#9C27B0] active:translate-y-1">
								<FontAwesomeIcon icon={faPlay} className="text-neon-cyan text-2xl mr-3"/>Start the game
							</button>
						</form>
					</div>
				</div>
            </main>
        </div>
    );
}