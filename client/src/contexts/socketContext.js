import React, { useContext, useEffect, useState } from 'react'

import { io } from 'socket.io-client'

const ctx = React.createContext()

export function useSocket() {
	return useContext(ctx)
}

export function SocketProvider({ children }) {
	const [socket, setSocket] = useState()

	useEffect(() => {
		const newSocket = io({
			reconnection: false
	})
		setSocket(newSocket)

		return () => newSocket.close()
	}, [])

	return (
		<ctx.Provider value={socket}>
			{children}
		</ctx.Provider>
	)
}

export default ctx
