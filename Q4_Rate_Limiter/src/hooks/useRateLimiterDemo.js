import { useCallback, useRef, useState } from "react";
import { DEFAULT_MAX_REQUESTS, DEFAULT_WINDOW_SEC } from "../constants/config";
import { SlidingWindowRateLimiter } from "./rateLimiter";

async function callApi(id) {
  await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
  return `Response for request #${id}`;
}

export function useRateLimiterDemo() {
  const [maxReqs, setMaxReqs] = useState(DEFAULT_MAX_REQUESTS);
  const [windowSec, setWindowSec] = useState(DEFAULT_WINDOW_SEC);
  const [log, setLog] = useState([]);
  const [info, setInfo] = useState({
    used: 0,
    remaining: DEFAULT_MAX_REQUESTS,
    resetIn: 0,
  });

  const limiterRef = useRef(
    new SlidingWindowRateLimiter(
      DEFAULT_MAX_REQUESTS,
      DEFAULT_WINDOW_SEC * 1000,
    ),
  );
  const reqCounterRef = useRef(0);

  const updateLimiter = useCallback((max, win) => {
    limiterRef.current = new SlidingWindowRateLimiter(max, win * 1000);
    setInfo({ used: 0, remaining: max, resetIn: 0 });
    setLog([]);
    reqCounterRef.current = 0;
  }, []);

  const makeRequest = useCallback(async () => {
    const limiter = limiterRef.current;

    if (!limiter.canRequest()) {
      const { resetIn } = limiter.getInfo();
      setLog((prev) => [
        {
          id: Date.now(),
          type: "blocked",
          msg: `🚫 Request blocked — limit reached. Resets in ${(resetIn / 1000).toFixed(1)}s`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
      setInfo(limiter.getInfo());
      return;
    }

    const id = ++reqCounterRef.current;
    limiter.record();
    setInfo(limiter.getInfo());

    setLog((prev) => [
      {
        id: Date.now(),
        type: "pending",
        msg: `⏳ Request #${id} sent…`,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    try {
      const result = await callApi(id);
      setLog((prev) => [
        {
          id: Date.now() + 1,
          type: "success",
          msg: `✅ ${result}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev.slice(1),
      ]);
    } catch {
      setLog((prev) => [
        {
          id: Date.now() + 1,
          type: "error",
          msg: `❌ Request #${id} failed`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev.slice(1),
      ]);
    }

    setInfo(limiter.getInfo());
  }, []);

  const clearLog = useCallback(() => {
    setLog([]);
    reqCounterRef.current = 0;
  }, []);

  const usedPct = maxReqs ? (info.used / maxReqs) * 100 : 0;

  return {
    maxReqs,
    setMaxReqs,
    windowSec,
    setWindowSec,
    log,
    info,
    usedPct,
    updateLimiter,
    makeRequest,
    clearLog,
  };
}
