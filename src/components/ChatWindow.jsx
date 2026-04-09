// src/components/ChatWindow.jsx

import React from "react";
import WebSocketService from "../services/WebSocketService";

export default function ChatWindow({ messages, messagesEndRef }) {
  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get avatar color
  const getAvatarColor = (userId) => {
    const colors = [
      "bg-blue-600",
      "bg-red-600",
      "bg-green-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-indigo-600",
      "bg-yellow-600",
      "bg-cyan-600",
    ];
    let hash = 0;
    if (userId) {
      for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
      }
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Get initials
  const getInitials = (username) => {
    if (!username) return "U";
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if message is from current user
  const isOwnMessage = (userId) => {
    return userId === WebSocketService.userId;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-900 p-6 space-y-4 scrollbar-thin">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-5xl mb-4">👋</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Welcome to ChatApp
            </h3>
            <p className="text-gray-400 mb-4">
              No messages yet. Be the first to start the conversation!
            </p>
          </div>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isOwn = isOwnMessage(msg.userId);
          const avatarColor = getAvatarColor(msg.userId);
          const initials = getInitials(msg.username);

          console.log("🖼️ Rendering message:", {
            index,
            username: msg.username,
            message: msg.message,
            isOwn,
            userId: msg.userId,
          });

          return (
            <div
              key={index}
              className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-slideInUp`}
            >
              <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div
                  className={`avatar avatar-md ${avatarColor} border-2 border-gray-600 flex-shrink-0`}
                >
                  {initials}
                </div>

                {/* Message Content */}
                <div
                  className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                >
                  {/* Username & Time */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-300">
                      {msg.username || "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(msg.timestamp)}
                    </span>
                    {isOwn && (
                      <span className="text-xs text-blue-400" title="You">
                        (You)
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-xs px-4 py-3 rounded-lg break-words ${
                      isOwn
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-700 text-gray-100 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Auto-scroll target */}
      <div ref={messagesEndRef} />
    </div>
  );
}
