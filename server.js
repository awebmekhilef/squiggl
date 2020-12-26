const io = require('socket.io')(5000)

let players = []

io.on('connection', (socket) => {
	socket.on('join', (username) => {
		players.push({
			id: socket.id,
			username
		})

		console.log('join');

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
})