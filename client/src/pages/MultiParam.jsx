import {useState} from "react";
import {useDispatch} from "react-redux"
import {Link, useNavigate} from "react-router-dom";
import {setState, setMe, setRoomId} from "../store/game_slice"
import {socket} from "../socket/socket"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleLeft, faPlus, faLock, faLockOpen} from "@fortawesome/free-solid-svg-icons";

export default function MultiParam() {
	const dispatch = useDispatch()
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState('');

    // Paramètres de la room
    const [roomName, setRoomName] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [gravityLevel, setGravityLevel] = useState(1);
    const [invisiblePieces, setInvisiblePieces] = useState(false);
    const [timeLimit, setTimeLimit] = useState(2);
    const [playerLimit, setPlayerLimit] = useState(4);
    const [isPrivate, setIsPrivate] = useState(false);
    const [roomPassword, setRoomPassword] = useState('');

    const timeOptions = [1, 2, 3, 5, 8, 10, 15];
    const playerLimitOptions = [2, 3, 4, 5, 6, 8, 10];

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log({
        //     roomName,
        //     playerName,
        //     gravityLevel,
        //     invisiblePieces,
        //     timeLimit,
        //     playerLimit,
        //     isPrivate,
        //     roomPassword: isPrivate ? roomPassword : null
        // });
		// Create room
		socket.emit("create_room", {
			roomName,
			playerName,
			gravityLevel,
			invisiblePieces,
			timeLimit,
			playerLimit,
			isPrivate,
			roomPassword: isPrivate ? roomPassword : null
		}, (response) => {
            if (response.success) {
				dispatch(setState({players: response.players, leader: response.leader, status: response.status}))
				dispatch(setMe(socket.id))
				dispatch(setRoomId(roomName))
                navigate(`/${roomName}/${playerName}`);
				setErrorMessage("");
			}
            else {
                console.error("Server error :", response.message);
				setErrorMessage(response.message || "An error occurred while creating the room.");
            }
        })
    };

    return (
        <div className="w-full min-h-screen flex flex-col hidden-scrollbar relative">
            {/* Background color */}
            <div className="absolute top-0 inset-0 -z-10 bg-arcade-black"></div>

            {/* Background image */}
            <div className="absolute inset-0 -z-10 opacity-20">
                <img src="/background.jpg" alt="Background" className="w-full h-full object-cover" loading="eager" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-arcade-purple/20 to-arcade-black"></div>
            </div>

            {/* Game title */}
            <div className="absolute flex flex-row items-center justify-center w-full p-2 md:p-6 mt-8 md:mt-0">
                <img src="/red-tetris_logo.png" alt="Tetris Logo" className="w-24 md:w-36 mr-6 mb-0" loading="eager" />
                <h1 className="text-2xl md:text-5xl font-bold text-neon-red font-arcade text-center animate-flicker">red-tetris</h1>
            </div>

            <main className="flex flex-col items-center justify-center w-full min-h-screen overflow-hidden pt-40 pb-20">
                <Link to="/rooms" className="absolute top-0 left-0 w-36 h-12 flex items-center justify-center rounded-br-lg bg-arcade-black border-b-4 border-r-4 border-neon-blue font-arcade text-base text-white animate-slide_in_right transition-all duration-200 hover:scale-105">
                <FontAwesomeIcon icon={faCircleLeft} className="text-neon-blue text-lg mr-2" /> return</Link>

                <div className="flex flex-col items-center justify-center flex-grow w-full">
                    <div className="flex flex-col items-center justify-center w-10/12 md:w-7/12 h-auto py-8 rounded-lg bg-arcade-black border-4 border-neon-yellow animate-slide_in_up">
                        {/* Formulaire de création de room */}
                        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full px-6 md:px-12">
                            {/* Room Name */}
                            <div className="mb-6 w-full">
                                <label className="block text-neon-cyan font-arcade text-lg mb-2">Room Name</label>
                                <input
                                    type="text"
                                    value={roomName}
									maxLength={16}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    className="w-full px-4 py-2 bg-arcade-black border-2 border-neon-purple rounded-lg text-neon-red font-arcade focus:outline-none focus:border-neon-cyan"
                                    required
                                />
                            </div>

                            {/* Player Name */}
                            <div className="mb-6 w-full">
                                <label className="block text-neon-cyan font-arcade text-lg mb-2">Player Name</label>
                                <input
                                    type="text"
                                    value={playerName}
									maxLength={16}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    className="w-full px-4 py-2 bg-arcade-black border-2 border-neon-purple rounded-lg text-neon-red font-arcade focus:outline-none focus:border-neon-cyan"
                                    required
                                />
                            </div>

                            {/* Gravity Level */}
                            <div className="mb-6 w-full">
                                <label className="block text-neon-cyan font-arcade text-lg mb-2">Gravity Level</label>
                                <div className="flex justify-between">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setGravityLevel(level)}
                                            className={`px-4 py-2 rounded-lg font-arcade text-xl cursor-pointer ${
                                                gravityLevel === level
                                                    ? 'bg-arcade-purple text-neon-cyan border-2 border-neon-purple'
                                                    : 'bg-arcade-black text-white border-2 border-transparent'
                                            }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Invisible Pieces */}
                            <div className="mb-6 w-full">
                                <label className="block text-neon-cyan font-arcade text-lg mb-2">Invisible Pieces</label>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={invisiblePieces} onChange={() => setInvisiblePieces(!invisiblePieces)} className="sr-only peer"/>
                                    <div className="w-11 h-6 bg-arcade-purple border-2 border-neon-magenta rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-neon-cyan after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-neon-cyan after:border-neon-cyan after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-red peer-checked:border-neon-red"></div>
                                </label>
                            </div>

                            {/* Time Limit */}
                            <div className="mb-6 w-full">
                                <label className="block text-neon-cyan font-arcade text-lg mb-2">Time Limit (minutes)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max={timeOptions.length - 1}
                                    step="1"
                                    value={timeOptions.indexOf(timeLimit)}
                                    onChange={(e) => setTimeLimit(timeOptions[Number(e.target.value)])}
                                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="relative w-full mt-2 h-4">
                                    {timeOptions.map((minutes, index) => {
                                        const position = (index / (timeOptions.length - 1)) * 100;
                                        return (
                                            <span key={minutes} className="absolute text-neon-red font-arcade text-sm" style={{ left: `${position}%`, transform: 'translateX(-50%)' }}>{minutes}</span>
                                        );
                                    })}
                                </div>
                                <p className="text-center text-neon-red font-arcade text-xl mt-2">{timeLimit} min</p>
                            </div>

                            {/* Player Limit */}
                            <div className="mb-6 w-full">
                                <label className="block text-neon-cyan font-arcade text-lg mb-2">Player Limit</label>
                                <input
                                    type="range"
                                    min="0"
                                    max={playerLimitOptions.length - 1}
                                    step="1"
                                    value={playerLimitOptions.indexOf(playerLimit)}
                                    onChange={(e) => setPlayerLimit(playerLimitOptions[Number(e.target.value)])}
                                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="relative w-full mt-2 h-4">
                                    {playerLimitOptions.map((limit, index) => {
                                        const position = (index / (playerLimitOptions.length - 1)) * 100;
                                        return (
                                            <span key={limit} className="absolute text-neon-red font-arcade text-sm" style={{ left: `${position}%`, transform: 'translateX(-50%)' }}>{limit}</span>
                                        );
                                    })}
                                </div>
                                <p className="text-center text-neon-red font-arcade text-xl mt-2">{playerLimit} players</p>
                            </div>

                            {/* Public/Private */}
                            <div className="mb-6 w-full">
                                <label className="block text-neon-cyan font-arcade text-lg mb-2">Room Visibility</label>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} className="sr-only peer"/>
                                    <div className="w-11 h-6 bg-arcade-purple border-2 border-neon-magenta rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-neon-cyan after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-neon-cyan after:border-neon-cyan after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-red peer-checked:border-neon-red"></div>
                                    <span className="ml-3 text-neon-cyan font-arcade">
                                        {isPrivate ? (
                                            <FontAwesomeIcon icon={faLock} className="mr-2" />
                                        ) : (
                                            <FontAwesomeIcon icon={faLockOpen} className="mr-2" />
                                        )}
                                        {isPrivate ? 'Private' : 'Public'}
                                    </span>
                                </label>
                                {isPrivate && (
                                    <div className="mt-4">
                                        <label className="block text-neon-cyan font-arcade text-lg mb-2">Room Password</label>
                                        <input
                                            type="password"
                                            value={roomPassword}
                                            onChange={(e) => setRoomPassword(e.target.value)}
                                            className="w-full px-4 py-2 bg-arcade-black border-2 border-neon-purple rounded-lg text-neon-red font-arcade focus:outline-none focus:border-neon-cyan"
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Bouton Create Room */}
                            <button type="submit" className="mt-6 px-6 py-3 bg-arcade-purple text-neon-cyan font-arcade text-xl border-4 border-neon-purple rounded-lg shadow-[0_0_10px_#00F7FF,0_0_20px_#9C27B0] animate-arcade-pulse transition-all duration-200 hover:scale-105 hover:shadow-[0_0_15px_#00F7FF,0_0_25px_#9C27B0] active:translate-y-1">
                            <FontAwesomeIcon icon={faPlus} className="text-neon-cyan text-2xl mr-3"/>Create Room</button>

							{errorMessage && (
								<p className="mt-4 text-neon-red font-arcade text-center text-lg animate-pulse">{errorMessage}</p>
							)}
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}