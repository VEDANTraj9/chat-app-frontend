import { useEffect, useRef } from 'react';

export default function ChatWindow({ messages, currentUsername }) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get user avatar color (consistent per user)
  function getUserColor(username) {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
      '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = ((hash << 5) - hash) + username.charCodeAt(i);
      hash = hash & hash;
    }
    return colors[Math.abs(hash) % colors.length];
  }

  // Format timestamp
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Group messages by sender
  function groupMessagesBySender(msgs) {
    const grouped = [];
    let lastSender = null;
    let group = null;

    msgs.forEach((msg) => {
      if (msg.username !== lastSender) {
        if (group) grouped.push(group);
        lastSender = msg.username;
        group = {
          username: msg.username,
          userId: msg.userId,
          color: getUserColor(msg.username),
          messages: [msg],
        };
      } else {
        group.messages.push(msg);
      }
    });

    if (group) grouped.push(group);
    return grouped;
  }

  const groupedMessages = groupMessagesBySender(messages);

  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3>No messages yet</h3>
          <p>Start a conversation by sending your first message</p>
        </div>
      ) : (
        <div className="messages-list">
          {groupedMessages.map((group, groupIdx) => (
            <div key={groupIdx} className="message-group">
              {/* User header - only show for first message in group */}
              <div className="message-group-header">
                <div 
                  className="message-avatar"
                  style={{ backgroundColor: group.color }}
                >
                  {group.username.charAt(0).toUpperCase()}
                </div>
                <span className="message-username">
                  {group.username}
                </span>
                <span className="message-time">
                  {formatTime(group.messages[0].timestamp)}
                </span>
              </div>

              {/* Messages in group */}
              <div className="message-bubble-group">
                {group.messages.map((msg, msgIdx) => (
                  <div
                    key={msgIdx}
                    className={`message-bubble ${
                      msg.username === currentUsername ? 'own' : 'other'
                    }`}
                  >
                    <p className="message-text">{msg.message}</p>
                    <span className="message-check">✓</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}