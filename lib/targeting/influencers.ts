import { Influencer } from '@/types/targeting'
import { nflInfluencers } from '@/lib/data/nfl-influencers'
import { genericInfluencers } from '@/lib/data/generic-influencers'
import { analyzeProfile } from './generic-analyzer'

export async function generateInfluencers(profile: string): Promise<Influencer[]> {
  const profileLower = profile.toLowerCase()
  const influencers: Influencer[] = []
  const analysis = analyzeProfile(profile)

  // Check if this is NFL-related
  if (analysis.isNFL) {
    // Add official NFL accounts
    influencers.push(...nflInfluencers.official)

    // Add media personalities
    influencers.push(...nflInfluencers.media)

    // Add relevant players based on profile
    if (profileLower.includes('fantasy')) {
      // For fantasy, include top players
      influencers.push(...nflInfluencers.players.slice(0, 10))
    }

    // Add team-specific influencers
    Object.entries(nflInfluencers.teams).forEach(([team, teamInfluencers]) => {
      if (profileLower.includes(team.toLowerCase())) {
        influencers.push(...teamInfluencers)
      }
    })
  }

  // Add industry-specific influencers
  analysis.industries.forEach(industry => {
    if (genericInfluencers[industry]) {
      influencers.push(...genericInfluencers[industry])
    }
  })

  // Extract brand mentions and add relevant accounts
  const brandMentions = extractBrands(profile)
  brandMentions.forEach(brand => {
    influencers.push({
      handle: `@${brand.replace(/\s+/g, '')}`,
      name: brand,
      followerCount: 1000000, // Default estimate
      relevanceScore: 8,
      category: 'macro' as const,
    })
  })

  // Remove duplicates based on handle
  const uniqueInfluencers = Array.from(
    new Map(influencers.map(inf => [inf.handle, inf])).values()
  )

  // Sort by relevance score and follower count
  return uniqueInfluencers.sort((a, b) => {
    const scoreA = (a.relevanceScore || 0) * (a.followerCount || 0)
    const scoreB = (b.relevanceScore || 0) * (b.followerCount || 0)
    return scoreB - scoreA
  })
}

function extractBrands(text: string): string[] {
  const brands: string[] = []
  
  // Common brand indicators
  const brandPatterns = [
    /\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\b/g, // Capitalized words
  ]
  
  // Known brands across industries
  const knownBrands = [
    'Nike', 'Adidas', 'Apple', 'Microsoft', 'Google', 'Amazon', 'Facebook', 'Instagram',
    'TikTok', 'YouTube', 'Starbucks', 'McDonald\'s', 'Coca Cola', 'Pepsi', 'Samsung',
    'Tesla', 'Netflix', 'Spotify', 'Uber', 'Airbnb', 'LinkedIn', 'Twitter', 'Reddit'
  ]
  
  knownBrands.forEach(brand => {
    if (text.toLowerCase().includes(brand.toLowerCase())) {
      brands.push(brand)
    }
  })
  
  return [...new Set(brands)]
}