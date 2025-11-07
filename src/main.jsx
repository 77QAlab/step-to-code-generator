import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initAnalytics, trackPageView } from './utils/analytics'

// Initialize analytics on app load
initAnalytics();

// Track initial page view
trackPageView();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
