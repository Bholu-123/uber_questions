export function ChatFeed({ feedRef, onScroll, messages, isTyping }) {
  return (
    <div className="chat-feed" ref={feedRef} onScroll={onScroll}>
      {messages.length === 0 && (
        <div className="empty">Start the stream to see messages</div>
      )}
      {messages.map((msg) => (
        <div key={msg.id} className={`message message--${msg.type}`}>
          <span className={`message-user message-user--${msg.type}`}>
            {msg.user}
          </span>
          <span className="message-text">{msg.text}</span>
          <span className="message-ts">{msg.ts}</span>
        </div>
      ))}
      {isTyping && (
        <div className="typing-indicator">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      )}
    </div>
  );
}
