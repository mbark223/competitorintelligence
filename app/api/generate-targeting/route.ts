import { NextRequest, NextResponse } from 'next/server'
import { TargetingResults } from '@/types/targeting'
import { generateKeywords } from '@/lib/targeting/keywords'
import { generateInfluencers } from '@/lib/targeting/influencers'
import { generateInterestCategories } from '@/lib/targeting/interests'
import { enrichProfileWithClaude4Prompt, generateEnrichedTargetingPrompt } from '@/lib/targeting/prompt-enrichment'

export async function POST(request: NextRequest) {
  try {
    const { profile } = await request.json()

    if (!profile || profile.trim().length < 20) {
      return NextResponse.json(
        { error: 'Invalid profile description' },
        { status: 400 }
      )
    }

    // Enrich the profile using Claude 4-style prompt analysis
    const enrichedProfile = enrichProfileWithClaude4Prompt(profile)
    const enrichedPrompt = generateEnrichedTargetingPrompt(enrichedProfile)

    // Generate targeting data based on the enriched profile
    const keywords = await generateKeywords(enrichedPrompt)
    const influencers = await generateInfluencers(enrichedPrompt)
    const interestCategories = await generateInterestCategories(enrichedPrompt)

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