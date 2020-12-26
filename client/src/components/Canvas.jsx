import { useEffect } from 'react'

import { useSocket } from '../contexts/socketContext'

const Canvas = () => {
	const socket = useSocket()

	useEffect(() => {
		if (socket == null) return

		socket.emit('join')

		socket.on('joined', msg => {
			console.log(msg);
		})
	}, [socket])

	return null
}

export default Canvas
