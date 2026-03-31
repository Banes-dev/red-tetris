import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import SoloParam from "./pages/SoloParam";
import Rooms from "./pages/Rooms"
import MultiParam from "./pages/MultiParam";
import GameGrid from "./game/GameGrid";

export default function Router()
{
	return (
		<Routes>
			{/* <Route element={<Home/>}> */}
				<Route path="/" element={<Home/>}/>
				<Route path="/solo_param" element={<SoloParam/>}/>
				<Route path="/rooms" element={<Rooms/>}/>
				<Route path="/multi_param" element={<MultiParam/>}/>
				<Route path="/game" element={<GameGrid/>}/>
			{/* </Route> */}
		</Routes>
	);
}
