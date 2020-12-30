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

	useEffect(() => {
		if (socket == null) return

	}, [socket])

	return (
		<div className='gameContainer'>
			<Row className='mt-5'>
				<GameHeader
					seconds={0} />
			</Row>
			<Row className='mt-4'>
				<Col>
					<PlayerList />
				</Col>
				<Col>
					<Canvas isDrawer={true} />
				</Col>
				<Col>
					<ChatBox />
				</Col>
			</Row>
		</div>
	)
}

export default GameContainer
