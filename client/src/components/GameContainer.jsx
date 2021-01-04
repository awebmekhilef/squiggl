import React, { useEffect, useState } from 'react'

import { useSocket } from '../contexts/socketContext'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import GameHeader from './GameHeader'
import Canvas from './Canvas'
import PlayerList from './PlayerList'
import ChatBox from './ChatBox'
import Leaderboard from './Leaderboard'

const GameContainer = () => {
	const socket = useSocket()

	const [isDrawer, setIsDrawer] = useState(false)
	const [hasGuessedWord, setHasGuessedWord] = useState(false)
	const [word, setWord] = useState('')
	const [timer, setTimer] = useState(0)
	const [round, setRound] = useState(0)
	const [leaderboard, setLeaderboard] = useState([])
	const [showLeaderboard, setShowLeaderboard] = useState(false)

	useEffect(() => {
		if (socket == null) return

		socket.on('startGame', handleTurn)
		socket.on('nextTurn', handleTurn)
		socket.on('nextRound', handleNextRound)
		socket.on('join', handleJoin)
		socket.on('tick', setTimer)
		socket.on('correctGuess', handleCorrectGuess)
		socket.on('resetGame', handleResetGame)
		socket.on('leaderboard', handleLeaderboard)
	}, [socket])

	const handleJoin = ({ word, round }) => {
		setRound(round)
		setWord(word)
	}

	const handleTurn = ({ id, word }) => {
		id === socket.id ? setIsDrawer(true) : setIsDrawer(false)
		setShowLeaderboard(false)
		setHasGuessedWord(false)
		setWord(word)
	}

	const handleNextRound = () => {
		setRound((prevRound) => ++prevRound)
	}

	const handleCorrectGuess = () => {
		setHasGuessedWord(true)
	}

	const handleResetGame = () => {
		setHasGuessedWord(false)
		setIsDrawer(false)
		setTimer(0)
		setRound(0)
		setWord('')
	}

	const handleLeaderboard = (leaderboard) => {
		setLeaderboard(leaderboard)
		setShowLeaderboard(true)
	}

	return (
		<div className='gameContainer'>
			<Leaderboard
				players={leaderboard}
				show={showLeaderboard} />

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
					<ChatBox isDrawer={isDrawer} hasGuessedWord={hasGuessedWord} />
				</Col>
			</Row>
		</div>
	)
}

export default GameContainer
