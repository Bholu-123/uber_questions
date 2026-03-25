export class TaskScheduler {
  constructor(maxConcurrency = 2) {
    this.maxConcurrency = maxConcurrency;
    this.running = 0;
    this.queue = [];
    this.timers = new Map(); // taskId -> timerId
    this.onUpdate = null;
  }

  _notify(event) {
    if (this.onUpdate) this.onUpdate(event);
  }

  _tryRun() {
    while (this.running < this.maxConcurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      this._execute(task);
    }
  }

  async _execute(task) {
    this.running++;
    this._notify({ type: "start", taskId: task.id });
    try {
      const result = await task.fn();
      task.onSuccess?.(result);
      this._notify({ type: "success", taskId: task.id, result });
    } catch (err) {
      task.onError?.(err);
      this._notify({
        type: "error",
        taskId: task.id,
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      this.running--;
      this._tryRun();
    }
  }

  schedule(id, fn, delayMs = 0, onSuccess, onError) {
    const timerId = setTimeout(() => {
      this.timers.delete(id);
      this.queue.push({ id, fn, onSuccess, onError });
      this._notify({ type: "queued", taskId: id });
      this._tryRun();
    }, delayMs);
    this.timers.set(id, timerId);
    this._notify({ type: "scheduled", taskId: id, delay: delayMs });
  }

  scheduleAtFixedInterval(id, fn, intervalMs) {
    const run = async () => {
      await new Promise((resolve, reject) => {
        this.queue.push({
          id,
          fn,
          onSuccess: resolve,
          onError: reject,
        });
        this._notify({ type: "queued", taskId: id });
        this._tryRun();
      }).catch(() => {});

      const timerId = setTimeout(run, intervalMs);
      this.timers.set(id, timerId);
    };

    this._notify({
      type: "scheduled",
      taskId: id,
      delay: 0,
      interval: intervalMs,
    });
    run();
  }

  cancel(id) {
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id));
      this.timers.delete(id);
      this._notify({ type: "cancelled", taskId: id });
    }
    this.queue = this.queue.filter((t) => t.id !== id);
  }

  destroy() {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers.clear();
    this.queue = [];
  }
}
