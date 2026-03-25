/**
 * Process items with asyncFn with at most `limit` concurrent.
 * Results are returned in original order with per-item status.
 */
export async function mapAsyncLimit(items, limit, asyncFn) {
  const results = new Array(items.length);
  const executing = new Set();

  for (let i = 0; i < items.length; i++) {
    const promise = Promise.resolve()
      .then(() => asyncFn(items[i], i))
      .then(
        (result) => {
          results[i] = { status: "fulfilled", value: result };
          executing.delete(promise);
        },
        (err) => {
          results[i] = {
            status: "rejected",
            reason: err instanceof Error ? err.message : String(err),
          };
          executing.delete(promise);
        },
      );

    executing.add(promise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}
