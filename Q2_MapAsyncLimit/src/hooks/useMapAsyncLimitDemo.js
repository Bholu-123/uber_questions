import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_CONCURRENCY_LIMIT,
  FAIL_TASK_ID,
  ITEM_COUNT,
} from "../constants/config";
import { mapAsyncLimit } from "./mapAsyncLimit";

function makeItems() {
  return Array.from({ length: ITEM_COUNT }, (_, i) => ({
    id: i + 1,
    shouldFail: i + 1 === FAIL_TASK_ID,
  }));
}

function mockFetch(item) {
  const delay = 500 + Math.random() * 1500;
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (item.shouldFail) reject(new Error(`Task ${item.id} failed!`));
      else
        resolve(`✅ Result for Task ${item.id} (took ${Math.round(delay)}ms)`);
    }, delay),
  );
}

export function useMapAsyncLimitDemo() {
  const [limit, setLimit] = useState(DEFAULT_CONCURRENCY_LIMIT);
  const [results, setResults] = useState([]);
  const [taskStatus, setTaskStatus] = useState({});
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(null);

  const items = useMemo(() => makeItems(), []);

  const run = useCallback(async () => {
    setResults([]);
    setTaskStatus({});
    setRunning(true);
    setElapsed(null);

    const startTime = Date.now();

    const trackedFn = async (item) => {
      setTaskStatus((prev) => ({ ...prev, [item.id]: "running" }));
      try {
        const result = await mockFetch(item);
        setTaskStatus((prev) => ({ ...prev, [item.id]: "done" }));
        return result;
      } catch (err) {
        setTaskStatus((prev) => ({ ...prev, [item.id]: "error" }));
        throw err;
      }
    };

    const res = await mapAsyncLimit(items, limit, trackedFn);
    setResults(res);
    setElapsed(((Date.now() - startTime) / 1000).toFixed(1));
    setRunning(false);
  }, [items, limit]);

  return {
    items,
    limit,
    setLimit,
    results,
    taskStatus,
    running,
    elapsed,
    run,
  };
}
