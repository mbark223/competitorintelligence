import { NextRequest, NextResponse } from 'next/server'
import { executeAdAnalysisWorkflow } from '@/lib/workflows/ad-analysis'
import { validateAdAnalysisPayload } from '@/lib/utils/validation'
import { handleWorkflowError } from '@/lib/utils/error-handler'

/**
 * POST /api/webhooks/ad-analysis
 *
 * Webhook endpoint for triggering ad analysis jobs
 * This is called by Airtable automations or external triggers
 *
 * Expected payload:
 * {
 *   "limit": 50,  // Optional: max number of ads to analyze (default: 50)
 *   "startDate": "2026-01-20",  // Optional: only analyze ads after this date
 *   "adIds": ["recXXX", "recYYY"]  // Optional: specific ad IDs to analyze
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse webhook payload
    const rawPayload = await request.json()
    console.log('Received ad-analysis webhook:', JSON.stringify(rawPayload, null, 2))

    // Validate webhook data
    const validatedPayload = validateAdAnalysisPayload(rawPayload)
    console.log('Payload validated successfully')

    // Execute workflow asynchronously
    // Return 202 Accepted immediately and process in background
    executeAdAnalysisWorkflow(validatedPayload).catch((error) => {
      console.error('Ad analysis workflow failed:', error)
    })

    return NextResponse.json(
      {
        status: 'accepted',
        message: 'Ad analysis queued for processing',
        limit: validatedPayload.limit
      },
      { status: 202 }
    )
  } catch (error) {
    return handleWorkflowError(error, 'ad-analysis-webhook')
  }
}

/**
 * GET /api/webhooks/ad-analysis
 *
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    webhook: 'ad-analysis',
    message: 'Webhook endpoint is active'
  })
}
