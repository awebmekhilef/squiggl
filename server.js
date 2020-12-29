const io = require('socket.io')(5000)

let players = []
let drawingCache = []
let gameStarted = false
let currentPlayerIndex = 0

io.on('connection', (socket) => {
	socket.on('join', (username) => {
		players.push({
			id: socket.id,
			username
		})

		if (!gameStarted && players.length > 1) {
			io.emit('nextTurn', players[currentPlayerIndex])
			gameStarted = true
		}

		socket.emit('join', drawingCache)
		io.emit('player', players)
	})

	socket.on('disconnect', () => {
		players = players.filter((p) => {
			return p.id !== socket.id
		})

		if (players.length < 2) {
			io.emit('endGame')
			gameStarted = false
			currentPlayerIndex = 0
		}

		io.emit('player', players)

		if (players.length === 0)
			drawingCache = []
	})

	socket.on('nextTurn', () => {
		currentPlayerIndex++

		if (currentPlayerIndex > players.length - 1)
			currentPlayerIndex = 0

		io.emit('nextTurn', players[currentPlayerIndex])
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