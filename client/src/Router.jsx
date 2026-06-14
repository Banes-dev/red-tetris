import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import SoloParam from "./pages/SoloParam";
import SoloGame from "./pages/SoloGame";
import Rooms from "./pages/Rooms"
import MultiParam from "./pages/MultiParam";
import GamePage from "./games/GamePage";
// import GameGrid from "./game/GameGrid";

export default function Router()
{
	return (
		<Routes>
			{/* <Route element={<Home/>}> */}
				<Route path="/" element={<Home/>}/>
				<Route path="/solo_param" element={<SoloParam/>}/>
				<Route path="/solo-game/:gravityLevel/:invisiblePieces/:timeLimit" element={<SoloGame/>}/>
				<Route path="/rooms" element={<Rooms/>}/>
				<Route path="/multi_param" element={<MultiParam/>}/>
				<Route path="/:paramRoomId/:paramPlayerName" element={<GamePage/>}/>
				{/* <Route path="/game" element={<GameGrid/>}/> */}
			{/* </Route> */}
		</Routes>
	);
}
