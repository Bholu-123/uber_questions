export class SlidingWindowRateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.timestamps = [];
  }

  _prune(now) {
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);
  }

  canRequest() {
    const now = Date.now();
    this._prune(now);
    return this.timestamps.length < this.maxRequests;
  }

  record() {
    this.timestamps.push(Date.now());
  }

  getInfo() {
    const now = Date.now();
    this._prune(now);

    const used = this.timestamps.length;
    const remaining = this.maxRequests - used;
    const resetIn =
      this.timestamps.length > 0
        ? Math.max(0, this.windowMs - (now - this.timestamps[0]))
        : 0;
    return { used, remaining, resetIn };
  }
}
