import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0D1F35',
            color: '#F1F5F9',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.78rem',
            borderRadius: '6px',
          },
          success: { iconTheme: { primary: '#2E6E4E', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)