import { TreeNode } from "./TreeNode";

export function Sidebar({ tree, selectedId, onAddRootFile, ...treeProps }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>EXPLORER</span>
        <button
          className="icon-btn"
          title="New File at root"
          onClick={onAddRootFile}
        >
          📄
        </button>
      </div>
      <div className="tree-scroll">
        <TreeNode node={tree} selectedId={selectedId} {...treeProps} />
      </div>
    </div>
  );
}
