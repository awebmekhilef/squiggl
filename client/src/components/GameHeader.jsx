import React from 'react'

import TimerDisplay from './TimerDisplay'

const GameHeader = ({ seconds, isDrawer, word, hasGuessedWord, round }) => {
	return (
		<div className='d-flex justify-content-around bg-light w-100 pt-3 pb-2'>
			<TimerDisplay seconds={seconds} />

			{
				word === '' ?
					<h5 className='text-monospace'>Waiting for other players...</h5> :
					(
						isDrawer ?
							<h5 className='text-monospace'>Your word is {word}</h5> :
							<h5 className='text-monospace'>
								{
									hasGuessedWord ?
										`You have guessed the word!` :
										word.split('').map(() => (
											`_ `
										))
								}
							</h5>
					)
			}

			<h5 className='text-monospace'>Round: {round}/3</h5>
		</div >
	)
}

export default GameHeader
