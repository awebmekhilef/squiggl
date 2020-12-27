import React, { useState } from 'react'

import { useSocket } from './contexts/socketContext'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Canvas from './components/Canvas'
import UsernamePrompt from './components/UsernamePrompt'
import PlayerList from './components/PlayerList'
import ChatBox from './components/ChatBox'

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
						<Row className = 'gameContainer mt-5'>
							<Col>
								<PlayerList />
							</Col>
							<Col>
								<Canvas />
							</Col>
							<Col>
								<ChatBox />
							</Col>
						</Row>
					) :
					<UsernamePrompt onSubmit={handleJoin} />
			}
		</Container>
	)
}

export default App
