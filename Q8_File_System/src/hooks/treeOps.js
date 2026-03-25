export function updateNode(tree, id, updater) {
  if (tree.id === id) return updater(tree);
  if (!tree.children) return tree;
  return {
    ...tree,
    children: tree.children.map((c) => updateNode(c, id, updater)),
  };
}

export function deleteNode(tree, id) {
  if (!tree.children) return tree;
  return {
    ...tree,
    children: tree.children
      .filter((c) => c.id !== id)
      .map((c) => deleteNode(c, id)),
  };
}

export function addNode(tree, parentId, newNode) {
  return updateNode(tree, parentId, (node) => ({
    ...node,
    expanded: true,
    children: [...(node.children || []), newNode],
  }));
}

export function findNode(tree, id) {
  if (tree.id === id) return tree;
  for (const child of tree.children || []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}
