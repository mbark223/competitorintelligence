import { Influencer } from '@/types/targeting'
import { nflInfluencers } from '@/lib/data/nfl-influencers'
import { genericInfluencers } from '@/lib/data/generic-influencers'
import { analyzeProfile } from './generic-analyzer'
import { getGamingInfluencers } from '@/lib/data/gaming-influencers'

export async function generateInfluencers(profile: string): Promise<Influencer[]> {
  const profileLower = profile.toLowerCase()
  const influencers: Influencer[] = []
  const analysis = analyzeProfile(profile)
  
  // Check for gaming/gambling keywords
  const isGambling = profileLower.includes('betting') || profileLower.includes('casino') || 
                     profileLower.includes('gambl') || profileLower.includes('wager') ||
                     profileLower.includes('sportsbook')
  const isSportsbook = profileLower.includes('sports') && isGambling
  const isCasino = profileLower.includes('casino') || profileLower.includes('slots')

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

  // Add gaming-specific influencers if applicable
  if (isGambling) {
    const gamingType = isSportsbook && isCasino ? 'both' : isSportsbook ? 'sportsbook' : 'icasino'
    const gamingInfluencersList = getGamingInfluencers(gamingType)
    influencers.push(...gamingInfluencersList)
  }
  
  // Generate additional micro-influencers based on interests
  const microInfluencers = generateMicroInfluencers(analysis, profileLower)
  influencers.push(...microInfluencers)
  
  // Add niche community leaders
  const communityLeaders = generateCommunityLeaders(analysis)
  influencers.push(...communityLeaders)
  
  // Remove duplicates based on handle
  const uniqueInfluencers = Array.from(
    new Map(influencers.map(inf => [inf.handle, inf])).values()
  )

  // Ensure minimum 30+ influencers
  if (uniqueInfluencers.length < 30) {
    const additionalInfluencers = generateAdditionalInfluencers(analysis, uniqueInfluencers.length)
    uniqueInfluencers.push(...additionalInfluencers)
  }

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

function generateMicroInfluencers(analysis: any, profileLower: string): Influencer[] {
  const influencers: Influencer[] = []
  
  // Industry-specific micro-influencers
  const microInfluencerTemplates: Record<string, string[]> = {
    technology: ['TechGuru', 'CodeMaster', 'DevAdvocate', 'TechReviewer', 'StartupFounder'],
    fashion: ['StyleBlogger', 'FashionDaily', 'OutfitIdeas', 'TrendSetter', 'StyleGuide'],
    fitness: ['FitCoach', 'GymMotivation', 'HealthyLiving', 'WorkoutTips', 'NutritionExpert'],
    food: ['FoodBlogger', 'RecipeShare', 'FoodieLove', 'ChefLife', 'RestaurantReview'],
    travel: ['TravelBlogger', 'Wanderlust', 'TravelTips', 'DestinationGuide', 'TravelDeals'],
    gaming: ['GameStreamer', 'GamingNews', 'ESportsDaily', 'GameReviews', 'GamingTips'],
    music: ['MusicBlogger', 'NewMusic', 'ConcertLife', 'MusicReviews', 'PlaylistCurator'],
    beauty: ['BeautyGuru', 'MakeupTips', 'SkincareExpert', 'BeautyReviews', 'BeautyDeals'],
    finance: ['FinanceExpert', 'InvestmentTips', 'MoneyAdvice', 'CryptoNews', 'StockMarket'],
    sports: ['SportsAnalyst', 'TeamNews', 'SportsStats', 'GameHighlights', 'SportsBetting']
  }
  
  analysis.industries.forEach((industry: string) => {
    const templates = microInfluencerTemplates[industry] || []
    templates.forEach(template => {
      influencers.push({
        handle: `@${template}${Math.floor(Math.random() * 99) + 1}`,
        name: `${template} Account`,
        followerCount: Math.floor(Math.random() * 90000) + 10000,
        relevanceScore: 6,
        category: 'micro'
      })
    })
  })
  
  return influencers
}

function generateCommunityLeaders(analysis: any): Influencer[] {
  const leaders: Influencer[] = []
  
  // Reddit community leaders
  analysis.industries.forEach((industry: string) => {
    leaders.push({
      handle: `@r_${industry}`,
      name: `r/${industry} Community`,
      followerCount: 50000,
      relevanceScore: 7,
      category: 'micro'
    })
  })
  
  // Discord and forum leaders
  if (analysis.behaviors.socialMedia.includes('active poster') || 
      analysis.behaviors.socialMedia.includes('engager')) {
    leaders.push({
      handle: '@CommunityMod',
      name: 'Community Moderator',
      followerCount: 25000,
      relevanceScore: 6,
      category: 'nano'
    })
  }
  
  return leaders
}

function generateAdditionalInfluencers(analysis: any, currentCount: number): Influencer[] {
  const additional: Influencer[] = []
  const needed = 30 - currentCount
  
  // Media outlets
  const mediaOutlets = [
    { handle: '@Forbes', name: 'Forbes', followerCount: 18000000, relevanceScore: 8, category: 'macro' as const },
    { handle: '@WSJ', name: 'Wall Street Journal', followerCount: 19000000, relevanceScore: 8, category: 'macro' as const },
    { handle: '@BusinessInsider', name: 'Business Insider', followerCount: 3500000, relevanceScore: 7, category: 'macro' as const },
    { handle: '@TechCrunch', name: 'TechCrunch', followerCount: 10000000, relevanceScore: 8, category: 'macro' as const },
    { handle: '@Mashable', name: 'Mashable', followerCount: 9000000, relevanceScore: 7, category: 'macro' as const },
  ]
  
  // Lifestyle influencers
  const lifestyleInfluencers = [
    { handle: '@garyvee', name: 'Gary Vaynerchuk', followerCount: 3000000, relevanceScore: 8, category: 'macro' as const },
    { handle: '@tferriss', name: 'Tim Ferriss', followerCount: 2000000, relevanceScore: 8, category: 'macro' as const },
    { handle: '@lewishowes', name: 'Lewis Howes', followerCount: 500000, relevanceScore: 7, category: 'micro' as const },
    { handle: '@marieforleo', name: 'Marie Forleo', followerCount: 300000, relevanceScore: 7, category: 'micro' as const },
  ]
  
  // Add random selection to meet minimum
  const allAdditional = [...mediaOutlets, ...lifestyleInfluencers]
  for (let i = 0; i < needed && i < allAdditional.length; i++) {
    additional.push(allAdditional[i])
  }
  
  return additional
}