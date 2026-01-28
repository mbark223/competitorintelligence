import { NextResponse } from 'next/server'

/**
 * Handle workflow errors and return appropriate HTTP responses
 */
export function handleWorkflowError(error: unknown, context: string): NextResponse {
  console.error(`[${context}] Error:`, error)

  if (error instanceof Error) {
    // Validation errors
    if (error.message.includes('validation') || error.message.includes('Validation')) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.message,
          context
        },
        { status: 400 }
      )
    }

    // Not found errors
    if (error.message.includes('not found') || error.message.includes('Not found')) {
      return NextResponse.json(
        {
          error: 'Resource not found',
          details: error.message,
          context
        },
        { status: 404 }
      )
    }

    // Rate limit errors
    if (error.message.includes('rate limit') || error.message.includes('Rate limit')) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          details: error.message,
          context
        },
        { status: 429 }
      )
    }

    // Timeout errors
    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      return NextResponse.json(
        {
          error: 'Request timeout',
          details: error.message,
          context
        },
        { status: 504 }
      )
    }
  }

  // Generic error response
  return NextResponse.json(
    {
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      context
    },
    { status: 500 }
  )
}

/**
 * Check if an error is retryable
 * Used with retry logic to determine if we should retry
 */
export function isRetryableError(error: Error): boolean {
  const retryableMessages = [
    'timeout',
    'ECONNRESET',
    'ENOTFOUND',
    'ETIMEDOUT',
    'rate limit',
    'temporarily unavailable',
    'try again',
    '429',
    '503',
    '504'
  ]

  const errorMessage = error.message.toLowerCase()
  return retryableMessages.some(msg => errorMessage.includes(msg))
}
