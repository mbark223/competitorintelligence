import { NextRequest, NextResponse } from 'next/server'
import { TargetingResults } from '@/types/targeting'
import { generateKeywords } from '@/lib/targeting/keywords'
import { generateInfluencers } from '@/lib/targeting/influencers'
import { generateInterestCategories } from '@/lib/targeting/interests'

export async function POST(request: NextRequest) {
  try {
    const { profile } = await request.json()

    if (!profile || profile.trim().length < 20) {
      return NextResponse.json(
        { error: 'Invalid profile description' },
        { status: 400 }
      )
    }

    // Generate targeting data based on the profile
    const keywords = await generateKeywords(profile)
    const influencers = await generateInfluencers(profile)
    const interestCategories = await generateInterestCategories(profile)

    const results: TargetingResults = {
      keywords: keywords.keywords,
      negativeKeywords: keywords.negativeKeywords,
      influencers,
      interestCategories,
      profile,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error generating targeting:', error)
    return NextResponse.json(
      { error: 'Failed to generate targeting' },
      { status: 500 }
    )
  }
}