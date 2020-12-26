import { useEffect, useState, useRef } from 'react'

import { useSocket } from '../contexts/socketContext'

const Canvas = () => {
	const canvasRef = useRef()
	const socket = useSocket()

	const [isDrawing, setIsDrawing] = useState(false)
	const [coords, setCoords] = useState({ x: 0, y: 0 })

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')

		ctx.fillStyle = '#FFF'
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		ctx.strokeStyle = '#000'
		ctx.lineCap = 'round'
		ctx.lineWidth = 8
	}, [])

	useEffect(() => {
		if (socket == null) return
		
		socket.on('draw', ({ x0, y0, x1, y1 }) => {
			drawLine(x0, y0, x1, y1, false)
		})
	}, [socket])

	const startDrawing = (e) => {
		setIsDrawing(true)
		setCoords(getFinalCoords(e))
	}

	const stopDrawing = (e) => {
		// Draw a single point
		const c = getFinalCoords(e)

		if (isDrawing) {
			drawLine(
				c.x, c.y,
				c.x, c.y,
				true
			)
		}

		setIsDrawing(false)
	}

	const mouseMove = (e) => {
		if (!isDrawing) return

		const newCoords = getFinalCoords(e)

		drawLine(
			coords.x, coords.y,
			newCoords.x, newCoords.y,
			true
		)

		setCoords(newCoords)
	}

	const drawLine = (x0, y0, x1, y1, emit) => {
		const ctx = canvasRef.current.getContext('2d')

		ctx.beginPath()
		ctx.moveTo(x0, y0)
		ctx.lineTo(x1, y1)
		ctx.stroke()

		if (emit) {
			socket.emit('draw', {
				x0, y0,
				x1, y1
			})
		}
	}

	const getFinalCoords = (e) => {
		const canvas = canvasRef.current

		return {
			x: e.clientX - canvas.offsetLeft,
			y: e.clientY - canvas.offsetTop,
		}
	}

	return (
		<canvas
			ref={canvasRef}
			className='rounded'
			width={600} height={450}
			onMouseDown={startDrawing} onMouseMove={mouseMove}
			onMouseUp={stopDrawing} onMouseOut={stopDrawing}
		/>
	)
}

export default Canvas
