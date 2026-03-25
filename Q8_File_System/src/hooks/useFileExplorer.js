import { useCallback, useMemo, useRef, useState } from "react";
import { initialTree } from "../constants/initialTree";
import { addNode, deleteNode, findNode, updateNode } from "./treeOps";

function buildNewNode(id, type, name) {
  if (type === "file") return { id, name, type: "file", content: "" };
  return { id, name, type: "folder", expanded: true, children: [] };
}

export function useFileExplorer() {
  const [tree, setTree] = useState(initialTree);
  const [selectedId, setSelectedId] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [editorNode, setEditorNode] = useState(null);
  const [dirty, setDirty] = useState(false);

  const nextIdRef = useRef(10);

  const selectedNode = useMemo(
    () => (selectedId ? findNode(tree, selectedId) : null),
    [tree, selectedId],
  );

  const select = useCallback(
    (id) => {
      setSelectedId(id);
      const node = findNode(tree, id);
      if (node?.type === "file") {
        setEditorNode(node);
        setEditorContent(node.content || "");
        setDirty(false);
      } else {
        setEditorNode(null);
      }
    },
    [tree],
  );

  const toggle = useCallback((id) => {
    setTree((t) => updateNode(t, id, (n) => ({ ...n, expanded: !n.expanded })));
  }, []);

  const deleteNodeById = useCallback(
    (id) => {
      setTree((t) => deleteNode(t, id));
      if (selectedId === id) {
        setSelectedId(null);
        setEditorNode(null);
      }
    },
    [selectedId],
  );

  const addNodeTo = useCallback((parentId, type) => {
    const id = ++nextIdRef.current;
    const name = type === "file" ? `new-file-${id}.txt` : `new-folder-${id}`;
    const newNode = buildNewNode(id, type, name);

    setTree((t) => addNode(t, parentId, newNode));
    setSelectedId(id);
    if (type === "file") {
      setEditorNode(newNode);
      setEditorContent("");
      setDirty(false);
    }
  }, []);

  const rename = useCallback((id, name) => {
    setTree((t) => updateNode(t, id, (n) => ({ ...n, name })));
    setEditorNode((n) => (n?.id === id ? { ...n, name } : n));
  }, []);

  const save = useCallback(() => {
    if (!editorNode) return;
    setTree((t) =>
      updateNode(t, editorNode.id, (n) => ({ ...n, content: editorContent })),
    );
    setEditorNode((n) => ({ ...n, content: editorContent }));
    setDirty(false);
  }, [editorNode, editorContent]);

  const updateEditorContent = useCallback((next) => {
    setEditorContent(next);
    setDirty(true);
  }, []);

  return {
    tree,
    selectedId,
    selectedNode,
    editorNode,
    editorContent,
    dirty,
    select,
    toggle,
    deleteNodeById,
    addNodeTo,
    rename,
    save,
    updateEditorContent,
  };
}
