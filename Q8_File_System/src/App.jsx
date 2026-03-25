import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { EditorPanel } from "./components/EditorPanel";
import { useFileExplorer } from "./hooks/useFileExplorer";

export default function App() {
  const {
    tree,
    selectedId,
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
  } = useFileExplorer();

  return (
    <div className="ide">
      <Sidebar
        tree={tree}
        selectedId={selectedId}
        onAddRootFile={() => addNodeTo(1, "file")}
        onSelect={select}
        onToggle={toggle}
        onDelete={deleteNodeById}
        onAdd={addNodeTo}
        onRename={rename}
      />

      <EditorPanel
        editorNode={editorNode}
        editorContent={editorContent}
        dirty={dirty}
        onSave={save}
        onChangeContent={updateEditorContent}
      />
    </div>
  );
}
