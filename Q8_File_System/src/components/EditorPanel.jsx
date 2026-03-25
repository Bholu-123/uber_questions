export function EditorPanel({
  editorNode,
  editorContent,
  dirty,
  onSave,
  onChangeContent,
}) {
  return (
    <div className="editor-panel">
      {editorNode ? (
        <>
          <div className="editor-tab">
            <span>{editorNode.name}</span>
            {dirty && <span className="dirty-dot">●</span>}
            <button className="save-btn" onClick={onSave} disabled={!dirty}>
              Save
            </button>
          </div>
          <textarea
            className="editor"
            value={editorContent}
            onChange={(e) => onChangeContent(e.target.value)}
            spellCheck={false}
          />
        </>
      ) : (
        <div className="editor-placeholder">
          <div className="editor-placeholder-icon">📁</div>
          <p>Select a file to view and edit its content</p>
          <p className="hint">Double-click a file name to rename it</p>
        </div>
      )}
    </div>
  );
}
