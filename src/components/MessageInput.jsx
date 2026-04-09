import { useState, useRef } from 'react';

export default function MessageInput({ onSendMessage, isConnected, messageCount }) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const emojis = ['😀', '😂', '❤️', '🔥', '👍', '🎉', '😍', '🤔', '💯', '😢', '🚀', '✨', '👋', '💬', '📱', '⚡'];

  // Auto-expand textarea
  function handleInputChange(e) {
    setMessage(e.target.value);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(e.target.scrollHeight, 120);
      textareaRef.current.style.height = newHeight + 'px';
    }
  }

  // Handle send message
  function handleSend() {
    if (message.trim().length === 0) return;
    if (!isConnected) return;

    onSendMessage(message);
    setMessage('');
    setShowEmojiPicker(false);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  // Handle keyboard shortcuts
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Add emoji
  function handleEmojiClick(emoji) {
    const newMessage = message + emoji;
    setMessage(newMessage);
    textareaRef.current?.focus();
  }

  // Close emoji picker when clicking outside
  function handleClickOutside(e) {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
      setShowEmojiPicker(false);
    }
  }

  return (
    <div className="message-input-container" onClick={handleClickOutside}>
      <div className="message-input-wrapper">
        {/* Emoji Picker */}
        <div className="emoji-picker-wrapper" ref={emojiPickerRef}>
          <button
            className="btn-emoji"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Add emoji"
            disabled={!isConnected}
          >
            😊
          </button>

          {showEmojiPicker && (
            <div className="emoji-picker">
              <div className="emoji-grid">
                {emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    className="emoji-item"
                    onClick={() => handleEmojiClick(emoji)}
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="input-area">
          <textarea
            ref={textareaRef}
            className="message-textarea"
            placeholder={isConnected ? "Type a message... (Shift+Enter for new line)" : "Disconnected - please wait..."}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={!isConnected}
            maxLength={500}
          />
          <span className="character-count">
            {message.length}/500
          </span>
        </div>

        {/* Send Button */}
        <button
          className="btn-send"
          onClick={handleSend}
          disabled={!isConnected || message.trim().length === 0}
          title="Send message (Enter)"
        >
          <span>📤</span>
        </button>
      </div>

      {/* Info Footer */}
      <div className="input-footer">
        <span className="input-hint">
          💬 {messageCount} messages
        </span>
        <span className={`connection-hint ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </div>
    </div>
  );
}