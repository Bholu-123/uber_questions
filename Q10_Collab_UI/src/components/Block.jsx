export function Block({
  block,
  remoteCursors,
  onUpdate,
  onInsertAfter,
  onDelete,
}) {
  const hasCursor = remoteCursors.includes(block.id);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onInsertAfter(block.id);
    }
    if (e.key === "Backspace" && block.content === "" && block.type !== "h1") {
      e.preventDefault();
      onDelete(block.id);
    }
  };

  return (
    <div className={`block ${hasCursor ? "block--remote-cursor" : ""}`}>
      <div
        className={`block-content block-type--${block.type}`}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onUpdate(block.id, e.currentTarget.textContent)}
        onKeyDown={handleKeyDown}
        data-placeholder={block.type === "h1" ? "Title" : "Type something…"}
      >
        {block.content}
      </div>
      {hasCursor && <div className="remote-cursor-label">✎ editing</div>}
    </div>
  );
}
