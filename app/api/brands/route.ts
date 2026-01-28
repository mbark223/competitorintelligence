import { NextRequest, NextResponse } from 'next/server'
import { airtableClient } from '@/lib/integrations/airtable'
import { z } from 'zod'

// Validation schema for creating a brand
const CreateBrandSchema = z.object({
  brandName: z.string().min(2, 'Brand name must be at least 2 characters').max(100, 'Brand name must be at most 100 characters'),
  facebookPageUrl: z.string().url('Must be a valid URL').refine(
    (url) => url.includes('facebook.com'),
    { message: 'Must be a Facebook URL' }
  )
})

/**
 * GET /api/brands
 * Returns all brands from Airtable
 */
export async function GET() {
  try {
    const brands = await airtableClient.getAllBrands()

    return NextResponse.json({
      success: true,
      data: brands,
      count: brands.length
    })
  } catch (error) {
    console.error('GET /api/brands error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch brands',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/brands
 * Creates a new brand in Airtable
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validationResult = CreateBrandSchema.safeParse(body)

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

    const { brandName, facebookPageUrl } = validationResult.data

    // Create brand in Airtable
    const newBrand = await airtableClient.createBrand({
      brandName,
      facebookPageUrl
    })

    return NextResponse.json({
      success: true,
      data: newBrand
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/brands error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create brand',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
