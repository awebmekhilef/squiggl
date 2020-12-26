import React from 'react'

import { SocketProvider } from './contexts/socketContext'

import Canvas from './components/Canvas'

const App = () => {
	return (
		<SocketProvider>
			<Canvas />
		</SocketProvider>
	)
}

export default App
