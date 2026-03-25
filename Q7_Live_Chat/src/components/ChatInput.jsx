export function ChatInput({
  input,
  onChange,
  onKeyDown,
  onSend,
  disabled,
  showOwnTyping,
}) {
  return (
    <>
      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Type a message…"
          maxLength={200}
        />
        <button className="send-btn" onClick={onSend} disabled={disabled}>
          Send
        </button>
      </div>
      {showOwnTyping && <div className="own-typing">You are typing…</div>}
    </>
  );
}
