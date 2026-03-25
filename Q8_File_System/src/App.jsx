import { useState, useCallback } from "react";
import "./App.css";

// ─── Tree utilities ─────────────────────────────────────────────────────
let nodeId = 10;

const initialTree = {
  id: 1,
  name: "root",
  type: "folder",
  expanded: true,
  children: [
    {
      id: 2, name: "src", type: "folder", expanded: true,
      children: [
        { id: 3, name: "App.jsx", type: "file", content: "// Your React app\nimport React from 'react';\n\nexport default function App() {\n  return <div>Hello World</div>;\n}" },
        { id: 4, name: "index.css", type: "file", content: "body {\n  margin: 0;\n  font-family: sans-serif;\n}" },
      ],
    },
    {
      id: 5, name: "public", type: "folder", expanded: false,
      children: [
        { id: 6, name: "index.html", type: "file", content: "<!DOCTYPE html>\n<html>\n  <head><title>App</title></head>\n  <body><div id='root'></div></body>\n</html>" },
      ],
    },
    { id: 7, name: "package.json", type: "file", content: '{\n  "name": "my-app",\n  "version": "1.0.0"\n}' },
    { id: 8, name: "README.md", type: "file", content: "# My Project\n\nA React application." },
  ],
};

// Immutable tree operations
function updateNode(tree, id, updater) {
  if (tree.id === id) return updater(tree);
  if (!tree.children) return tree;
  return { ...tree, children: tree.children.map((c) => updateNode(c, id, updater)) };
}

function deleteNode(tree, id) {
  if (!tree.children) return tree;
  return {
    ...tree,
    children: tree.children
      .filter((c) => c.id !== id)
      .map((c) => deleteNode(c, id)),
  };
}

function addNode(tree, parentId, newNode) {
  return updateNode(tree, parentId, (node) => ({
    ...node,
    expanded: true,
    children: [...(node.children || []), newNode],
  }));
}

function findNode(tree, id) {
  if (tree.id === id) return tree;
  for (const child of tree.children || []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

// ─── TreeNode ──────────────────────────────────────────────────────────
function TreeNode({ node, selectedId, onSelect, onToggle, onDelete, onAdd, onRename, depth = 0 }) {
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
          <span className="tree-toggle" onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}>
            {node.expanded ? "▾" : "▸"}
          </span>
        ) : (
          <span className="tree-toggle tree-toggle--leaf" />
        )}
        <span className="tree-icon">{isFolder ? (node.expanded ? "📂" : "📁") : getFileIcon(node.name)}</span>

        {renaming ? (
          <input
            className="rename-input"
            value={renameVal}
            autoFocus
            onChange={(e) => setRenameVal(e.target.value)}
            onBlur={submitRename}
            onKeyDown={(e) => { if (e.key === "Enter") submitRename(); if (e.key === "Escape") setRenaming(false); }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="tree-name" onDoubleClick={(e) => { e.stopPropagation(); setRenaming(true); setRenameVal(node.name); }}>
            {node.name}
          </span>
        )}

        {isSelected && !renaming && (
          <div className="tree-actions" onClick={(e) => e.stopPropagation()}>
            {isFolder && (
              <>
                <button title="New File" onClick={() => onAdd(node.id, "file")}>📄</button>
                <button title="New Folder" onClick={() => onAdd(node.id, "folder")}>📁</button>
              </>
            )}
            <button title="Rename" onClick={() => setRenaming(true)}>✏️</button>
            {node.id !== 1 && <button title="Delete" onClick={() => onDelete(node.id)}>🗑️</button>}
          </div>
        )}
      </div>

      {isFolder && node.expanded && node.children?.map((child) => (
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

function getFileIcon(name) {
  if (name.endsWith(".jsx") || name.endsWith(".tsx")) return "⚛️";
  if (name.endsWith(".js") || name.endsWith(".ts")) return "📜";
  if (name.endsWith(".css")) return "🎨";
  if (name.endsWith(".html")) return "🌐";
  if (name.endsWith(".json")) return "📦";
  if (name.endsWith(".md")) return "📝";
  return "📄";
}

// ─── App ────────────────────────────────────────────────────────────────
export default function App() {
  const [tree, setTree] = useState(initialTree);
  const [selectedId, setSelectedId] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [editorNode, setEditorNode] = useState(null);
  const [dirty, setDirty] = useState(false);

  const select = useCallback((id) => {
    setSelectedId(id);
    const node = findNode(tree, id);
    if (node?.type === "file") {
      setEditorNode(node);
      setEditorContent(node.content || "");
      setDirty(false);
    } else {
      setEditorNode(null);
    }
  }, [tree]);

  const toggle = useCallback((id) => {
    setTree((t) => updateNode(t, id, (n) => ({ ...n, expanded: !n.expanded })));
  }, []);

  const deleteNode_ = useCallback((id) => {
    setTree((t) => deleteNode(t, id));
    if (selectedId === id) { setSelectedId(null); setEditorNode(null); }
  }, [selectedId]);

  const addNode_ = useCallback((parentId, type) => {
    const name = type === "file" ? `new-file-${++nodeId}.txt` : `new-folder-${++nodeId}`;
    const newNode = type === "file"
      ? { id: nodeId, name, type: "file", content: "" }
      : { id: nodeId, name, type: "folder", expanded: true, children: [] };
    setTree((t) => addNode(t, parentId, newNode));
    setSelectedId(nodeId);
    if (type === "file") { setEditorNode(newNode); setEditorContent(""); setDirty(false); }
  }, []);

  const rename = useCallback((id, name) => {
    setTree((t) => updateNode(t, id, (n) => ({ ...n, name })));
    if (editorNode?.id === id) setEditorNode((n) => ({ ...n, name }));
  }, [editorNode]);

  const save = useCallback(() => {
    if (!editorNode) return;
    setTree((t) => updateNode(t, editorNode.id, (n) => ({ ...n, content: editorContent })));
    setEditorNode((n) => ({ ...n, content: editorContent }));
    setDirty(false);
  }, [editorNode, editorContent]);

  return (
    <div className="ide">
      <div className="sidebar">
        <div className="sidebar-header">
          <span>EXPLORER</span>
          <button className="icon-btn" title="New File at root" onClick={() => addNode_(1, "file")}>📄</button>
        </div>
        <div className="tree-scroll">
          <TreeNode
            node={tree}
            selectedId={selectedId}
            onSelect={select}
            onToggle={toggle}
            onDelete={deleteNode_}
            onAdd={addNode_}
            onRename={rename}
          />
        </div>
      </div>

      <div className="editor-panel">
        {editorNode ? (
          <>
            <div className="editor-tab">
              <span>{editorNode.name}</span>
              {dirty && <span className="dirty-dot">●</span>}
              <button className="save-btn" onClick={save} disabled={!dirty}>Save</button>
            </div>
            <textarea
              className="editor"
              value={editorContent}
              onChange={(e) => { setEditorContent(e.target.value); setDirty(true); }}
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
    </div>
  );
}
