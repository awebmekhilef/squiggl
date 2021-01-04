import React from 'react'

import ListGroup from 'react-bootstrap/ListGroup'

const getEmoji = (i) => {
	if (i === 1)
		return '🥇'
	if (i === 2)
		return '🥈'
	if (i === 3)
		return '🥉'

	return ''
}

const LeaderboardItem = ({ index, username, score }) => {
	return (
		<ListGroup.Item
			className='d-flex justify-content-between'
		>
			<span>{getEmoji(index)} <b>#{index}</b> {username}</span>
			<span>{score}</span>
		</ListGroup.Item>
	)
}

export default LeaderboardItem
