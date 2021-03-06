import { useEffect, useState, useRef } from 'react'

import { useSocket } from '../contexts/socketContext'

import Button from 'react-bootstrap/Button'

const Canvas = ({ isDrawer }) => {
	const canvasRef = useRef()
	const socket = useSocket()

	const [isDrawing, setIsDrawing] = useState(false)
	const [coords, setCoords] = useState({ x: 0, y: 0 })

	useEffect(() => {
		resetCanvas()
	}, [])

	useEffect(() => {
		if (socket == null) return

		socket.on('join', ({ drawingCache }) => {
			drawingCache.forEach((d) => drawLine(d.x0, d.y0, d.x1, d.y1, false))
		})

		socket.on('draw', ({ x0, y0, x1, y1 }) => {
			drawLine(x0, y0, x1, y1, false)
		})

		socket.on('clear', () => {
			resetCanvas()
		})
	}, [socket])

	const startDrawing = (e) => {
		setIsDrawing(true)
		setCoords(getFinalCoords(e))
	}

	const stopDrawing = (e) => {
		// Draw a single point
		const c = getFinalCoords(e)

		if (isDrawing && isDrawer) {
			drawLine(
				c.x, c.y,
				c.x, c.y,
				true
			)
		}

		setIsDrawing(false)
	}

	const mouseMove = (e) => {
		if (!isDrawing || !isDrawer) return

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

	const clearCanvas = () => {
		isDrawer && socket.emit('clear')
	}

	const resetCanvas = () => {
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')

		ctx.fillStyle = '#FFF'
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		ctx.strokeStyle = '#000'
		ctx.lineCap = 'round'
		ctx.lineWidth = 8
	}

	const getFinalCoords = (e) => {
		const canvas = canvasRef.current

		return {
			x: e.clientX - canvas.getBoundingClientRect().left,
			y: e.clientY - canvas.getBoundingClientRect().top
		}
	}

	return (
		<>
			<canvas
				ref={canvasRef}
				className={'rounded ' + (isDrawer ? 'canvasDraw' : 'canvasDisable')}
				width={600} height={450}
				onMouseDown={startDrawing} onMouseMove={mouseMove}
				onMouseUp={stopDrawing} onMouseOut={stopDrawing}
			/>

			<Button
				variant='danger'
				onClick={clearCanvas}
			>
				Clear
			</Button>
		</>
	)
}

export default Canvas
