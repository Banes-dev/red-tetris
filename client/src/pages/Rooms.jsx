import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Link, useNavigate} from "react-router-dom";
import {socket} from "../socket/socket"
import {setRooms} from "../store/game_slice"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleLeft, faPlus, faLock, faClock, faEyeSlash, faWeightHanging} from '@fortawesome/free-solid-svg-icons'

export default function Rooms()
{
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState('');

	// Get rooms list
	const dispatch = useDispatch()
	const rooms = useSelector(state => state.game.rooms)

	useEffect(() => {
		socket.emit("get_rooms")

		socket.on("rooms_list", (data) => {
			dispatch(setRooms(data))
		})

		socket.on("room_update", () => {
			socket.emit("get_rooms")
		})

		return () => {
			socket.off("rooms_list")
			socket.off("room_update")
		}
	}, [dispatch])

	const JoinRoom = (roomId, playerName) => {
		socket.emit("join_room", {roomId, playerName}, (response) => {
			if (response.success) {
				navigate(`/${roomId}/${playerName}`);
				setErrorMessage("");
			} else {
				console.error("Server error :", response.message);
				setErrorMessage(response.message || "An error occurred while joining the room.");
			}
		});
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

			<Link to="/" className="absolute top-0 left-0 w-36 h-12 flex items-center justify-center rounded-br-lg bg-arcade-black border-b-4 border-r-4 border-neon-blue font-arcade text-base text-white animate-slide_in_right transition-all duration-200 hover:scale-105"
			><FontAwesomeIcon icon={faCircleLeft} className="text-neon-blue text-lg mr-2"/> return</Link>

			<main className="flex flex-col items-center justify-center w-full min-h-screen overflow-hidden pt-36 md:pt-0 pb-12 md:pb-0">
				<div className="flex flex-col items-center justify-center flex-grow w-full">
					<div className="flex flex-col items-center justify-center w-10/12 md:w-7/12 h-auto py-8 rounded-lg bg-arcade-black border-4 border-neon-yellow animate-slide_in_up">
						{/* Title + button */}
						<div className="flex flex-col md:flex-row md:items-center md:justify-between w-full px-6 mb-12 md:mb-12">
							<h1 className="text-2xl md:text-3xl font-bold text-neon-red font-arcade text-center md:text-left mb-4 md:mb-0">Available Rooms</h1>
							<Link to="/multi_param" className="flex items-center justify-center px-4 py-2 bg-arcade-purple text-neon-cyan font-arcade text-lg border-4 border-neon-purple rounded-lg shadow-[0_0_10px_#00F7FF,0_0_20px_#9C27B0] animate-slide_down_pulse transition-all duration-200 hover:scale-105 hover:shadow-[0_0_15px_#00F7FF,0_0_25px_#9C27B0] active:translate-y-1">
							<FontAwesomeIcon icon={faPlus} className="text-neon-cyan text-xl mr-2" />Create Room</Link>
						</div>

						{/* Rooms list */}
						<div className="w-full max-h-[60vh] overflow-y-auto hidden-scrollbar px-4">
							{errorMessage && (
								<p className="mt-4 text-neon-red font-arcade text-center text-lg animate-pulse">{errorMessage}</p>
							)}
							{rooms.map((room) => (
								// to={`/${room.id}/Banes`}
								<button onClick={() => JoinRoom(room.id, "Banes")} key={room.id} className="w-full p-3 mt-3 mb-3 bg-arcade-purple/30 border-2 border-neon-purple rounded-lg hover:shadow-[0_0_10px_#00F7FF,0_0_20px_#9C27B0] flex flex-col md:flex-row md:items-center md:justify-between transition-all duration-200 hover:scale-101">
									<div className="flex items-center mb-2 md:mb-0">
										{room.isPrivate && <FontAwesomeIcon icon={faLock} className="text-neon-cyan text-lg mr-2"/>}
										<span className="text-neon-cyan font-arcade md:text-lg mr-6 md:mr-8 truncate">{room.id}</span>
										<span className="flex items-center text-neon-orange font-arcade">{room.players}/{room.maxPlayers}</span>
									</div>
									<div className="flex flex-wrap gap-2">
										{room.gravity && (
											<div className="flex items-center px-1 md:px-2 py-1 bg-arcade-black/50 border border-neon-blue rounded text-xs text-neon-blue">
											<FontAwesomeIcon icon={faWeightHanging} className="mr-1"/>Gravity level : {room.gravity}</div>
										)}
										{room.invisible && (
											<div className="flex items-center px-1 md:px-2 py-1 bg-arcade-black/50 border border-neon-green rounded text-xs text-neon-green">
											<FontAwesomeIcon icon={faEyeSlash} className="mr-1"/>Invisible pieces</div>
										)}
										{room.timeLimit && (
											<div className="flex items-center px-1 md:px-2 py-1 bg-arcade-black/50 border border-neon-pink rounded text-xs text-neon-pink">
											<FontAwesomeIcon icon={faClock} className="mr-1"/>{room.timeLimit}min</div>
										)}
									</div>
								</button>
							))}
						</div>
					</div>
				</div>
			</main>
        </div>
    );
}
