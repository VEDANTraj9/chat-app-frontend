// src/services/WebSocketService.js

class WebSocketService {
  constructor() {
    this.ws = null;
    this.url = "ws://localhost:8080/ws";
    this.messageHandlers = [];
    this.connectionHandlers = [];
    // Generate unique user ID
    this.userId = this.generateUserId();
    console.log("🔑 User ID Generated:", this.userId);
  }

  generateUserId() {
    return "user_" + Math.random().toString(36).substr(2, 9);
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log("✅ WebSocket Connected!");
          console.log("📡 WebSocket URL:", this.url);
          this.connectionHandlers.forEach((handler) => handler(true));
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("📨 Message Received:", data);
            this.messageHandlers.forEach((handler) => handler(data));
          } catch (error) {
            console.error("❌ Error parsing message:", error);
          }
        };

        this.ws.onerror = (error) => {
          console.error("❌ WebSocket Error:", error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("⚠️ WebSocket Disconnected");
          this.connectionHandlers.forEach((handler) => handler(false));
          // Auto-reconnect after 3 seconds
          setTimeout(() => {
            console.log("🔄 Attempting to reconnect...");
            this.connect().catch((err) =>
              console.error("Reconnection failed:", err),
            );
          }, 3000);
        };
      } catch (error) {
        console.error("❌ WebSocket creation error:", error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  sendMessage(messageText) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // Get username from localStorage
      const username = localStorage.getItem("username") || "Anonymous";

      // Create message object matching backend format
      const chatMessage = {
        userId: this.userId,
        username: username,
        message: messageText,
        timestamp: Date.now(),
        type: "chat",
      };

      console.log("📤 Sending Message:", chatMessage);

      // Send to server
      try {
        this.ws.send(JSON.stringify(chatMessage));
        console.log("✅ Message sent successfully!");
      } catch (error) {
        console.error("❌ Error sending message:", error);
      }
    } else {
      console.error("❌ WebSocket is not connected");
      console.warn("Connection state:", this.ws?.readyState);
    }
  }

  onMessage(callback) {
    this.messageHandlers.push(callback);
    console.log("📌 Message handler registered");
  }

  onConnectionChange(callback) {
    this.connectionHandlers.push(callback);
    console.log("📌 Connection handler registered");
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  getStatus() {
    const states = {
      0: "CONNECTING",
      1: "OPEN",
      2: "CLOSING",
      3: "CLOSED",
    };
    return states[this.ws?.readyState] || "UNKNOWN";
  }
}

export default new WebSocketService();
