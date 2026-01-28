/**
 * Retry a function with exponential backoff
 * Useful for handling transient failures with external APIs
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')

      if (attempt === maxRetries) {
        throw lastError
      }

      const delay = initialDelay * Math.pow(backoffMultiplier, attempt)
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms - Error: ${lastError.message}`)

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

/**
 * Retry a function with exponential backoff and custom error handler
 * Allows for conditional retries based on error type
 */
export async function retryWithBackoffConditional<T>(
  fn: () => Promise<T>,
  shouldRetry: (error: Error) => boolean,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')

      // Check if we should retry this error
      if (!shouldRetry(lastError) || attempt === maxRetries) {
        throw lastError
      }

      const delay = initialDelay * Math.pow(backoffMultiplier, attempt)
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms - Error: ${lastError.message}`)

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}
