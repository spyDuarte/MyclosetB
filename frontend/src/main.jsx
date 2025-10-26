import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initializeMonitoring, recordPageView } from './monitoring.js'

initializeMonitoring()
recordPageView(window.location.pathname)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
