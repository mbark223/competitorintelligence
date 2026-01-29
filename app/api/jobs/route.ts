import { NextRequest, NextResponse } from 'next/server'
import { airtableClient } from '@/lib/integrations/airtable'
import { z } from 'zod'
import { JobStatus } from '@/types/airtable'

// Validation schema for creating a job
const CreateJobSchema = z.object({
  name: z.string().min(1, 'Job name is required'),
  brandIds: z.array(z.string()).min(1, 'At least one brand is required'),
  autoTrigger: z.boolean().optional()
})

/**
 * GET /api/jobs
 * Returns all jobs from Airtable with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') as JobStatus | null
    const brandId = searchParams.get('brand')
    const limit = searchParams.get('limit')

    const filters: { status?: JobStatus; brandId?: string; limit?: number } = {}

    if (status) filters.status = status
    if (brandId) filters.brandId = brandId
    if (limit) filters.limit = parseInt(limit, 10)

    const jobs = await airtableClient.getAllJobs(filters)

    // Enhance jobs with brand names
    const enhancedJobs = await Promise.all(
      jobs.map(async (job) => {
        const brands = await airtableClient.getBrandRecords(job.brandRecordIds)
        return {
          ...job,
          brandNames: brands.map(b => b.brandName)
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: enhancedJobs,
      count: enhancedJobs.length
    })
  } catch (error) {
    console.error('GET /api/jobs error:', error)
    // Better error serialization for debugging
    const errorMessage = error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null
        ? JSON.stringify(error)
        : String(error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch jobs',
        message: errorMessage
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/jobs
 * Creates a new job in Airtable and optionally triggers the webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validationResult = CreateJobSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }

    const { name, brandIds, autoTrigger } = validationResult.data

    // Create job in Airtable with Pending status
    const newJob = await airtableClient.createJob({
      name,
      brandIds,
      status: 'Pending'
    })

    // If autoTrigger is true, call the webhook
    if (autoTrigger) {
      try {
        // Get the base URL for the webhook call
        const baseUrl = request.nextUrl.origin

        // Trigger the ad-fetch-jobs webhook
        const webhookResponse = await fetch(`${baseUrl}/api/webhooks/ad-fetch-jobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            recordId: newJob.recordId
          })
        })

        if (!webhookResponse.ok) {
          console.error('Failed to trigger webhook:', await webhookResponse.text())
          // Don't fail the job creation if webhook fails
        }
      } catch (webhookError) {
        console.error('Error triggering webhook:', webhookError)
        // Don't fail the job creation if webhook fails
      }
    }

    // Get brand names for response
    const brands = await airtableClient.getBrandRecords(newJob.brandRecordIds)

    return NextResponse.json({
      success: true,
      data: {
        ...newJob,
        brandNames: brands.map(b => b.brandName),
        autoTriggered: autoTrigger || false
      }
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/jobs error:', error)
    // Better error serialization for debugging
    const errorMessage = error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null
        ? JSON.stringify(error)
        : String(error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create job',
        message: errorMessage
      },
      { status: 500 }
    )
  }
}
