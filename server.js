const io = require('socket.io')(5000)

let players = []

io.on('connection', (socket) => {
	socket.on('join', (username) => {
		players.push({
			id: socket.id,
			username
		})

		io.emit('player', players)
	})

	socket.on('disconnect', () => {
		players = players.filter((p) => {
			return p.id !== socket.id
		})

		io.emit('player', players)
	})

	socket.on('draw', (data) => {
		socket.broadcast.emit('draw', data)
	})

	socket.on('clear', () => {
		io.emit('clear')
	})

	socket.on('chat', (msg) => {
		const from = players.find((p) => {
			return p.id === socket.id
		}).username

		socket.broadcast.emit('chat', {
			from,
			msg
		})
	})
})