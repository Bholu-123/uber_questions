import { useState, useRef, useCallback } from "react";
import { MAX_CONCURRENT, BAR_DURATION_MS } from "../constants/config";

/**
 * @typedef {'queued'|'running'|'done'} BarStatus
 * @typedef {{ id: number, progress: number, status: BarStatus }} Bar
 */

let idCounter = 0;

/**
 * Manages a queue of progress bars, running at most MAX_CONCURRENT at a time.
 * @returns {{ bars: Bar[], addBar: () => void, clearAll: () => void }}
 */
export function useProgressQueue() {
  const [bars, setBars] = useState(/** @type {Bar[]} */ ([]));
  const runningRef = useRef(0);
  const queueRef = useRef(/** @type {number[]} */ ([]));

  const startBar = useCallback((id) => {
    runningRef.current += 1;
    const startTime = Date.now();

    setBars((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "running", startTime } : b))
    );

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / BAR_DURATION_MS) * 100, 100);

      setBars((prev) =>
        prev.map((b) => (b.id === id ? { ...b, progress } : b))
      );

      if (progress < 100) {
        requestAnimationFrame(tick);
      } else {
        setBars((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "done" } : b))
        );
        runningRef.current -= 1;

        if (queueRef.current.length > 0) {
          const nextId = queueRef.current.shift();
          startBar(nextId);
        }
      }
    };

    requestAnimationFrame(tick);
  }, []);

  const addBar = useCallback(() => {
    const id = ++idCounter;
    setBars((prev) => [...prev, { id, progress: 0, status: "queued" }]);

    if (runningRef.current < MAX_CONCURRENT) {
      startBar(id);
    } else {
      queueRef.current.push(id);
    }
  }, [startBar]);

  const clearAll = useCallback(() => {
    setBars([]);
    runningRef.current = 0;
    queueRef.current = [];
    idCounter = 0;
  }, []);

  return { bars, addBar, clearAll };
}
