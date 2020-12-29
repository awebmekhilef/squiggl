import { useEffect, useState } from 'react'

const useTimer = ({ onEnd }) => {
	const [seconds, setSeconds] = useState(0)

	useEffect(() => {
		if (!seconds) {
			onEnd()
		}

		const timer =
			seconds > 0 &&
			setInterval(tick, 1000)

		return () => clearInterval(timer)
	}, [seconds])

	const start = (secs) => {
		setSeconds(secs)
	}

	const tick = () => {
		setSeconds((prevSeconds) => prevSeconds - 1)
	}

	return { seconds, start }
}

export default useTimer
