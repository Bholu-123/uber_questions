export function NewMessagesButton({ newCount, onJumpToBottom }) {
  if (newCount <= 0) return null;

  return (
    <button className="new-msgs-btn" onClick={onJumpToBottom}>
      ↓ {newCount} new messages
    </button>
  );
}
