import React from 'react'

import Timer from './TimerDisplay'

const GameHeader = ({ seconds }) => {
	return (
		<div className='d-flex justify-content-around bg-light w-100 pt-3 pb-2'>
			<Timer seconds={seconds} />
			<h5>Your word is bla bla</h5>
			<h5>Round: 0</h5>
		</div>
	)
}

export default GameHeader
