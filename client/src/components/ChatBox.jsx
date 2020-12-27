import React, { useEffect, useState } from 'react'

import { useSocket } from '../contexts/socketContext'

import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import { io } from 'socket.io-client'

const ChatBox = () => {
	const socket = useSocket()

	const [msg, setMsg] = useState('')
	const [chats, setChats] = useState([])

	useEffect(() => {
		if (socket == null) return

		socket.on('chat', handleRecieveChat)

		return () => {
			socket.off('chat', handleRecieveChat)
		}
	}, [chats, socket])

	const handleRecieveChat = (chat) => {
		setChats([...chats, chat])
	}

	const handleSendMsg = (e) => {
		e.preventDefault()

		const trimMsg = msg.trim()

		if (trimMsg === '') return

		setChats([
			...chats, {
				from: 'You',
				msg: trimMsg
			}
		])
		
		socket.emit('chat', trimMsg)

		setMsg('')
	}

	return (
		<div style={{ height: 450 }} className='d-flex flex-column justify-content-between'>
			<ListGroup style={{ height: 400, overflow: 'auto' }}>
				{
					chats.map((c, i) => (
						<ListGroup.Item key={i}>
							{c.from}: {c.msg}
						</ListGroup.Item>
					))
				}
			</ListGroup>

			<Form onSubmit={handleSendMsg}>
				<Form.Control
					value={msg} onChange={(e) => setMsg(e.target.value)}
					placeholder='Send a message..' />
			</Form>
		</div>
	)
}

export default ChatBox
