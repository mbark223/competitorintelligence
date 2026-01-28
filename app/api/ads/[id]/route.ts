import { NextRequest, NextResponse } from 'next/server'
import { airtableClient } from '@/lib/integrations/airtable'

/**
 * GET /api/ads/[id]
 * Returns a single ad by recordId with full details including analysis
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Ad ID is required' },
        { status: 400 }
      )
    }

    const ad = await airtableClient.getAdRecord(id)

    if (!ad) {
      return NextResponse.json(
        { success: false, error: 'Ad not found' },
        { status: 404 }
      )
    }

    // Get brand name
    let brandName = ad.pageName || 'Unknown'
    if (ad.brandRecordId) {
      const brand = await airtableClient.getBrandRecord(ad.brandRecordId)
      if (brand) {
        brandName = brand.brandName
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...ad,
        brandName
      }
    })
  } catch (error) {
    console.error(`GET /api/ads/${params.id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch ad',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
