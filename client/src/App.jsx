import React, { useEffect } from 'react'

import { useSocket } from './contexts/socketContext'

import Container from 'react-bootstrap/Container'
import GameContainer from './components/GameContainer'

const App = () => {
	const socket = useSocket()

	useEffect(() => {
		if (socket == null) return

		// TODO : Make into a proper form component
		let name
		do {
			name = prompt('What is your name', 'test')?.trim();
		} while (name == null || name === '');

		socket.emit('join', name)
	}, [socket])

	return (
		<Container fluid>
			<GameContainer />
		</Container>
	)
}

export default App
