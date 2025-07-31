import { Keyword } from '@/types/targeting'
import { nflKeywords } from '@/lib/data/nfl-keywords'
import { analyzeProfile } from './generic-analyzer'
import { getGamingKeywords, getGamingNegativeKeywords } from '@/lib/data/gaming-keywords'

export async function generateKeywords(profile: string) {
  const profileLower = profile.toLowerCase()
  const keywords: Keyword[] = []
  const negativeKeywords: string[] = []
  
  const analysis = analyzeProfile(profile)
  
  // Check for gaming/gambling keywords
  const isGambling = profileLower.includes('betting') || profileLower.includes('casino') || 
                     profileLower.includes('gambl') || profileLower.includes('wager') ||
                     profileLower.includes('sportsbook')
  const isSportsbook = profileLower.includes('sports') && isGambling
  const isCasino = profileLower.includes('casino') || profileLower.includes('slots')

  // Check if this is NFL-related
  if (analysis.isNFL) {
    // Add NFL-specific keywords
    keywords.push(...nflKeywords.general.map(kw => ({
      text: kw,
      matchType: 'broad' as const,
      category: 'General NFL'
    })))

    // Add team-specific keywords if mentioned
    Object.entries(nflKeywords.teams).forEach(([team, teamKeywords]) => {
      if (profileLower.includes(team.toLowerCase())) {
        keywords.push(...teamKeywords.map(kw => ({
          text: kw,
          matchType: 'phrase' as const,
          category: `${team} Team`
        })))
      }
    })

    // Add fantasy football keywords if relevant
    if (profileLower.includes('fantasy')) {
      keywords.push(...nflKeywords.fantasy.map(kw => ({
        text: kw,
        matchType: 'broad' as const,
        category: 'Fantasy Football'
      })))
    }

    // Add merchandise keywords if relevant
    if (profileLower.includes('merchandise') || profileLower.includes('gear')) {
      keywords.push(...nflKeywords.merchandise.map(kw => ({
        text: kw,
        matchType: 'broad' as const,
        category: 'NFL Merchandise'
      })))
    }

    // Add negative keywords
    negativeKeywords.push(...nflKeywords.negative)
  }

  // Generate industry-specific keywords
  analysis.industries.forEach((industry: string) => {
    const industryKeywords = generateIndustryKeywords(industry, profile)
    keywords.push(...industryKeywords)
  })

  // Generate behavior-based keywords
  analysis.behaviors.forEach(behavior => {
    const behaviorKeywords = generateBehaviorKeywords(behavior, profile, analysis.industries)
    keywords.push(...behaviorKeywords)
  })

  // Add general keywords based on profile analysis
  const generalKeywords = extractGeneralKeywords(profile)
  keywords.push(...generalKeywords)

  // Generate negative keywords based on context
  const contextNegatives = generateNegativeKeywords(analysis.industries)
  negativeKeywords.push(...contextNegatives)
  
  // Add gaming-specific keywords if applicable
  if (isGambling) {
    const gamingType = isSportsbook && isCasino ? 'both' : isSportsbook ? 'sportsbook' : 'icasino'
    const gamingKeywordsList = getGamingKeywords(gamingType)
    
    gamingKeywordsList.forEach((kw, index) => {
      keywords.push({
        text: kw,
        matchType: index % 3 === 0 ? 'broad' : index % 3 === 1 ? 'phrase' : 'exact',
        category: isSportsbook ? 'Sports Betting' : 'Online Casino'
      })
    })
    
    // Add gaming negative keywords
    negativeKeywords.push(...getGamingNegativeKeywords())
  }
  
  // Ensure minimum keyword count (50+)
  if (keywords.length < 50) {
    // Generate additional long-tail keywords
    const longTailKeywords = generateLongTailKeywords(profile, analysis)
    keywords.push(...longTailKeywords)
  }
  
  // Add seasonal/trending keywords
  const seasonalKeywords = generateSeasonalKeywords(analysis.industries)
  keywords.push(...seasonalKeywords)
  
  // Remove duplicates
  const uniqueKeywords = Array.from(
    new Map(keywords.map(k => [k.text.toLowerCase(), k])).values()
  )

  return { keywords: uniqueKeywords, negativeKeywords: [...new Set(negativeKeywords)] }
}

function generateIndustryKeywords(industry: string, profile: string): Keyword[] {
  const keywords: Keyword[] = []
  
  const industryTerms: Record<string, string[]> = {
    'technology': ['software', 'app', 'platform', 'digital solution', 'tech tools', 'SaaS', 'cloud', 'AI', 'automation'],
    'fashion': ['clothing', 'apparel', 'fashion trends', 'style', 'outfits', 'fashion brands', 'designer', 'fashion week'],
    'fitness': ['workout', 'gym', 'fitness app', 'exercise', 'personal trainer', 'fitness goals', 'health', 'wellness'],
    'food': ['restaurant', 'food delivery', 'recipes', 'cooking', 'cuisine', 'dining', 'foodie', 'chef'],
    'travel': ['vacation', 'travel deals', 'destinations', 'hotels', 'flights', 'travel tips', 'tourism', 'travel guide'],
    'gaming': ['video games', 'gaming console', 'PC gaming', 'esports', 'game streaming', 'gaming setup', 'gamers'],
    'music': ['music streaming', 'concerts', 'artists', 'albums', 'playlists', 'music festival', 'live music'],
    'beauty': ['skincare', 'makeup', 'beauty products', 'cosmetics', 'beauty tips', 'beauty brands', 'salon'],
    'finance': ['investing', 'trading', 'financial planning', 'cryptocurrency', 'stocks', 'personal finance', 'fintech'],
    'education': ['online courses', 'learning platform', 'education', 'training', 'certification', 'e-learning', 'students'],
    'sports': ['sports news', 'athletes', 'sports teams', 'sports events', 'sports gear', 'sports fans', 'championship'],
    'entertainment': ['streaming', 'movies', 'TV shows', 'entertainment news', 'celebrities', 'content', 'binge watching'],
  }
  
  const terms = industryTerms[industry] || []
  terms.forEach(term => {
    keywords.push({
      text: term,
      matchType: 'broad',
      category: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Industry`
    })
  })
  
  return keywords
}

function generateBehaviorKeywords(behavior: string, profile: string, industries: string[]): Keyword[] {
  const keywords: Keyword[] = []
  
  const behaviorTemplates: Record<string, string[]> = {
    'purchase': ['buy online', 'shop for', 'best deals', 'discount', 'sale', 'purchase'],
    'engage': ['community', 'discussion', 'share', 'comment', 'interact', 'engagement'],
    'follow': ['follow', 'subscribe', 'fan page', 'updates', 'news', 'content'],
    'consume': ['watch', 'stream', 'read', 'listen', 'view', 'content consumption'],
    'create': ['create content', 'share', 'post', 'upload', 'user generated', 'creator'],
    'search': ['how to', 'best', 'top', 'guide', 'tips', 'reviews', 'comparison'],
  }
  
  const templates = behaviorTemplates[behavior] || []
  
  // Combine behavior templates with industries
  industries.forEach((industry: string) => {
    templates.forEach(template => {
      keywords.push({
        text: `${template} ${industry}`,
        matchType: 'phrase',
        category: 'Behavioral Targeting'
      })
    })
  })
  
  // Add standalone behavior keywords
  templates.forEach(template => {
    keywords.push({
      text: template,
      matchType: 'broad',
      category: 'Behavioral Targeting'
    })
  })
  
  return keywords
}

function generateNegativeKeywords(industries: string[]): string[] {
  const negatives: string[] = []
  
  // Industry-specific negatives
  const industryNegatives: Record<string, string[]> = {
    'technology': ['free', 'crack', 'torrent', 'pirated'],
    'fashion': ['fake', 'replica', 'counterfeit', 'knockoff'],
    'fitness': ['steroids', 'illegal', 'dangerous'],
    'food': ['poison', 'expired', 'contaminated'],
    'finance': ['scam', 'fraud', 'ponzi', 'illegal'],
  }
  
  industries.forEach((industry: string) => {
    if (industryNegatives[industry]) {
      negatives.push(...industryNegatives[industry])
    }
  })
  
  // Universal negatives
  negatives.push('free', 'illegal', 'scam', 'fake', 'spam')
  
  return [...new Set(negatives)] // Remove duplicates
}

function extractGeneralKeywords(profile: string): Keyword[] {
  const keywords: Keyword[] = []
  const words = profile.toLowerCase().split(/\s+/)

  // Extract key terms and create variations
  const keyTerms = new Set<string>()
  
  // Look for action words and interests
  const actionWords = ['watch', 'follow', 'buy', 'purchase', 'engage', 'participate']
  const interestWords = ['fan', 'enthusiast', 'viewer', 'supporter']
  
  words.forEach((word, index) => {
    if (actionWords.includes(word) && words[index + 1]) {
      keyTerms.add(`${word} ${words[index + 1]}`)
    }
    if (interestWords.includes(word) && words[index - 1]) {
      keyTerms.add(`${words[index - 1]} ${word}`)
    }
  })

  keyTerms.forEach(term => {
    keywords.push({
      text: term,
      matchType: 'phrase',
      category: 'Profile-based'
    })
  })

  return keywords
}

function generateLongTailKeywords(profile: string, analysis: any): Keyword[] {
  const keywords: Keyword[] = []
  const words = profile.toLowerCase().split(/\s+/)
  
  // Generate question-based keywords
  const questionStarters = ['how to', 'what is', 'where to', 'when to', 'why', 'best way to']
  const actions = ['find', 'choose', 'select', 'buy', 'get', 'start', 'learn']
  
  analysis.industries.forEach((industry: string) => {
    questionStarters.forEach((starter: string) => {
      keywords.push({
        text: `${starter} ${industry}`,
        matchType: 'phrase',
        category: 'Long-tail Questions'
      })
    })
    
    actions.forEach((action: string) => {
      keywords.push({
        text: `${action} ${industry} online`,
        matchType: 'phrase',
        category: 'Long-tail Actions'
      })
    })
  })
  
  // Generate location-based keywords if applicable
  if (analysis.demographics.location && analysis.demographics.location.length > 0) {
    analysis.demographics.location.forEach((location: string) => {
      analysis.industries.forEach((industry: string) => {
        keywords.push({
          text: `${industry} ${location}`,
          matchType: 'phrase',
          category: 'Location-based'
        })
      })
    })
  }
  
  // Generate demographic-based keywords
  if (analysis.demographics.ageRange) {
    analysis.industries.forEach((industry: string) => {
      keywords.push({
        text: `${industry} for ${analysis.demographics.ageRange}`,
        matchType: 'phrase',
        category: 'Demographic Targeting'
      })
    })
  }
  
  return keywords
}

function generateSeasonalKeywords(industries: string[]): Keyword[] {
  const keywords: Keyword[] = []
  const currentMonth = new Date().getMonth()
  
  const seasons = {
    'spring': [2, 3, 4],
    'summer': [5, 6, 7],
    'fall': [8, 9, 10],
    'winter': [11, 0, 1]
  }
  
  const currentSeason = Object.entries(seasons).find(([_, months]) => 
    months.includes(currentMonth)
  )?.[0] || 'spring'
  
  const events = {
    'spring': ['spring break', 'easter', 'tax season'],
    'summer': ['summer vacation', 'fourth of july', 'back to school'],
    'fall': ['halloween', 'black friday', 'thanksgiving'],
    'winter': ['christmas', 'new year', 'valentines day']
  }
  
  industries.forEach((industry: string) => {
    // Season-specific keywords
    keywords.push({
      text: `${currentSeason} ${industry}`,
      matchType: 'broad',
      category: 'Seasonal'
    })
    
    // Event-specific keywords
    events[currentSeason as keyof typeof events]?.forEach((event: string) => {
      keywords.push({
        text: `${event} ${industry}`,
        matchType: 'phrase',
        category: 'Event-based'
      })
    })
  })
  
  return keywords
}