import React, { useState, useEffect, useRef } from "react";
import WebSocketService from "../services/WebSocketService";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import '../styles/Chatpage.css';


export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "Anonymous",
  );
  const [showNameModal, setShowNameModal] = useState(
    !localStorage.getItem("username"),
  );
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // ═══════════════════════════════════════════════════════════════
  // INITIALIZE APP
  // ═══════════════════════════════════════════════════════════════

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🚀 Initializing ChatApp...");
        setLoading(true);

        // Connect to WebSocket
        console.log("🔌 Connecting to WebSocket...");
        await WebSocketService.connect();
        setIsConnected(true);
        console.log("✅ WebSocket Connected!");

        // Set up message listener
        WebSocketService.onMessage((data) => {
          console.log("📩 New message received:", data);

          if (data.type === "chat") {
            // Add message to state
            setMessages((prev) => [...prev, data]);
          }
        });

        // Set up connection change listener
        WebSocketService.onConnectionChange((connected) => {
          console.log("🔄 Connection changed:", connected);
          setIsConnected(connected);
        });
      } catch (error) {
        console.error("❌ Initialization error:", error);
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handleSetUsername = (newUsername) => {
    console.log("✏️ Setting username:", newUsername);
    localStorage.setItem("username", newUsername);
    setUsername(newUsername);
    setShowNameModal(false);
  };

  const handleSendMessage = (messageText) => {
    if (!messageText.trim()) {
      console.warn("⚠️ Empty message, not sending");
      return;
    }

    if (!isConnected) {
      console.error("❌ WebSocket not connected");
      alert("Not connected to server. Please wait...");
      return;
    }

    console.log("📝 Sending message:", messageText);
    WebSocketService.sendMessage(messageText);
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4 mx-auto"></div>
          <p className="text-white">Connecting to server...</p>
          <p className="text-gray-400 text-sm mt-2">
            URL: ws://localhost:8080/ws
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Username Modal */}
      {showNameModal && <UsernameModal onSetUsername={handleSetUsername} />}

      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 flex flex-col overflow-y-auto scrollbar-thin">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">💬 ChatApp</h1>
          <p className="text-sm text-gray-400">Real-time Chat</p>
        </div>

        {/* Connection Status */}
        <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-3 h-3 rounded-full animate-pulse ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="font-medium">
              {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            WebSocket: {WebSocketService.getStatus()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Messages: {messages.length}
          </p>
        </div>

        {/* User Info */}
        <div className="mb-4 flex-1">
          <h2 className="text-sm font-semibold mb-3 text-gray-300">
            👤 Your Profile
          </h2>
          <div className="p-3 bg-blue-600 rounded-lg">
            <p className="font-medium text-sm break-words">{username}</p>
            <p className="text-xs text-blue-200 mt-1">
              ID: {WebSocketService.userId}
            </p>
          </div>
        </div>

        {/* Change Name Button */}
        <button
          onClick={() => setShowNameModal(true)}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition"
        >
          ✏️ Change Name
        </button>

        {/* Debug Info */}
        <div className="mt-4 p-3 bg-gray-700 bg-opacity-50 rounded text-xs text-gray-400 border border-gray-600">
          <p className="font-semibold mb-1">Debug Info:</p>
          <p>Connected: {isConnected ? "Yes" : "No"}</p>
          <p>Total Messages: {messages.length}</p>
          <p>Your User ID: {WebSocketService.userId}</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Public Chat Room</h2>
            <p className="text-sm text-gray-400">
              {messages.length} messages • {connectedUsers} users online
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Status</p>
            <p
              className={`font-bold ${
                isConnected ? "text-green-400" : "text-red-400"
              }`}
            >
              {isConnected ? "🟢 Online" : "🔴 Offline"}
            </p>
          </div>
        </div>

        {/* Messages */}
        <ChatWindow messages={messages} messagesEndRef={messagesEndRef} />

        {/* Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// USERNAME MODAL
// ═══════════════════════════════════════════════════════════════

function UsernameModal({ onSetUsername }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSetUsername(inputValue);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 p-8 rounded-lg max-w-sm w-full border border-gray-700 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">👤 Enter Your Name</h2>
        <p className="text-gray-400 text-sm mb-6">
          Choose a username to start chatting with others
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g., John Doe"
            className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4"
            autoFocus
            maxLength={20}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
          >
            Continue to Chat
          </button>
        </form>
      </div>
    </div>
  );
}
