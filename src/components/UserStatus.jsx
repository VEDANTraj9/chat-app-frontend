export default function UserStatus({ status, connectedUsers, apiHealth, onCheckApi }) {
  return (
    <div className="status-card">
      <div className="status-item">
        <span className="status-label">Connection</span>
        <div className="status-value">
          <span className={`status-indicator ${status}`}></span>
          <span className="status-text">
            {status === 'connected' && 'Connected'}
            {status === 'disconnected' && 'Disconnected'}
            {status === 'error' && 'Error'}
            {status === 'reconnecting' && 'Reconnecting...'}
          </span>
        </div>
      </div>

      <div className="status-item">
        <span className="status-label">Users</span>
        <div className="status-value">
          <span className="status-badge-number">{connectedUsers}</span>
          <span className="status-text">online</span>
        </div>
      </div>

      <button 
        className="btn-api-status"
        onClick={onCheckApi}
        title="Check API health"
      >
        🔍 Check API
      </button>

      {apiHealth && (
        <div className={`api-health ${apiHealth.status}`}>
          <span className="health-dot"></span>
          <span className="health-text">
            {apiHealth.status === 'up' ? '✅ API Running' : '⚠️ API Issue'}
          </span>
        </div>
      )}
    </div>
  );
}