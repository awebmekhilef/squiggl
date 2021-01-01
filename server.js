const io = require('socket.io')(5000)

const wordlist = require('./wordlist')

let players = []
let playersGuessed = 0
let drawingCache = []
let hasGameStarted = false
let currDrawerIndex = 0
let word = ''

let timer
let counter

const TURN_TIME = 60

io.on('connection', (sckt) => {
	sckt.on('join', (username) => onPlayerJoin(sckt, username))
	sckt.on('disconnect', () => onPlayerLeave(sckt))
	sckt.on('clear', () => clearCanvas())
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
	socket.emit('join', { drawingCache, word })

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

	if (players.length === 0 || shouldEndGame())
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

const clearCanvas = () => {
	drawingCache = []
	io.emit('clear')
}

const onRecieveChat = (socket, msg) => {
	// Get player that sent message
	const sender = players.find((p) => {
		return p.id === socket.id
	})

	// Player correctly guessed word
	if (hasGameStarted && msg === word) {
		io.emit('chat', {
			from: 'Host',
			msg: `${sender.username} guessed the word!`,
			color: 'lime'
		})

		socket.emit('correctGuess')

		// All players have guessed correctly
		if (++playersGuessed >= players.length - 1) {
			io.emit('chat', {
				from: 'Host',
				msg: `The word was ${word}`,
				color: 'saddlebrown'
			})

			nextTurn()
		}

		return
	}

	io.emit('chat', {
		from: sender.username,
		msg
	})
}

// ================= GAME MANAGEMENT =================

const startGame = () => {
	hasGameStarted = true
	currDrawerIndex = 0

	clearCanvas()

	const player = players[currDrawerIndex]
	word = getRandomWord()

	io.emit('startGame', {
		id: player.id,
		word
	})
	emitDrawer(player.username)

	startTimer()
}

const endGame = () => {
	clearInterval(timer)

	hasGameStarted = false
	word = ''

	clearCanvas()
	io.emit('endGame')
}

const nextTurn = () => {
	clearInterval(timer)
	playersGuessed = 0

	currDrawerIndex++
	if (currDrawerIndex > players.length - 1)
		currDrawerIndex = 0

	clearCanvas()

	const player = players[currDrawerIndex]
	word = getRandomWord()

	io.emit('nextTurn', {
		id: player.id,
		word
	})
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
		msg: `${username} is now drawing`,
		color: 'mediumblue'
	})
}

// ================= GAMEPLAY =================

const getRandomWord = () => {
	return wordlist[Math.floor(Math.random() * wordlist.length)]
}