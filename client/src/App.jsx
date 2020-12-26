import React, { useState } from 'react'

import { useSocket } from './contexts/socketContext'

import Container from 'react-bootstrap/Container'

import Canvas from './components/Canvas'
import UsernamePrompt from './components/UsernamePrompt'
import PlayerList from './components/PlayerList'

const App = () => {
	const socket = useSocket()

	const [hasJoined, setHasJoined] = useState(false)

	const handleJoin = (username) => {
		setHasJoined(true)
		socket.emit('join', username)
	}

	return (
		<Container fluid>
			{
				hasJoined ?
					(
						<>
							<Canvas />
							<PlayerList />
						</>
					) :
					<UsernamePrompt onSubmit={handleJoin} />
			}
		</Container>
	)
}

export default App
