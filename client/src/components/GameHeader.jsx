import React from 'react'

import Timer from './TimerDisplay'

const GameHeader = ({ seconds, drawerName, isDrawer, isGameRunning }) => {
	return (
		<div className='d-flex justify-content-around bg-light w-100 pt-3 pb-2'>
			<Timer seconds={seconds} />
			{
				isGameRunning ?
					(
						<h5>
							{
								isDrawer ?
									`You are drawing` :
									`${drawerName} is drawing`
							}
						</h5>
					) :
					<h5>Waiting for other players...</h5>
			}
			<h5>Round: 0</h5>
		</div>
	)
}

export default GameHeader
