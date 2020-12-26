import { useEffect, useState, useRef } from 'react'

const Canvas = () => {
	const canvasRef = useRef()

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
	}, [canvasRef])

	const startDrawing = (e) => {
		setIsDrawing(true)
		setCoords(getFinalCoords(e))
	}

	const stopDrawing = (e) => {
		// Draw a single point
		if (isDrawing) {
			drawLine(
				e.clientX, e.clientY,
				e.clientX, e.clientY
			)
		}

		setIsDrawing(false)
	}

	const mouseMove = (e) => {
		if (!isDrawing) return

		drawLine(
			coords.x, coords.y,
			e.clientX, e.clientY
		)

		setCoords({
			x: e.clientX,
			y: e.clientY
		})
	}

	const drawLine = (x0, y0, x1, y1) => {
		const ctx = canvasRef.current.getContext('2d')

		ctx.beginPath()
		ctx.moveTo(x0, y0)
		ctx.lineTo(x1, y1)
		ctx.stroke()
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
