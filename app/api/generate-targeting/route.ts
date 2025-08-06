import { NextRequest, NextResponse } from 'next/server'
import { TargetingService } from '@/lib/services/targetingService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keyword } = body

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      )
    }

    const targetingData = await TargetingService.generateTargeting(keyword.trim())

    return NextResponse.json(targetingData)
  } catch (error) {
    console.error('Error generating targeting:', error)
    return NextResponse.json(
      { error: 'Failed to generate targeting data' },
      { status: 500 }
    )
  }
}