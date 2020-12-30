const io = require('socket.io')(5000)

let players = []
let drawingCache = []

io.on('connection', (socket) => {
	socket.on('join', (username) => {
		players.push({
			id: socket.id,
			username
		})

		socket.emit('join', drawingCache)
		io.emit('player', players)
	})

	socket.on('disconnect', () => {
		players = players.filter((p) => {
			return p.id !== socket.id
		})

		io.emit('player', players)

		if (players.length === 0)
			drawingCache = []
	})

	socket.on('draw', (data) => {
		socket.broadcast.emit('draw', data)
		drawingCache.push(data)
	})

	socket.on('clear', () => {
		io.emit('clear')
		drawingCache = []
	})

	socket.on('chat', (msg) => {
		const player = players.find((p) => {
			return p.id === socket.id
		})

		socket.broadcast.emit('chat', {
			from: player.username,
			msg
		})
	})
})
