import React, { useEffect, useState, useRef } from 'react'

import { useSocket } from '../contexts/socketContext'

import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'

const ChatBox = ({ isDrawer, hasGuessedWord }) => {
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

		if (msg.trim() === '') return
		socket.emit('chat', msg.trim())

		setMsg('')
	}

	const scrollToBottom = () => {
		bottomRef.current.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}

	return (
		<div className='d-flex flex-column justify-content-between bg-white rounded chatContainer'>
			<ListGroup className='chatList'>
				{
					chats.map((c, i) => (
						<ListGroup.Item key={i} className='chatItem'>
							{
								c.from === 'Host' ?
									<b style={{ color: c.color }}>{c.msg}</b> :
									<>
										<b>{c.from}</b>: {c.msg}
									</>
							}
						</ListGroup.Item>
					))
				}
				<div ref={bottomRef}></div>
			</ListGroup>

			<Form onSubmit={handleSendMsg}>
				<Form.Control
					disabled={isDrawer | hasGuessedWord}
					value={msg} onChange={(e) => setMsg(e.target.value)}
					placeholder='Send a message..' />
			</Form>
		</div>
	)
}

export default ChatBox
