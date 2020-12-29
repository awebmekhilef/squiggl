import React, { useEffect, useState } from 'react'

import { useSocket } from '../contexts/socketContext'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import GameHeader from './GameHeader'
import Canvas from './Canvas'
import PlayerList from './PlayerList'
import ChatBox from './ChatBox'

const GameContainer = () => {
	const socket = useSocket()

	const [isDrawer, setIsDrawer] = useState(false)

	useEffect(() => {
		if (socket == null) return

		socket.on('nextTurn', (id) => id === socket.id ? setIsDrawer(true) : setIsDrawer(false))
		socket.on('endGame', () => setIsDrawer(false))
	}, [socket])

	const nextTurn = () => {
		socket.emit('nextTurn')
	}

	return (
		<>
			<Row className='mt-5'>
				<GameHeader />
			</Row>
			<Row className='gameContainer mt-4'>
				<Col>
					<PlayerList />
				</Col>
				<Col>
					<Canvas isDrawer={isDrawer} onNextTurn={nextTurn} />
				</Col>
				<Col>
					<ChatBox />
				</Col>
			</Row>
		</>
	)
}

export default GameContainer
