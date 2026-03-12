import express from "express"
import http from "http"
import {Server} from "socket.io"
import cors from "cors"

import {registerGameSocket} from "./socket/game_socket.js"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Red Tetris server running")
})

const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: "*"
	}
})

io.on("connection", (socket) => {
	console.log("player connected:", socket.id)
	registerGameSocket(io, socket)
	socket.on("disconnect", () => {
		console.log("player disconnected:", socket.id)
	})
})

server.listen(3000, () => {
	console.log("server running on port 3000")
})
