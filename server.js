const io = require('socket.io')(5000)

io.on('connection', (socket) => {
	console.log('A user joined')

	socket.on('join', () => {
		io.emit('joined', 'test')
	})
})