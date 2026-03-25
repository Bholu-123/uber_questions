import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BOT_MESSAGES,
  BOT_NAMES,
  BOT_TYPING_MS,
  INITIAL_VIEWERS,
  MAX_MESSAGES,
  STREAM_INTERVAL_MS,
} from "../constants/config";
import { debounce, throttle } from "./timing";

function randomMessage(nextId) {
  return {
    id: nextId,
    user: BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)],
    text: BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)],
    ts: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: "bot",
  };
}

export function useLiveChatDemo() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [stickToBottom, setStickToBottom] = useState(true);
  const [newCount, setNewCount] = useState(0);
  const [viewers] = useState(INITIAL_VIEWERS);

  const [showOwnTyping, setShowOwnTyping] = useState(false);

  const feedRef = useRef(null);
  const streamIntervalRef = useRef(null);
  const msgIdCounterRef = useRef(0);

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

  const handleScroll = useMemo(
    () =>
      throttle(() => {
        const el = feedRef.current;
        if (!el) return;
        const isAtBottom =
          el.scrollHeight - el.scrollTop - el.clientHeight < 30;
        setStickToBottom(isAtBottom);
        if (isAtBottom) setNewCount(0);
      }, 100),
    [],
  );

  const stopOwnTypingDebounced = useMemo(
    () => debounce(() => setShowOwnTyping(false), 1000),
    [],
  );

  const handleInputChange = useCallback(
    (e) => {
      setInput(e.target.value);
      setShowOwnTyping(true);
      stopOwnTypingDebounced();
    },
    [stopOwnTypingDebounced],
  );

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    const id = ++msgIdCounterRef.current;

    setMessages((prev) =>
      [
        ...prev,
        {
          id,
          user: "You",
          text,
          ts: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: "self",
        },
      ].slice(-MAX_MESSAGES),
    );
    setInput("");
    setShowOwnTyping(false);
  }, [input]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  const toggleStream = useCallback(() => {
    if (isStreaming) {
      clearInterval(streamIntervalRef.current);
      setIsStreaming(false);
      setIsTyping(false);
      return;
    }

    setIsStreaming(true);
    streamIntervalRef.current = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => {
          const nextId = ++msgIdCounterRef.current;
          const next = [...prev, randomMessage(nextId)];
          return next.slice(-MAX_MESSAGES);
        });
      }, BOT_TYPING_MS);
    }, STREAM_INTERVAL_MS);
  }, [isStreaming]);

  useEffect(() => () => clearInterval(streamIntervalRef.current), []);

  const jumpToBottom = useCallback(() => {
    setStickToBottom(true);
    scrollToBottom();
  }, [scrollToBottom]);

  return {
    feedRef,
    messages,
    input,
    isStreaming,
    isTyping,
    stickToBottom,
    newCount,
    viewers,
    showOwnTyping,
    toggleStream,
    handleScroll,
    handleInputChange,
    handleKeyDown,
    sendMessage,
    jumpToBottom,
  };
}
