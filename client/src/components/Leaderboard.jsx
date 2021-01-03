import React from 'react'

import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'

const Leaderboard = ({ id, players, show }) => {
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
						players.map((p) => (
							<ListGroup.Item
								key={p.id}
								className='d-flex justify-content-between'>
								{
									id === p.id ?
										<b>{p.username} (You)</b> :
										<span>{p.username}</span>
								}

								<span>{p.score}</span>
							</ListGroup.Item>
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
