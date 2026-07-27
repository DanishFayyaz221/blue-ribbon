// Agentbox limits:
//   - 20 requests per 5s window per API key (throughput)
//   - separate concurrent-request cap (undocumented but ~4-5); firing 7 in
//     parallel returned "Concurrent Rate Limit Exceeded"
// This gate enforces both. Wrap every outbound call with withRateLimit().

const WINDOW_MS = 5000;
const MAX_PER_WINDOW = 20;
const MAX_CONCURRENT = 4;

const timestamps: number[] = [];
let inflight = 0;
const waiters: Array<() => void> = [];

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForSlot(): Promise<void> {
  while (true) {
    const now = Date.now();
    while (timestamps.length && now - timestamps[0]! > WINDOW_MS) {
      timestamps.shift();
    }
    if (inflight < MAX_CONCURRENT && timestamps.length < MAX_PER_WINDOW) {
      timestamps.push(now);
      inflight++;
      return;
    }
    if (inflight >= MAX_CONCURRENT) {
      await new Promise<void>((r) => waiters.push(r));
    } else {
      await sleep(WINDOW_MS - (now - timestamps[0]!) + 10);
    }
  }
}

function release(): void {
  inflight--;
  const next = waiters.shift();
  if (next) next();
}

export async function withRateLimit<T>(fn: () => Promise<T>): Promise<T> {
  await waitForSlot();
  try {
    return await fn();
  } finally {
    release();
  }
}
