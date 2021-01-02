import React, { useEffect, useState } from 'react'

import { useSocket } from '../contexts/socketContext'

import ListGroup from 'react-bootstrap/ListGroup'

const PlayerList = () => {
	const socket = useSocket()

	const [players, setPlayers] = useState([])

	useEffect(() => {
		if (socket == null) return

		socket.on('player', (newPlayers) => {
			setPlayers(newPlayers)
		})
	}, [socket])

	return (
		<ListGroup>
			{
				players.map((p) => (
					<ListGroup.Item
						key={p.id}
						className='d-flex justify-content-between'>
						{
							socket.id === p.id ?
								<b>{p.username} (You)</b> :
								<span>{p.username}</span>
						}

						<span>{p.score}</span>
					</ListGroup.Item>
				))
			}
		</ListGroup>
	)
}

export default PlayerList
