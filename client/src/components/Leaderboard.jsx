import React from 'react'

import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'

import LeaderboardItem from './LeaderboardItem'

const Leaderboard = ({ players, show }) => {
	return (
		<Modal
			centered
			show={show}
			backdrop='static'
			keyboard={false}
		>
			<Modal.Header>
				<Modal.Title>Leaderboard</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<ListGroup>
					{
						players.map((p, i) => (
							<LeaderboardItem
								key={p.id}
								index={i + 1}
								username={p.username}
								score={p.score} />
						))
					}
				</ListGroup>
			</Modal.Body>

			<Modal.Footer>
				<span className='text-muted'>Restarting game in a while...</span>
			</Modal.Footer>
		</Modal>
	)
}

export default Leaderboard
