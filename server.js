const io = require('socket.io')(5000)

let players = []
let drawingCache = []
let hasGameStarted = false
let currDrawerIndex = 0

let timer
let counter

const TURN_TIME = 10

// TODO: When drawer leaves immediately move to next turn
// TODO: Fix game counter running when game not started

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

	if (canStartGame())
		startGame()

	console.log(canStartGame());
	console.log(players);
	console.log(hasGameStarted);

	// Send the cached drawing and current drawer
	socket.emit('join', drawingCache)

	// Update player list
	io.emit('player', players)
}

const onPlayerLeave = (socket) => {
	// Remove player
	players = players.filter((p) => {
		return p.id !== socket.id
	})

	if (shouldEndGame())
		endGame()
	else
		nextTurn(false)

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

const startGame = () => {
	hasGameStarted = true
	currDrawerIndex = 0

	io.emit('startGame', players[currDrawerIndex])

	startTimer()
}

const endGame = () => {
	hasGameStarted = false
	clearInterval(timer)
	io.emit('endGame')
}

const nextTurn = (increment) => {
	clearInterval(timer)

	// Do not increment when a player leaves
	currDrawerIndex += increment ? 1 : 0
	if (currDrawerIndex > players.length - 1)
		currDrawerIndex = 0

	io.emit('nextTurn', players[currDrawerIndex])

	startTimer()
}

const canStartGame = () => {
	return players.length > 1 &&
		!hasGameStarted
}

const shouldEndGame = () => {
	return players.length < 2 &&
		hasGameStarted
}

const startTimer = () => {
	counter = TURN_TIME

	timer = setInterval(() => {
		io.emit('tick', counter)

		counter--
		if (counter < 0)
			nextTurn(true)
	}, 1000)
}
