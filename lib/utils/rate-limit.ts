export interface RateLimitOptions {
  interval: number
  uniqueTokenPerInterval: number
}

interface RateLimitStore {
  tokens: Map<string, number[]>
  timeout: NodeJS.Timeout | null
}

export function rateLimit(options: RateLimitOptions) {
  const store: RateLimitStore = {
    tokens: new Map(),
    timeout: null,
  }

  const { interval, uniqueTokenPerInterval } = options

  // Clear tokens after interval
  const clearTokens = () => {
    store.tokens.clear()
    store.timeout = null
  }

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        // Initialize token storage if needed
        if (!store.tokens.has(token)) {
          store.tokens.set(token, [])
        }

        // Get current token timestamps
        const tokenTimestamps = store.tokens.get(token) || []
        const now = Date.now()

        // Filter out timestamps older than current interval
        const validTimestamps = tokenTimestamps.filter((timestamp) => now - timestamp < interval)

        // Check if limit is reached
        if (validTimestamps.length >= limit) {
          return reject(new Error("Rate limit exceeded"))
        }

        // Add current timestamp
        validTimestamps.push(now)
        store.tokens.set(token, validTimestamps)

        // Set cleanup timeout if not already set
        if (store.tokens.size > 0 && !store.timeout) {
          store.timeout = setTimeout(clearTokens, interval)
        }

        // Ensure we're not storing too many tokens
        if (store.tokens.size > uniqueTokenPerInterval) {
          // Get oldest token
          const oldestToken = [...store.tokens.entries()].sort((a, b) => a[1][0] - b[1][0])[0][0]
          store.tokens.delete(oldestToken)
        }

        resolve()
      }),
  }
}
