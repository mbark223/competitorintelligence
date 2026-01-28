import { NextRequest, NextResponse } from 'next/server'
import { airtableClient } from '@/lib/integrations/airtable'

/**
 * GET /api/ads
 * Returns all ads from Airtable with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const brandId = searchParams.get('brand')
    const status = searchParams.get('status')
    const displayFormat = searchParams.get('format')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    const search = searchParams.get('search')
    const hasAnalysis = searchParams.get('analyzed')

    const filters: {
      brandId?: string
      status?: string
      displayFormat?: string
      limit?: number
      offset?: number
    } = {}

    if (brandId) filters.brandId = brandId
    if (status) filters.status = status
    if (displayFormat) filters.displayFormat = displayFormat
    if (limit) filters.limit = parseInt(limit, 10)
    if (offset) filters.offset = parseInt(offset, 10)

    let ads = await airtableClient.getAllAds(filters)

    // Client-side filtering for search and analysis status
    if (search) {
      const searchLower = search.toLowerCase()
      ads = ads.filter(ad =>
        ad.adCopy?.toLowerCase().includes(searchLower) ||
        ad.pageName?.toLowerCase().includes(searchLower)
      )
    }

    if (hasAnalysis !== null) {
      const wantsAnalyzed = hasAnalysis === 'true'
      ads = ads.filter(ad => !!ad.analysisCompleted === wantsAnalyzed)
    }

    // Enhance with brand names
    const enhancedAds = await Promise.all(
      ads.map(async (ad) => {
        if (ad.brandRecordId) {
          const brand = await airtableClient.getBrandRecord(ad.brandRecordId)
          return {
            ...ad,
            brandName: brand?.brandName || 'Unknown'
          }
        }
        return {
          ...ad,
          brandName: ad.pageName || 'Unknown'
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: enhancedAds,
      count: enhancedAds.length
    })
  } catch (error) {
    console.error('GET /api/ads error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch ads',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
