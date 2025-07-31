export function analyzeProfile(profile: string) {
  const profileLower = profile.toLowerCase()
  
  // Extract key concepts and industries
  const industries = detectIndustries(profileLower)
  const demographics = extractDemographics(profileLower)
  const behaviors = extractBehaviors(profileLower)
  const interests = extractInterests(profileLower)
  
  return {
    industries,
    demographics,
    behaviors,
    interests,
    isNFL: profileLower.includes('nfl') || profileLower.includes('football'),
  }
}

function detectIndustries(text: string): string[] {
  const industries = []
  
  const industryKeywords = {
    'technology': ['tech', 'software', 'app', 'digital', 'ai', 'saas', 'startup'],
    'fashion': ['fashion', 'clothing', 'apparel', 'style', 'outfit', 'designer'],
    'fitness': ['fitness', 'gym', 'workout', 'exercise', 'health', 'wellness'],
    'food': ['food', 'restaurant', 'dining', 'cuisine', 'cooking', 'chef'],
    'travel': ['travel', 'vacation', 'trip', 'tourism', 'destination', 'hotel'],
    'gaming': ['gaming', 'gamer', 'video game', 'esports', 'console', 'pc gaming'],
    'music': ['music', 'concert', 'artist', 'album', 'spotify', 'musician'],
    'beauty': ['beauty', 'makeup', 'skincare', 'cosmetics', 'salon'],
    'finance': ['finance', 'investment', 'trading', 'crypto', 'banking', 'money'],
    'education': ['education', 'learning', 'course', 'student', 'university', 'training'],
    'sports': ['sports', 'athlete', 'team', 'game', 'championship', 'league'],
    'entertainment': ['entertainment', 'movie', 'tv', 'show', 'netflix', 'streaming'],
  }
  
  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      industries.push(industry)
    }
  }
  
  return industries
}

function extractDemographics(text: string): Record<string, any> {
  const demographics: Record<string, any> = {}
  
  // Age extraction
  const ageMatch = text.match(/(\d{1,2})-(\d{1,2})|aged? (\d{1,2})/i)
  if (ageMatch) {
    demographics.ageRange = ageMatch[0]
  }
  
  // Gender extraction
  if (text.includes('women') || text.includes('female')) demographics.gender = 'female'
  if (text.includes('men') || text.includes('male')) demographics.gender = 'male'
  
  // Location extraction
  const locations = ['urban', 'suburban', 'rural', 'city', 'metro']
  locations.forEach(loc => {
    if (text.includes(loc)) demographics.location = loc
  })
  
  return demographics
}

function extractBehaviors(text: string): string[] {
  const behaviors = []
  
  const behaviorPatterns = {
    'purchase': ['buy', 'purchase', 'shop', 'order'],
    'engage': ['engage', 'interact', 'comment', 'share', 'like'],
    'follow': ['follow', 'subscribe', 'fan'],
    'consume': ['watch', 'read', 'listen', 'view'],
    'create': ['create', 'post', 'upload', 'write'],
    'search': ['search', 'look for', 'find', 'discover'],
  }
  
  for (const [behavior, keywords] of Object.entries(behaviorPatterns)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      behaviors.push(behavior)
    }
  }
  
  return behaviors
}

function extractInterests(text: string): string[] {
  const interests = []
  const words = text.split(/\s+/)
  
  // Look for interest indicators
  const interestIndicators = ['interested in', 'love', 'enjoy', 'passionate about', 'fan of']
  
  interestIndicators.forEach(indicator => {
    const index = text.indexOf(indicator)
    if (index !== -1) {
      const afterIndicator = text.substring(index + indicator.length, index + indicator.length + 50)
      const nextWords = afterIndicator.split(/\s+/).slice(0, 3).join(' ')
      if (nextWords) interests.push(nextWords)
    }
  })
  
  return interests
}