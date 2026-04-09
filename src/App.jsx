import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import ChatPage from './components/ChatPage'

// Home Page Component
function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      {/* Hero Section */}
      <section id="center">
        <div className="hero">
          <div className="app-icon">💬</div>
        </div>
        <div>
          <h1>ChatHub</h1>
          <p>Real-time messaging with WebSocket & React</p>
        </div>
        <button
          className="counter"
          onClick={() => navigate('/chat')}
        >
          Open Chat →
        </button>
      </section>

      {/* Divider */}
      <div className="ticks"></div>

      {/* Features & Setup Section */}
      <section id="next-steps">
        {/* Features Card */}
        <div id="docs">
          <div style={{ fontSize: '48px' }}>⚡</div>
          <h2>Features</h2>
          <p>What's included</p>
          <ul>
            <li>
              <span>✅</span>
              <span>Real-time WebSocket Chat</span>
            </li>
            <li>
              <span>✅</span>
              <span>Beautiful Dark UI (Tailwind)</span>
            </li>
            <li>
              <span>✅</span>
              <span>User Management & Status</span>
            </li>
            <li>
              <span>✅</span>
              <span>Connection Indicators</span>
            </li>
            <li>
              <span>✅</span>
              <span>Emoji Picker</span>
            </li>
            <li>
              <span>✅</span>
              <span>Message Timestamps</span>
            </li>
            <li>
              <span>✅</span>
              <span>API Interceptor</span>
            </li>
          </ul>
        </div>

        {/* Setup Card */}
        <div id="social">
          <div style={{ fontSize: '48px' }}>🚀</div>
          <h2>Getting Started</h2>
          <p>Setup requirements</p>
          <ul>
            <li>
              <strong>Backend:</strong>
              <span>Spring Boot on port 8080</span>
            </li>
            <li>
              <strong>Frontend:</strong>
              <span>React + Vite on port 5173</span>
            </li>
            <li>
              <strong>WebSocket:</strong>
              <span>ws://localhost:8080/ws</span>
            </li>
            <li>
              <strong>API:</strong>
              <span>http://localhost:8080/api</span>
            </li>
            <li>
              <strong>Database:</strong>
              <span>In-memory (ready for persistence)</span>
            </li>
            <li>
              <strong>.env:</strong>
              <span>Check environment variables</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Divider */}
      <div className="ticks"></div>

      {/* Spacer */}
      <section id="spacer"></section>
    </>
  )
}

// Main App Component with Router
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