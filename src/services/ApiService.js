// src/services/ApiService.js

import axios from "axios";

// API Configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api";
const WS_BASE_URL = process.env.REACT_APP_WS_URL || "ws://localhost:8080/ws";

// Create Axios Instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ═══════════════════════════════════════════════════════════════
// REQUEST INTERCEPTOR
// ═══════════════════════════════════════════════════════════════

apiClient.interceptors.request.use(
  (config) => {
    // Log request
    console.log("📤 API Request:", {
      method: config.method.toUpperCase(),
      url: config.url,
      data: config.data,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Add token if exists (for future authentication)
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add custom headers
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    config.headers["X-Client-Version"] = "1.0.0";

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// ═══════════════════════════════════════════════════════════════
// RESPONSE INTERCEPTOR
// ═══════════════════════════════════════════════════════════════

apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log("✅ API Response:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      timestamp: new Date().toLocaleTimeString(),
    });

    return response;
  },
  (error) => {
    // Error handling
    console.error("❌ API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Handle specific error codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("🔐 Unauthorized - Token expired or invalid");
          localStorage.removeItem("authToken");
          // Redirect to login if needed
          break;

        case 403:
          console.error("🚫 Forbidden - Access denied");
          break;

        case 404:
          console.error("🔍 Not Found - Resource does not exist");
          break;

        case 500:
          console.error("⚠️ Server Error - Internal server error");
          break;

        default:
          console.error(`⚠️ Error ${error.response.status}`);
      }
    } else if (error.request) {
      console.error("🌐 Network Error - No response received");
    } else {
      console.error("💥 Error:", error.message);
    }

    return Promise.reject(error);
  },
);

// ═══════════════════════════════════════════════════════════════
// API SERVICE METHODS
// ═══════════════════════════════════════════════════════════════

export const ApiService = {
  // GET request
  get: (endpoint, config = {}) => {
    return apiClient.get(endpoint, config);
  },

  // POST request
  post: (endpoint, data, config = {}) => {
    return apiClient.post(endpoint, data, config);
  },

  // PUT request
  put: (endpoint, data, config = {}) => {
    return apiClient.put(endpoint, data, config);
  },

  // DELETE request
  delete: (endpoint, config = {}) => {
    return apiClient.delete(endpoint, config);
  },

  // PATCH request
  patch: (endpoint, data, config = {}) => {
    return apiClient.patch(endpoint, data, config);
  },

  // Get base URL (for debugging)
  getBaseURL: () => API_BASE_URL,

  // Get WebSocket URL
  getWebSocketURL: () => WS_BASE_URL,

  // Set Authorization Token
  setAuthToken: (token) => {
    localStorage.setItem("authToken", token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },

  // Remove Authorization Token
  removeAuthToken: () => {
    localStorage.removeItem("authToken");
    delete apiClient.defaults.headers.common["Authorization"];
  },

  // Get Authorization Token
  getAuthToken: () => {
    return localStorage.getItem("authToken");
  },
};

// ═══════════════════════════════════════════════════════════════
// SPECIFIC API CALLS
// ═══════════════════════════════════════════════════════════════

export const ChatAPI = {
  // Get health status
  getHealth: () => {
    return ApiService.get("/health");
  },

  // Get connected users count
  getUsersCount: () => {
    return ApiService.get("/users-count");
  },

  // Get server status
  getStatus: () => {
    return ApiService.get("/status");
  },

  // Get recent messages (if you add this to backend)
  getMessages: (limit = 50) => {
    return ApiService.get("/messages", { params: { limit } });
  },

  // Get users list (if you add this to backend)
  getUsers: () => {
    return ApiService.get("/users");
  },
};

export default apiClient;
