export function blocksReducer(state, action) {
  switch (action.type) {
    case "UPDATE_BLOCK":
      return state.map((b) =>
        b.id === action.id ? { ...b, content: action.content } : b,
      );
    case "INSERT_BLOCK": {
      const idx = state.findIndex((b) => b.id === action.afterId);
      const newBlock = {
        id: Date.now(),
        type: "p",
        content: action.text || "",
      };
      return [...state.slice(0, idx + 1), newBlock, ...state.slice(idx + 1)];
    }
    case "DELETE_BLOCK":
      return state.length > 1 ? state.filter((b) => b.id !== action.id) : state;
    case "REMOTE_INSERT":
      return state.map((b) =>
        b.id === action.blockId
          ? { ...b, content: b.content + action.text }
          : b,
      );
    default:
      return state;
  }
}
