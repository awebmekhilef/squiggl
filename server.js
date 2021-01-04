const express = require('express')
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)
const path = require('path')

const wordlist = require('./wordlist')

server.listen(process.env.PORT || 5000)

app.use(express.static(path.join(__dirname, 'client/build')))
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

// {id, username, score}
let players = []
let playersGuessed = []
let drawingCache = []
let hasGameStarted = false
let currDrawerIndex = 0
let round = 0
let word = ''

let timer
let counter

const TURN_TIME = 60
const MAX_ROUNDS = 1
const BASE_GUESSER_SCORE = 300
const MIN_GUESSER_SCORE = 50
const MAX_DRAWER_SCORE = 200
const SCORE_INCREMENT = 50

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
		username,
		score: 0
	})

	io.emit('chat', {
		from: 'Host',
		msg: `${username} joined`,
		color: 'green'
	})

	if (canStartGame())
		startGame()

	// Send the cached drawing and current drawer
	socket.emit('join', { drawingCache, word, round })

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

	currDrawerIndex--

	// Remove player
	players = players.filter((p) => {
		return p.id !== socket.id
	})

	if (shouldresetGame())
		resetGame()
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
		// Player already guessed
		if (playersGuessed.indexOf(socket.id) !== -1)
			return

		addScore(socket.id,
			Math.max(MIN_GUESSER_SCORE, BASE_GUESSER_SCORE - playersGuessed.length * SCORE_INCREMENT))

		io.emit('player', players)
		io.emit('chat', {
			from: 'Host',
			msg: `${sender.username} guessed the word!`,
			color: 'lime'
		})

		socket.emit('correctGuess')
		playersGuessed.push(sender.id)

		// All players have guessed correctly
		if (playersGuessed.length >= players.length - 1) {
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
	nextRound()

	const player = players[currDrawerIndex]
	word = getRandomWord()

	io.emit('player', players)
	io.emit('startGame', {
		id: player.id,
		word
	})
	emitDrawer(player.username)

	startTimer()
}

// When not enough players
const resetGame = () => {
	clearInterval(timer)

	// Reset scores
	players = players.map(p => ({
		...p,
		score: 0
	}))

	hasGameStarted = false
	word = ''
	round = 0

	clearCanvas()
	io.emit('resetGame')
}

// Got through all rounds
const finishGame = () => {
	const playerLeaderboard = [...players].sort((p1, p2) => p1.score < p2.score ? 1 : -1)
	io.emit('leaderboard', playerLeaderboard)

	resetGame()

	setTimeout(() => {
		canStartGame() && startGame()
	}, 10 * 1000) // 10 seconds
}

const nextTurn = () => {
	clearInterval(timer)

	// Give drawer points
	addScore(players[currDrawerIndex].id,
		Math.min(MAX_DRAWER_SCORE, playersGuessed.length * SCORE_INCREMENT))
	io.emit('player', players)

	playersGuessed = []

	currDrawerIndex++
	if (currDrawerIndex > players.length - 1) {
		currDrawerIndex = 0

		if (!nextRound())
			return
	}

	clearCanvas()

	const player = players[currDrawerIndex]
	word = getRandomWord()

	// Just to keep things in sync
	io.emit('nextTurn', {
		id: player.id,
		word
	})
	emitDrawer(player.username)

	startTimer()
}

const nextRound = () => {
	// Game finished
	if (++round > MAX_ROUNDS) {
		finishGame()
		return false
	}

	io.emit('nextRound')
	return true
}

const canStartGame = () => {
	return players.length > 1 &&
		!hasGameStarted
}

const shouldresetGame = () => {
	return players.length < 2
}

const startTimer = () => {
	counter = TURN_TIME
	io.emit('tick', counter)

	timer = setInterval(() => {
		counter--

		if (counter < 0) {
			nextTurn()
			return
		}

		io.emit('tick', counter)
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

const addScore = (id, amount) => {
	for (let i = 0; i < players.length; i++) {
		if (players[i].id === id)
			players[i].score += amount
	}
}