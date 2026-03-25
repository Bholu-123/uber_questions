import { useState } from "react";
import { getFileIcon } from "../hooks/fileIcons";

export function TreeNode({
  node,
  selectedId,
  onSelect,
  onToggle,
  onDelete,
  onAdd,
  onRename,
  depth = 0,
}) {
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(node.name);

  const isFolder = node.type === "folder";
  const isSelected = node.id === selectedId;

  const submitRename = () => {
    if (renameVal.trim()) onRename(node.id, renameVal.trim());
    setRenaming(false);
  };

  return (
    <div>
      <div
        className={`tree-row ${isSelected ? "tree-row--selected" : ""}`}
        style={{ paddingLeft: depth * 16 + 8 }}
        onClick={() => onSelect(node.id)}
      >
        {isFolder ? (
          <span
            className="tree-toggle"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
          >
            {node.expanded ? "▾" : "▸"}
          </span>
        ) : (
          <span className="tree-toggle tree-toggle--leaf" />
        )}
        <span className="tree-icon">
          {isFolder ? (node.expanded ? "📂" : "📁") : getFileIcon(node.name)}
        </span>

        {renaming ? (
          <input
            className="rename-input"
            value={renameVal}
            autoFocus
            onChange={(e) => setRenameVal(e.target.value)}
            onBlur={submitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitRename();
              if (e.key === "Escape") setRenaming(false);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className="tree-name"
            onDoubleClick={(e) => {
              e.stopPropagation();
              setRenaming(true);
              setRenameVal(node.name);
            }}
          >
            {node.name}
          </span>
        )}

        {isSelected && !renaming && (
          <div className="tree-actions" onClick={(e) => e.stopPropagation()}>
            {isFolder && (
              <>
                <button title="New File" onClick={() => onAdd(node.id, "file")}>
                  📄
                </button>
                <button
                  title="New Folder"
                  onClick={() => onAdd(node.id, "folder")}
                >
                  📁
                </button>
              </>
            )}
            <button title="Rename" onClick={() => setRenaming(true)}>
              ✏️
            </button>
            {node.id !== 1 && (
              <button title="Delete" onClick={() => onDelete(node.id)}>
                🗑️
              </button>
            )}
          </div>
        )}
      </div>

      {isFolder &&
        node.expanded &&
        node.children?.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            selectedId={selectedId}
            onSelect={onSelect}
            onToggle={onToggle}
            onDelete={onDelete}
            onAdd={onAdd}
            onRename={onRename}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}
