import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./App.css";

// ─── Utilities ─────────────────────────────────────────────────────────
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function throttle(fn, limit) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn(...args);
    }
  };
}

// ─── Mock message stream ───────────────────────────────────────────────
const BOT_NAMES = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
const BOT_MESSAGES = [
  "This stream is live! 🔴",
  "Anyone watching from India? 🇮🇳",
  "Great content as always 👏",
  "LFG! 🚀",
  "How long has the stream been on?",
  "Let's goo! 🎉",
  "First time here, this is awesome!",
  "Can you explain that again?",
  "GG EZ 💪",
  "POG 😮",
];

let msgIdCounter = 0;
const randomMessage = () => ({
  id: ++msgIdCounter,
  user: BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)],
  text: BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)],
  ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  type: "bot",
});

const MAX_MESSAGES = 200;

// ─── Component ─────────────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // bot typing indicator
  const [stickToBottom, setStickToBottom] = useState(true);
  const [newCount, setNewCount] = useState(0);
  const [viewers, setViewers] = useState(1247);

  const feedRef = useRef(null);
  const streamIntervalRef = useRef(null);

  // Auto-scroll logic
  const scrollToBottom = useCallback(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
    setNewCount(0);
  }, []);

  useEffect(() => {
    if (stickToBottom) scrollToBottom();
    else if (messages.length > 0) setNewCount((n) => n + 1);
  }, [messages, stickToBottom, scrollToBottom]);

  const handleScroll = useMemo(() =>
    throttle(() => {
      const el = feedRef.current;
      if (!el) return;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
      setStickToBottom(isAtBottom);
      if (isAtBottom) setNewCount(0);
    }, 100),
    []
  );

  // Start / stop stream
  const toggleStream = () => {
    if (isStreaming) {
      clearInterval(streamIntervalRef.current);
      setIsStreaming(false);
      setIsTyping(false);
    } else {
      setIsStreaming(true);
      streamIntervalRef.current = setInterval(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => {
            const next = [...prev, randomMessage()];
            return next.slice(-MAX_MESSAGES);
          });
        }, 600);
      }, 1200);
    }
  };

  // Cleanup on unmount
  useEffect(() => () => clearInterval(streamIntervalRef.current), []);

  // Debounced typing indicator for own input
  const [showOwnTyping, setShowOwnTyping] = useState(false);
  const debouncedStopTyping = useMemo(() => debounce(() => setShowOwnTyping(false), 1000), []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setShowOwnTyping(true);
    debouncedStopTyping();
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: ++msgIdCounter,
        user: "You",
        text,
        ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "self",
      },
    ].slice(-MAX_MESSAGES));
    setInput("");
    setShowOwnTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="app">
      <div className="stream-header">
        <div className="stream-info">
          <span className={`live-dot ${isStreaming ? "live-dot--live" : ""}`} />
          <span className="live-label">{isStreaming ? "LIVE" : "OFFLINE"}</span>
          <span className="viewers">👁 {viewers.toLocaleString()} viewers</span>
        </div>
        <button className={`btn ${isStreaming ? "btn--stop" : "btn--start"}`} onClick={toggleStream}>
          {isStreaming ? "⏹ Stop Stream" : "▶ Start Stream"}
        </button>
      </div>

      <div className="chat-wrapper">
        <div className="chat-feed" ref={feedRef} onScroll={handleScroll}>
          {messages.length === 0 && (
            <div className="empty">Start the stream to see messages</div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`message message--${msg.type}`}>
              <span className={`message-user message-user--${msg.type}`}>{msg.user}</span>
              <span className="message-text">{msg.text}</span>
              <span className="message-ts">{msg.ts}</span>
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator">
              <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
            </div>
          )}
        </div>

        {!stickToBottom && newCount > 0 && (
          <button className="new-msgs-btn" onClick={() => { setStickToBottom(true); scrollToBottom(); }}>
            ↓ {newCount} new messages
          </button>
        )}

        <div className="chat-input-row">
          <input
            className="chat-input"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            maxLength={200}
          />
          <button className="send-btn" onClick={sendMessage} disabled={!input.trim()}>
            Send
          </button>
        </div>
        {showOwnTyping && <div className="own-typing">You are typing…</div>}
      </div>
    </div>
  );
}
