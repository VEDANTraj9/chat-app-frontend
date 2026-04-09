export default function UserStatus({
  status,
  connectedUsers,
  apiHealth,
  onCheckApi,
}) {
  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "🟢 Connected";
      case "disconnected":
        return "🔴 Disconnected";
      case "error":
        return "⚠️ Error";
      case "reconnecting":
        return "🟡 Reconnecting...";
      default:
        return "Unknown";
    }
  };

  const isApiRunning = apiHealth?.running;

  return (
    <div className="status-card">
      {/* 🔌 Connection Status */}
      <div className="status-item">
        <span className="status-label">Connection</span>
        <div className="status-value">
          <span className={`status-indicator ${status}`}></span>
          <span className="status-text">{getStatusText()}</span>
        </div>
      </div>

      {/* 👥 Users */}
      <div className="status-item">
        <span className="status-label">Users</span>
        <div className="status-value">
          <span className="status-badge-number">{connectedUsers || 0}</span>
          <span className="status-text">online</span>
        </div>
      </div>

      {/* 🔍 API Button */}
      <button
        className="btn-api-status"
        onClick={onCheckApi}
        title="Check API health"
      >
        🔍 Check API
      </button>

      {/* ❤️ API Health */}
      {apiHealth && (
        <div className={`api-health ${isApiRunning ? "up" : "down"}`}>
          <span className="health-dot"></span>
          <span className="health-text">
            {isApiRunning ? "✅ API Running" : "❌ API Down"}
          </span>
        </div>
      )}
    </div>
  );
}
