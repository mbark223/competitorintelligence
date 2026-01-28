import { NextRequest, NextResponse } from 'next/server'
import { executeAdFetchWorkflow } from '@/lib/workflows/ad-fetch-jobs'
import { validateAdFetchPayload } from '@/lib/utils/validation'
import { handleWorkflowError } from '@/lib/utils/error-handler'

/**
 * POST /api/webhooks/ad-fetch-jobs
 *
 * Webhook endpoint for triggering ad fetch jobs
 * This is called by Airtable automations or external triggers
 *
 * Expected payload:
 * {
 *   "recordId": "recXXXXXXXXXXXXXX",
 *   "triggeredAt": "2026-01-28T10:00:00.000Z"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse webhook payload
    const rawPayload = await request.json()
    console.log('Received ad-fetch-jobs webhook:', JSON.stringify(rawPayload, null, 2))

    // Step 2: Transform and validate webhook data
    const validatedPayload = validateAdFetchPayload(rawPayload)
    console.log('Payload validated successfully:', validatedPayload.recordId)

    // Step 3: Execute workflow asynchronously
    // We return 202 Accepted immediately and process in background
    // This prevents timeout issues for long-running workflows
    executeAdFetchWorkflow(validatedPayload).catch((error) => {
      console.error('Workflow execution failed:', error)
      // Error handling is done within the workflow (updates Airtable status)
    })

    return NextResponse.json(
      {
        status: 'accepted',
        message: 'Ad fetch job queued for processing',
        jobId: validatedPayload.recordId
      },
      { status: 202 }
    )
  } catch (error) {
    return handleWorkflowError(error, 'ad-fetch-jobs-webhook')
  }
}

/**
 * GET /api/webhooks/ad-fetch-jobs
 *
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    webhook: 'ad-fetch-jobs',
    message: 'Webhook endpoint is active'
  })
}
