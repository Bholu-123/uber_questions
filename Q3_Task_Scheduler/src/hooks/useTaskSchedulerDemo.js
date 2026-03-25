import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_MAX_CONCURRENCY,
  INTERVAL_MS,
  MAX_LOG_ENTRIES,
} from "../constants/config";
import { TaskScheduler } from "./taskScheduler";

function makeMockTask(label) {
  return () =>
    new Promise((resolve, reject) => {
      const duration = 800 + Math.random() * 1200;
      setTimeout(() => {
        if (Math.random() < 0.15) reject(new Error("Random failure"));
        else resolve(`${label} done in ${Math.round(duration)}ms`);
      }, duration);
    });
}

function formatUpdateMessage({ type, taskId, result, error, delay, interval }) {
  const withDelay = delay ? ` (delay: ${delay}ms)` : "";
  const withInterval = interval ? ` (interval: ${interval}ms)` : "";

  const msgs = {
    scheduled: `📅 Task ${taskId} scheduled${withDelay}${withInterval}`,
    queued: `🕐 Task ${taskId} queued`,
    start: `▶️  Task ${taskId} started`,
    success: `✅ Task ${taskId}: ${result}`,
    error: `❌ Task ${taskId}: ${error}`,
    cancelled: `🚫 Task ${taskId} cancelled`,
  };

  return { msg: msgs[type] || type, type };
}

export function useTaskSchedulerDemo() {
  const [maxConcurrency, setMaxConcurrency] = useState(DEFAULT_MAX_CONCURRENCY);
  const [log, setLog] = useState([]);
  const [taskStates, setTaskStates] = useState({});

  const schedulerRef = useRef(null);
  const counterRef = useRef(0);

  const addLog = useCallback((msg, type = "info") => {
    setLog((prev) => [
      {
        id: Date.now() + Math.random(),
        msg,
        type,
        time: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, MAX_LOG_ENTRIES - 1),
    ]);
  }, []);

  useEffect(() => {
    const scheduler = new TaskScheduler(maxConcurrency);
    schedulerRef.current = scheduler;

    scheduler.onUpdate = (update) => {
      const { msg, type } = formatUpdateMessage(update);
      setTaskStates((prev) => ({ ...prev, [update.taskId]: update.type }));
      addLog(msg, type);
    };

    return () => scheduler.destroy();
  }, [maxConcurrency, addLog]);

  const addOnce = useCallback(() => {
    const id = `T${++counterRef.current}`;
    const delay = Math.floor(Math.random() * 500);
    schedulerRef.current?.schedule(id, makeMockTask(id), delay);
  }, []);

  const addInterval = useCallback(() => {
    const id = `I${++counterRef.current}`;
    schedulerRef.current?.scheduleAtFixedInterval(
      id,
      makeMockTask(id),
      INTERVAL_MS,
    );
  }, []);

  const clearLog = useCallback(() => setLog([]), []);

  return {
    maxConcurrency,
    setMaxConcurrency,
    log,
    taskStates,
    addOnce,
    addInterval,
    clearLog,
  };
}
