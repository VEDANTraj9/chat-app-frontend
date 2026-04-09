import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'
import ChatPage from './components/ChatPage'

// Home Page
function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <section id="center">
        <div className="hero">
          <div className="app-icon" style={{ fontSize: '64px' }}>💬</div>
        </div>
        <div>
          <h1>ChatHub</h1>
          <p>
            Real-time messaging with WebSocket & React
          </p>
        </div>
        <button
          className="counter"
          onClick={() => navigate('/chat')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Open Chat →
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
          <h2>Features</h2>
          <p>What's included</p>
          <ul>
            <li>
              <span style={{ marginRight: '8px' }}>✅</span>
              Real-time WebSocket Chat
            </li>
            <li>
              <span style={{ marginRight: '8px' }}>✅</span>
              Beautiful Dark UI
            </li>
            <li>
              <span style={{ marginRight: '8px' }}>✅</span>
              User Management
            </li>
            <li>
              <span style={{ marginRight: '8px' }}>✅</span>
              Connection Status
            </li>
            <li>
              <span style={{ marginRight: '8px' }}>✅</span>
              Emoji Picker
            </li>
          </ul>
        </div>
        <div id="social">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
          <h2>Getting Started</h2>
          <p>Setup requirements</p>
          <ul>
            <li>
              <strong>Backend:</strong> Spring Boot on port 8080
            </li>
            <li>
              <strong>Frontend:</strong> React + Vite on port 5173
            </li>
            <li>
              <strong>WebSocket:</strong> ws://localhost:8080/ws
            </li>
            <li>
              <strong>API:</strong> http://localhost:8080/api
            </li>
            <li>
              <strong>.env:</strong> Check environment variables
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

// Main App with Router
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  )
}

export default App