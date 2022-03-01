import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import ReactDOM from 'react-dom'
import { ToastContainer } from 'react-toastify'
import { getLibrary } from 'utils/web3React'

// import './index.scss'
// import 'react-toastify/dist/ReactToastify.css'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
      <ToastContainer />
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
