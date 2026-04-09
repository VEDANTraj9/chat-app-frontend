import { useState, useEffect, useRef } from "react";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import UserStatus from "./UserStatus";
import "../styles/chat.css";

// ✅ VITE ENV VARIABLES
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [apiHealth, setApiHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const websocketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const userIdRef = useRef(generateUserId());

  function generateUserId() {
    return Math.random().toString(36).substring(2, 15);
  }

  // Username load
  useEffect(() => {
    const savedUsername = localStorage.getItem("chatUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setShowUsernameModal(false);
    }
    setLoading(false);
  }, []);

  // ✅ API Health Check
  useEffect(() => {
    const checkHealth = async () => {
      try {
        console.log("🔍 Checking:", `${API_URL}/health`);

        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();

        setApiHealth(data);
        console.log("✅ API Health:", data);
      } catch (error) {
        console.error("❌ API Error:", error);
        setApiHealth({ status: "error", message: error.message });
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  // ✅ WebSocket connect
  useEffect(() => {
    if (!username) return;

    connectWebSocket();

    return () => {
      websocketRef.current?.close();
      clearTimeout(reconnectTimeoutRef.current);
    };
  }, [username]);

  // ✅ Users Count
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users-count`);
        const data = await res.json();
        setConnectedUsers(data.count || 0);
      } catch (err) {
        console.error("❌ Users error:", err);
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  function connectWebSocket() {
    const wsUrl = `${WS_URL}?username=${encodeURIComponent(
      username
    )}&userId=${userIdRef.current}`;

    console.log("🔄 WS Connecting:", wsUrl);

    try {
      websocketRef.current = new WebSocket(wsUrl);

      websocketRef.current.onopen = () => {
        console.log("✅ WS Connected");
        setConnectionStatus("connected");
      };

      websocketRef.current.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.type === "chat") {
          setMessages((prev) => [...prev, msg]);
        } else if (msg.type === "user-count") {
          setConnectedUsers(msg.count || 0);
        }
      };

      websocketRef.current.onerror = () => {
        setConnectionStatus("error");
      };

      websocketRef.current.onclose = () => {
        setConnectionStatus("disconnected");

        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };
    } catch (err) {
      console.error("❌ WS Error:", err);
      setConnectionStatus("error");
    }
  }

  function handleUsernameSubmit(name) {
    if (name.trim()) {
      localStorage.setItem("chatUsername", name);
      setUsername(name);
      setShowUsernameModal(false);
    }
  }

  function handleSendMessage(text) {
    if (websocketRef.current?.readyState !== WebSocket.OPEN) {
      alert("❌ Not connected");
      return;
    }

    const msg = {
      type: "chat",
      username,
      userId: userIdRef.current,
      message: text,
      timestamp: new Date().toISOString(),
    };

    websocketRef.current.send(JSON.stringify(msg));
  }

  function handleCheckApiStatus() {
    alert(`API: ${API_URL}`);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="chat-container">
      {showUsernameModal && <UsernameModal onSubmit={handleUsernameSubmit} />}

      <aside className="chat-sidebar">
        <h2>💬 ChatHub</h2>

        <p>User: {username}</p>
        <p>Status: {connectionStatus}</p>
        <p>Users: {connectedUsers}</p>

        <button onClick={handleCheckApiStatus}>Check API</button>
      </aside>

      <main className="chat-main">
        <ChatWindow messages={messages} currentUsername={username} />

        <MessageInput
          onSendMessage={handleSendMessage}
          isConnected={connectionStatus === "connected"}
        />
      </main>
    </div>
  );
}

// Modal
function UsernameModal({ onSubmit }) {
  const [val, setVal] = useState("");

  return (
    <div className="modal">
      <h2>Enter Name</h2>
      <input value={val} onChange={(e) => setVal(e.target.value)} />
      <button onClick={() => onSubmit(val)}>Join</button>
    </div>
  );
}