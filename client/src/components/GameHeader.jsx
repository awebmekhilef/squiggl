import React from 'react'

import TimerDisplay from './TimerDisplay'

const GameHeader = ({ seconds }) => {
	return (
		<div className='d-flex justify-content-around bg-light w-100 pt-3 pb-2'>
			<TimerDisplay seconds={seconds} />
			<h5>Waiting for other players...</h5>
			<h5>Round: 1/3</h5>
		</div>
	)
}

export default GameHeader
