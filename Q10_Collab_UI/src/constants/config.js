export const ME = { id: "u1", name: "You", color: "#3b82f6" };

export const OTHER_USERS = [
  { id: "u2", name: "Alice", color: "#f59e0b" },
  { id: "u3", name: "Bob", color: "#10b981" },
];

export const INITIAL_BLOCKS = [
  { id: 1, type: "h1", content: "Collaborative Document" },
  {
    id: 2,
    type: "p",
    content:
      "Start typing here. Other users can edit simultaneously. Changes are synced in real-time using operational transforms.",
  },
  {
    id: 3,
    type: "p",
    content:
      "This demo simulates concurrent editing with cursor presence and conflict-free updates.",
  },
  {
    id: 4,
    type: "p",
    content: "Try editing this block while 'Alice' and 'Bob' make changes too!",
  },
];

export const MAX_LOG_ENTRIES = 20;
