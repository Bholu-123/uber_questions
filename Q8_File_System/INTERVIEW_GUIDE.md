# Q8 — File explorer (tree UI + editor) — SDE 2 FE interview guide

## Problem (how to state it)

Build a **hierarchical file tree** (folders and files) with:

- **Expand/collapse** folders.
- **Select** a node; **edit file contents** in a panel with **dirty state** and explicit **save** (persist content into the tree).
- **Create** file/folder under a parent, **rename**, **delete**.
- Keep tree updates **immutable** so React can re-render predictably.

## Why interviewers care

Trees appear everywhere: **sidebar nav**, **IDE mocks**, **CMS**, **permission UIs**. They want **recursive data updates**, **selection/editing coherence**, and clean separation between **tree ops** and **React state**.

## Our approach

### Pure tree helpers (`treeOps.js`)

- **`updateNode(tree, id, updater)`** — recursive map: if `tree.id === id`, apply updater; else recurse into `children`.
- **`deleteNode`** — filter child matching `id`, recurse.
- **`addNode`** — `updateNode` on parent to append child and force `expanded: true`.
- **`findNode`** — DFS for selection/editor binding.

These return **new object references** along the path (structural sharing pattern), not a deep clone of the whole tree.

### Hook orchestration (`useFileExplorer.js`)

- **`tree`** in state; **`selectedId`**, **`editorNode`**, **`editorContent`**, **`dirty`** for the file editor workflow.
- **Select** loads file content into the editor and clears dirty; selecting a folder clears editor.
- **Save** writes `editorContent` back via `updateNode` on the file’s id.

### UI decomposition

- **`TreeNode`** renders recursion / chevrons / actions.
- **`EditorPanel`** for textarea + save — **disabled save** when not dirty or no file (see App wiring).

## Pitfalls

1. **Mutating `node.children.push`** in place — breaks React memoization and time-travel.
2. **Stale selection** after delete — we clear `selectedId` when removing the selected node.
3. **Renaming** the open file — we sync `editorNode` name when renaming selected id.

## Senior extensions

- **Optimistic CRUD** with server paths and **move** between folders.
- **Keyboard tree** (roving tabindex, `aria-expanded`).
- **Undo** stack capturing patches.

## 30-second talk track

“I keep the tree immutable with small pure helpers: update, delete, and add recurse by id so React gets new references only along the affected path. Selection drives an editor slice with explicit dirty tracking; save patches content back through the same update primitive. That keeps tree logic testable outside the components.”
