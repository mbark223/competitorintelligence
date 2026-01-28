import { NextRequest, NextResponse } from 'next/server'
import { airtableClient } from '@/lib/integrations/airtable'
import { z } from 'zod'

// Validation schema for updating a brand
const UpdateBrandSchema = z.object({
  brandName: z.string().min(2).max(100).optional(),
  facebookPageUrl: z.string().url().refine(
    (url) => url.includes('facebook.com'),
    { message: 'Must be a Facebook URL' }
  ).optional()
}).refine(data => data.brandName !== undefined || data.facebookPageUrl !== undefined, {
  message: 'At least one field must be provided for update'
})

/**
 * GET /api/brands/[id]
 * Returns a single brand by recordId
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Brand ID is required' },
        { status: 400 }
      )
    }

    const brand = await airtableClient.getBrandRecord(id)

    if (!brand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: brand
    })
  } catch (error) {
    console.error(`GET /api/brands/${params.id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch brand',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/brands/[id]
 * Updates an existing brand
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
        { success: false, error: 'Brand ID is required' },
        { status: 400 }
      )
    }

    // Validate request body
    const validationResult = UpdateBrandSchema.safeParse(body)

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

    const updateData = validationResult.data

    // Update brand in Airtable
    await airtableClient.updateBrand(id, updateData)

    // Fetch updated brand to return
    const updatedBrand = await airtableClient.getBrandRecord(id)

    return NextResponse.json({
      success: true,
      data: updatedBrand
    })
  } catch (error) {
    console.error(`PUT /api/brands/${params.id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update brand',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/brands/[id]
 * Deletes a brand
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Brand ID is required' },
        { status: 400 }
      )
    }

    // Delete brand from Airtable
    await airtableClient.deleteBrand(id)

    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully'
    })
  } catch (error) {
    console.error(`DELETE /api/brands/${params.id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete brand',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
