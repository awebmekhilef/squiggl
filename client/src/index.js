import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

import { SocketProvider } from './contexts/socketContext'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

ReactDOM.render(
	<React.StrictMode>
		<SocketProvider>
			<App />
		</SocketProvider>
	</React.StrictMode>,
	document.getElementById('root')
)
