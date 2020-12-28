import React, { useEffect, useState } from 'react'

import { useSocket } from '../contexts/socketContext'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Canvas from './Canvas'
import PlayerList from './PlayerList'
import ChatBox from './ChatBox'

const GameContainer = () => {
	const socket = useSocket()

	const [isDrawer, setIsDrawer] = useState(false)

	useEffect(() => {
		if (socket == null) return

		// For now enable drawing if players more than one
		socket.on('startGame', () => setIsDrawer(true))
		socket.on('endGame', () => setIsDrawer(false))
	}, [socket])

	return (
		<Row className='gameContainer mt-5'>
			<Col>
				<PlayerList />
			</Col>
			<Col>
				<Canvas isDrawer={isDrawer}/>
			</Col>
			<Col>
				<ChatBox />
			</Col>
		</Row>
	)
}

export default GameContainer
