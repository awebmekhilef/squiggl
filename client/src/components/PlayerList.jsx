import React, { useEffect, useState } from 'react'

import { useSocket } from '../contexts/socketContext'

import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'

const PlayerList = () => {
	const socket = useSocket()

	const [players, setPlayers] = useState([])

	useEffect(() => {
		if(socket == null) return

		socket.on('player', (newPlayers) => {
			setPlayers(newPlayers)
		})
	}, [socket])

	return (
		<ListGroup>
			{
				players.map((p) => (
					<ListGroupItem key={p.id}>
						{
							socket.id === p.id ?
								<b>{p.username} (You)</b>:
								`${p.username}`
						}
					</ListGroupItem>
				))
			}
		</ListGroup>
	)
}

export default PlayerList
