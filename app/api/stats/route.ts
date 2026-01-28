import { NextResponse } from 'next/server'
import { airtableClient } from '@/lib/integrations/airtable'

/**
 * GET /api/stats
 * Returns dashboard statistics
 */
export async function GET() {
  try {
    const stats = await airtableClient.getStats()

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('GET /api/stats error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stats',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
