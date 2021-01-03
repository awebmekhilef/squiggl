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
	const [hasGuessedWord, setHasGuessedWord] = useState(false)
	const [word, setWord] = useState('')
	const [timer, setTimer] = useState(0)
	const [round, setRound] = useState(0)

	useEffect(() => {
		if (socket == null) return

		socket.on('startGame', handleTurn)
		socket.on('nextTurn', handleTurn)
		socket.on('nextRound', handleNextRound)
		socket.on('join', handleJoin)
		socket.on('tick', setTimer)
		socket.on('correctGuess', handleCorrectGuess)
		socket.on('endGame', handleEndGame)
	}, [socket])

	const handleJoin = ({ word, round }) => {
		setRound(round)
		setWord(word)
	}

	const handleTurn = ({ id, word }) => {
		id === socket.id ? setIsDrawer(true) : setIsDrawer(false)
		setHasGuessedWord(false)
		setWord(word)
	}

	const handleNextRound = () => {
		setRound((prevRound) => ++prevRound)
	}

	const handleCorrectGuess = () => {
		setHasGuessedWord(true)
	}

	const handleEndGame = () => {
		setHasGuessedWord(false)
		setIsDrawer(false)
		setTimer(0)
		setRound(0)
		setWord('')
	}

	return (
		<div className='gameContainer'>
			<Row className='mt-5'>
				<GameHeader
					hasGuessedWord={hasGuessedWord}
					isDrawer={isDrawer}
					seconds={timer}
					round={round}
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
					<ChatBox isDrawer={isDrawer} />
				</Col>
			</Row>
		</div>
	)
}

export default GameContainer
