import { NextRequest, NextResponse } from 'next/server'
import { airtableClient } from '@/lib/integrations/airtable'
import { z } from 'zod'
import { JobStatus } from '@/types/airtable'

// Validation schema for updating a job
const UpdateJobSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(['Pending', 'Running', 'Completed', 'Failed'] as const).optional(),
  brandIds: z.array(z.string()).min(1).optional(),
  triggerNow: z.boolean().optional()
}).refine(data => data.name !== undefined || data.status !== undefined || data.brandIds !== undefined || data.triggerNow, {
  message: 'At least one field must be provided for update or triggerNow must be true'
})

/**
 * GET /api/jobs/[id]
 * Returns a single job by recordId with enhanced details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      )
    }

    const job = await airtableClient.getAdFetchJob(id)

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      )
    }

    // Get brand names
    const brands = await airtableClient.getBrandRecords(job.brandRecordIds)

    return NextResponse.json({
      success: true,
      data: {
        ...job,
        brandNames: brands.map(b => b.brandName)
      }
    })
  } catch (error) {
    console.error(`GET /api/jobs/${params.id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch job',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/jobs/[id]
 * Updates an existing job or triggers it
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Validate request body
    const validationResult = UpdateJobSchema.safeParse(body)

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

    const { name, status, brandIds, triggerNow } = validationResult.data

    // If triggerNow is true, call the webhook
    if (triggerNow) {
      try {
        const baseUrl = request.nextUrl.origin

        const webhookResponse = await fetch(`${baseUrl}/api/webhooks/ad-fetch-jobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            recordId: id
          })
        })

        if (!webhookResponse.ok) {
          console.error('Failed to trigger webhook:', await webhookResponse.text())
          return NextResponse.json(
            {
              success: false,
              error: 'Failed to trigger job'
            },
            { status: 500 }
          )
        }

        // Fetch updated job
        const updatedJob = await airtableClient.getAdFetchJob(id)
        const brands = await airtableClient.getBrandRecords(updatedJob!.brandRecordIds)

        return NextResponse.json({
          success: true,
          data: {
            ...updatedJob,
            brandNames: brands.map(b => b.brandName)
          },
          message: 'Job triggered successfully'
        })
      } catch (webhookError) {
        console.error('Error triggering webhook:', webhookError)
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to trigger job'
          },
          { status: 500 }
        )
      }
    }

    // Otherwise, update job fields
    const updateData: { name?: string; status?: JobStatus; brandIds?: string[] } = {}

    if (name) updateData.name = name
    if (status) updateData.status = status
    if (brandIds) updateData.brandIds = brandIds

    await airtableClient.updateJob(id, updateData)

    // Fetch updated job to return
    const updatedJob = await airtableClient.getAdFetchJob(id)
    const brands = await airtableClient.getBrandRecords(updatedJob!.brandRecordIds)

    return NextResponse.json({
      success: true,
      data: {
        ...updatedJob,
        brandNames: brands.map(b => b.brandName)
      }
    })
  } catch (error) {
    console.error(`PUT /api/jobs/${params.id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update job',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/jobs/[id]
 * Deletes a job
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Delete job from Airtable
    await airtableClient.deleteJob(id)

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    })
  } catch (error) {
    console.error(`DELETE /api/jobs/${params.id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete job',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
