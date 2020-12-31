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
	const [word, setWord] = useState('')
	const [timer, setTimer] = useState(0)

	useEffect(() => {
		if (socket == null) return

		socket.on('startGame', handleTurn)
		socket.on('nextTurn', handleTurn)
		socket.on('tick', setTimer)
		socket.on('endGame', handleEndGame)
	}, [socket])

	const handleTurn = ({id, word}) => {
		id === socket.id ? setIsDrawer(true) : setIsDrawer(false)
		setWord(word)
	}

	const handleEndGame = () => {
		setIsDrawer(false)
		setTimer(0)
		setWord('')
	}

	return (
		<div className='gameContainer'>
			<Row className='mt-5'>
				<GameHeader
					seconds={timer}
					isDrawer={isDrawer}
					word={word} />
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
