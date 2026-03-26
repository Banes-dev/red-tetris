import {Routes, Route} from "react-router-dom";
import Home from "./page/Home";
import SoloParam from "./page/SoloParam";
import GameGrid from "./game/GameGrid";

export default function Router()
{
	return (
		<Routes>
			{/* <Route element={<Home/>}> */}
				<Route path="/" element={<Home/>}/>
				<Route path="/solo_param" element={<SoloParam/>}/>
				{/* <Route path="/salons" element={<Salons/>}/> */}
				{/* <Route path="/multi_param" element={<MultiParam/>}/> */}
				<Route path="/game" element={<GameGrid/>}/>
			{/* </Route> */}
		</Routes>
	);
}
