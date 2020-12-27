import React, { useEffect, useState, useRef } from 'react'

import { useSocket } from '../contexts/socketContext'

import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'

const ChatBox = () => {
	const socket = useSocket()
	const bottomRef = useRef()

	const [msg, setMsg] = useState('')
	const [chats, setChats] = useState([])

	useEffect(() => {
		if (socket == null) return

		socket.on('chat', handleRecieveChat)

		scrollToBottom()

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

	const scrollToBottom = () => {
		bottomRef.current.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}

	return (
		// TODO : Fix scrolling problem
		<div className='d-flex flex-column justify-content-between chatContainer'>
			<ListGroup className='chatList'>
				{
					chats.map((c, i) => (
						<ListGroup.Item key={i} className='chatItem'>
							{c.from}: {c.msg}
						</ListGroup.Item>
					))
				}
				<div ref={bottomRef}></div>
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
