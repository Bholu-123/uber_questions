export function getFileIcon(name) {
  if (name.endsWith(".jsx") || name.endsWith(".tsx")) return "⚛️";
  if (name.endsWith(".js") || name.endsWith(".ts")) return "📜";
  if (name.endsWith(".css")) return "🎨";
  if (name.endsWith(".html")) return "🌐";
  if (name.endsWith(".json")) return "📦";
  if (name.endsWith(".md")) return "📝";
  return "📄";
}
