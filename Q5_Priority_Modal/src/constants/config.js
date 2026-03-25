export const MAX_LOG_ENTRIES = 20;

export const PRESETS = [
  {
    label: "Info (P3)",
    priority: 3,
    title: "Information",
    body: "This is a low-priority informational modal. Higher-priority modals will close this one.",
    primaryAction: "Got it",
    secondaryAction: "Dismiss",
    color: "#3b82f6",
  },
  {
    label: "Warning (P6)",
    priority: 6,
    title: "⚠️ Warning",
    body: "This is a medium-priority warning modal. It will close any lower-priority modals.",
    primaryAction: "Acknowledge",
    secondaryAction: "Cancel",
    color: "#f59e0b",
  },
  {
    label: "Critical (P9)",
    priority: 9,
    title: "🚨 Critical Alert",
    body: "HIGH PRIORITY: This critical modal automatically closes all lower-priority modals currently open!",
    primaryAction: "Take Action",
    secondaryAction: "Ignore",
    color: "#ef4444",
  },
];
