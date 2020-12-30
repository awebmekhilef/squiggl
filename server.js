const io = require('socket.io')(5000)

let players = []
let drawingCache = []

io.on('connection', (sckt) => {
	sckt.on('join', (username) => onPlayerJoin(sckt, username))
	sckt.on('disconnect', () => onPlayerLeave(sckt))
	sckt.on('clear', () => onCanvasClear())
	sckt.on('chat', (msg) => onRecieveChat(sckt, msg))
	sckt.on('draw', (data) => onDraw(sckt, data))
})

const onPlayerJoin = (socket, username) => {
	players.push({
		id: socket.id,
		username
	})

	// Send the cached drawing
	socket.emit('join', drawingCache)

	// Update player list
	io.emit('player', players)
}

const onPlayerLeave = (socket) => {
	// Remove player
	players = players.filter((p) => {
		return p.id !== socket.id
	})

	io.emit('player', players)

	// If no more players erase drawing cache
	if (players.length === 0)
		drawingCache = []
}

const onDraw = (socket, data) => {
	socket.broadcast.emit('draw', data)
	drawingCache.push(data)
}

const onCanvasClear = () => {
	io.emit('clear')
	drawingCache = []
}

const onRecieveChat = (socket, msg) => {
	// Get player that sent message
	const sender = players.find((p) => {
		return p.id === socket.id
	})

	socket.broadcast.emit('chat', {
		from: sender.username,
		msg
	})
}
