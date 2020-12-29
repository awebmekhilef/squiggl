import React, { useEffect, useState } from 'react'

import { useSocket } from '../contexts/socketContext'
import useTimer from '../hooks/useTimer'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import GameHeader from './GameHeader'
import Canvas from './Canvas'
import PlayerList from './PlayerList'
import ChatBox from './ChatBox'

const GameContainer = () => {
	const socket = useSocket()
	const { seconds, start: startTimer } = useTimer({
		onEnd: () => nextTurn()
	})

	const [isDrawer, setIsDrawer] = useState(false)

	useEffect(() => {
		if (socket == null) return

		socket.on('nextTurn', (id) => {
			id === socket.id ? setIsDrawer(true) : setIsDrawer(false)
			startTimer(10)
		})

		socket.on('endGame', () => setIsDrawer(false))
	}, [socket])

	const nextTurn = () => {
		isDrawer && socket?.emit('nextTurn')
	}

	return (
		<div className='gameContainer'>
			<Row className='mt-5'>
				<GameHeader seconds={seconds} />
			</Row>
			<Row className='mt-4'>
				<Col>
					<PlayerList />
				</Col>
				<Col>
					<Canvas isDrawer={isDrawer} />
				</Col>
				<Col>
					<ChatBox />
				</Col>
			</Row>
		</div>
	)
}

export default GameContainer
