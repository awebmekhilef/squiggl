const io = require('socket.io')(5000)

const wordlist = require('./wordlist')

let players = []
let drawingCache = []
let hasGameStarted = false
let currDrawerIndex = 0

let timer
let counter

const TURN_TIME = 10

io.on('connection', (sckt) => {
	sckt.on('join', (username) => onPlayerJoin(sckt, username))
	sckt.on('disconnect', () => onPlayerLeave(sckt))
	sckt.on('clear', () => onCanvasClear())
	sckt.on('chat', (msg) => onRecieveChat(sckt, msg))
	sckt.on('draw', (data) => onDraw(sckt, data))
})

// ================= CALLBACK =================

const onPlayerJoin = (socket, username) => {
	players.push({
		id: socket.id,
		username 
	})

	io.emit('chat', {
		from: 'Host',
		msg: `${username} joined`,
		color: 'green'
	})

	if (canStartGame())
		startGame()

	// Send the cached drawing and current drawer
	socket.emit('join', drawingCache)

	// Update player list
	io.emit('player', players)
}

const onPlayerLeave = (socket) => {
	// Get player that left
	const player = players.find((p) => {
		return p.id === socket.id
	})

	io.emit('chat', {
		from: 'Host',
		msg: `${player.username} left`,
		color: 'firebrick'
	})

	// Remove player
	players = players.filter((p) => {
		return p.id !== socket.id
	})

	currDrawerIndex--

	if (shouldEndGame())
		endGame()
	else
		nextTurn()

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

	io.emit('chat', {
		from: sender.username,
		msg
	})
}

// ================= GAME MANAGEMENT =================

const startGame = () => {
	hasGameStarted = true
	currDrawerIndex = 0

	const player = players[currDrawerIndex]

	io.emit('startGame', player)
	emitDrawer(player.username)

	startTimer()
}

const endGame = () => {
	hasGameStarted = false
	clearInterval(timer)
	io.emit('endGame')
}

const nextTurn = () => {
	clearInterval(timer)

	currDrawerIndex++
	if (currDrawerIndex > players.length - 1)
		currDrawerIndex = 0

	const player = players[currDrawerIndex]

	io.emit('nextTurn', player)
	emitDrawer(player.username)

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
			nextTurn()
	}, 1000)
}

const emitDrawer = (username) => {
	io.emit('chat', {
		from: 'Host',
		msg: `${username} is drawing`,
		color: 'mediumblue'
	})
}

// ================= GAMEPLAY =================

const getRandomWord = () => {
	return wordlist[Math.floor(Math.random() * wordlist.length)]
}