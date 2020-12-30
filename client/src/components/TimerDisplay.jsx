import React from 'react'

function getFormattedTime(t) {
	return t < 10 ? `0${t}` : t
}

const TimerDisplay = ({ seconds }) => {
	return (
		<h5>Time left: {getFormattedTime(seconds)}</h5>
	)
}

export default TimerDisplay
