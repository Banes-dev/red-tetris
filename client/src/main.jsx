import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux"
import {CookiesProvider} from "react-cookie";
import {store} from "./store/store"

import "./index.css"
import App from "./App.jsx"

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<CookiesProvider>
					<App/>
				</CookiesProvider>
			</Provider>
		</BrowserRouter>
	</React.StrictMode>
);
