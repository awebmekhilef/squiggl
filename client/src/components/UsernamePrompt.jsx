import React, { useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'

const UsernamePrompt = ({ onSubmit }) => {
	const [username, setUsername] = useState('test')

	const handleSubmit = (e) => {
		e.preventDefault()

		if (username === '')
			return

		onSubmit(username)
	}

	return (
		<Form onSubmit={handleSubmit}>
			<InputGroup className='mt-5'>
				<Form.Control
					value={username} onChange={(e) => setUsername(e.target.value.trim())}
					placeholder='Enter your name' autoFocus autoComplete='off' spellCheck='false'
				/>

				<InputGroup.Append>
					<Button variant='secondary' type='submit'>Join</Button>
				</InputGroup.Append>
			</InputGroup>
		</Form>
	)
}

export default UsernamePrompt
