import React, { useState } from 'react'

const UsernamePrompt = ({ onSubmit }) => {
	const [username, setUsername] = useState('test')

	const handleSubmit = (e) => {
		e.preventDefault()

		if (username === '')
			return

		onSubmit(username)
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='input-group mt-5'>
				<input
					className='form-control'
					value={username} onChange={(e) => setUsername(e.target.value.trim())}
					placeholder='Enter your name' autoFocus autoComplete='off' spellCheck='false'
				/>
				<div className='input-group-append'>
					<button className='btn btn-secondary' type='submit'>Join</button>
				</div>
			</div>
		</form>
	)
}

export default UsernamePrompt
