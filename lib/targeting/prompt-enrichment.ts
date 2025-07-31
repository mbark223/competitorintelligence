export interface EnrichedProfile {
  originalProfile: string
  demographics: {
    ageRange?: string
    gender?: string[]
    income?: string
    location?: string[]
    education?: string[]
    occupation?: string[]
  }
  psychographics: {
    values: string[]
    interests: string[]
    lifestyle: string[]
    personality: string[]
    motivations: string[]
  }
  behaviors: {
    onlineHabits: string[]
    purchasePatterns: string[]
    contentConsumption: string[]
    socialMedia: string[]
    deviceUsage: string[]
  }
  painPoints: string[]
  brandAffinities: string[]
  additionalInsights: string[]
}

export function enrichProfileWithClaude4Prompt(profile: string): EnrichedProfile {
  const enrichedProfile: EnrichedProfile = {
    originalProfile: profile,
    demographics: {},
    psychographics: {
      values: [],
      interests: [],
      lifestyle: [],
      personality: [],
      motivations: []
    },
    behaviors: {
      onlineHabits: [],
      purchasePatterns: [],
      contentConsumption: [],
      socialMedia: [],
      deviceUsage: []
    },
    painPoints: [],
    brandAffinities: [],
    additionalInsights: []
  }

  // Extract demographics
  enrichedProfile.demographics = extractDemographics(profile)
  
  // Extract psychographics
  enrichedProfile.psychographics = extractPsychographics(profile)
  
  // Extract behaviors
  enrichedProfile.behaviors = extractBehaviors(profile)
  
  // Extract pain points and needs
  enrichedProfile.painPoints = extractPainPoints(profile)
  
  // Extract brand affinities
  enrichedProfile.brandAffinities = extractBrandAffinities(profile)
  
  // Generate additional insights
  enrichedProfile.additionalInsights = generateAdditionalInsights(profile, enrichedProfile)
  
  return enrichedProfile
}

function extractDemographics(profile: string): EnrichedProfile['demographics'] {
  const demographics: EnrichedProfile['demographics'] = {}
  const profileLower = profile.toLowerCase()
  
  // Age extraction with expanded patterns
  const agePatterns = [
    /(\d{1,2})-(\d{1,2})/,
    /aged?\s+(\d{1,2})\s*-\s*(\d{1,2})/i,
    /(\d{1,2})\s*to\s*(\d{1,2})/i,
    /(young|middle-aged|senior|elderly|teen)/i,
    /(millennials?|gen\s*z|boomers?|gen\s*x)/i
  ]
  
  for (const pattern of agePatterns) {
    const match = profileLower.match(pattern)
    if (match) {
      if (match[1] && match[2] && !isNaN(Number(match[1]))) {
        demographics.ageRange = `${match[1]}-${match[2]}`
      } else if (match[1]) {
        const ageMap: Record<string, string> = {
          'young': '18-34',
          'millennials': '25-40',
          'gen z': '18-24',
          'middle-aged': '35-54',
          'gen x': '41-56',
          'boomers': '57-75',
          'senior': '55+',
          'elderly': '65+',
          'teen': '13-19'
        }
        demographics.ageRange = ageMap[match[1].toLowerCase()] || match[1]
      }
      break
    }
  }
  
  // Gender extraction
  const genderTerms = {
    female: ['women', 'woman', 'female', 'ladies', 'girls'],
    male: ['men', 'man', 'male', 'guys', 'boys'],
    neutral: ['people', 'individuals', 'customers', 'users']
  }
  
  demographics.gender = []
  for (const [gender, terms] of Object.entries(genderTerms)) {
    if (terms.some(term => profileLower.includes(term))) {
      demographics.gender.push(gender)
    }
  }
  
  // Income level extraction
  const incomeIndicators = {
    'high': ['affluent', 'wealthy', 'high-income', 'premium', 'luxury', 'executive'],
    'middle': ['middle-class', 'average income', 'moderate income', 'professional'],
    'budget': ['budget-conscious', 'value-seeking', 'cost-conscious', 'frugal']
  }
  
  for (const [level, indicators] of Object.entries(incomeIndicators)) {
    if (indicators.some(indicator => profileLower.includes(indicator))) {
      demographics.income = level
      break
    }
  }
  
  // Location extraction
  const locationTerms = ['urban', 'suburban', 'rural', 'city', 'metro', 'downtown', 'remote']
  demographics.location = locationTerms.filter(term => profileLower.includes(term))
  
  // Education extraction
  const educationTerms = ['college', 'university', 'degree', 'educated', 'student', 'graduate', 'phd', 'masters']
  demographics.education = educationTerms.filter(term => profileLower.includes(term))
  
  // Occupation extraction
  const occupationTerms = ['professional', 'executive', 'manager', 'entrepreneur', 'freelance', 'student', 'retired']
  demographics.occupation = occupationTerms.filter(term => profileLower.includes(term))
  
  return demographics
}

function extractPsychographics(profile: string): EnrichedProfile['psychographics'] {
  const profileLower = profile.toLowerCase()
  
  const psychographics: EnrichedProfile['psychographics'] = {
    values: [],
    interests: [],
    lifestyle: [],
    personality: [],
    motivations: []
  }
  
  // Values extraction
  const valueTerms = {
    sustainability: ['sustainable', 'eco-friendly', 'green', 'environmental'],
    quality: ['quality', 'premium', 'best', 'excellence'],
    innovation: ['innovative', 'cutting-edge', 'latest', 'new', 'advanced'],
    tradition: ['traditional', 'classic', 'timeless', 'heritage'],
    community: ['community', 'social', 'collaborative', 'together'],
    health: ['healthy', 'wellness', 'fitness', 'wellbeing'],
    convenience: ['convenient', 'easy', 'quick', 'efficient'],
    value: ['value', 'affordable', 'cost-effective', 'budget']
  }
  
  for (const [value, terms] of Object.entries(valueTerms)) {
    if (terms.some(term => profileLower.includes(term))) {
      psychographics.values.push(value)
    }
  }
  
  // Interests extraction (expanded)
  const interestPatterns = [
    'interested in', 'passionate about', 'love', 'enjoy', 'fan of', 
    'enthusiast', 'follower of', 'into', 'keen on'
  ]
  
  interestPatterns.forEach(pattern => {
    const regex = new RegExp(`${pattern}\\s+([\\w\\s,]+?)(?:\\.|,|and|$)`, 'gi')
    const matches = profile.matchAll(regex)
    for (const match of matches) {
      if (match[1]) {
        psychographics.interests.push(match[1].trim())
      }
    }
  })
  
  // Lifestyle extraction
  const lifestyleTerms = {
    active: ['active', 'athletic', 'sporty', 'fitness', 'gym'],
    social: ['social', 'outgoing', 'networking', 'events'],
    family: ['family', 'parents', 'kids', 'children'],
    career: ['career-focused', 'ambitious', 'professional', 'driven'],
    creative: ['creative', 'artistic', 'design', 'music', 'art'],
    tech: ['tech-savvy', 'digital', 'online', 'connected'],
    luxury: ['luxury', 'upscale', 'exclusive', 'vip'],
    casual: ['casual', 'relaxed', 'laid-back', 'easy-going']
  }
  
  for (const [lifestyle, terms] of Object.entries(lifestyleTerms)) {
    if (terms.some(term => profileLower.includes(term))) {
      psychographics.lifestyle.push(lifestyle)
    }
  }
  
  // Personality traits
  const personalityTerms = {
    adventurous: ['adventurous', 'explorer', 'risk-taker', 'bold'],
    conservative: ['conservative', 'traditional', 'cautious', 'careful'],
    trendy: ['trendy', 'fashionable', 'trend-setter', 'influencer'],
    practical: ['practical', 'pragmatic', 'rational', 'logical'],
    spontaneous: ['spontaneous', 'impulsive', 'flexible', 'adaptable']
  }
  
  for (const [trait, terms] of Object.entries(personalityTerms)) {
    if (terms.some(term => profileLower.includes(term))) {
      psychographics.personality.push(trait)
    }
  }
  
  // Motivations
  const motivationTerms = {
    achievement: ['achieve', 'success', 'accomplish', 'goals'],
    belonging: ['belong', 'community', 'connect', 'social'],
    security: ['secure', 'safe', 'stable', 'reliable'],
    recognition: ['recognition', 'status', 'prestige', 'respect'],
    growth: ['grow', 'learn', 'improve', 'develop']
  }
  
  for (const [motivation, terms] of Object.entries(motivationTerms)) {
    if (terms.some(term => profileLower.includes(term))) {
      psychographics.motivations.push(motivation)
    }
  }
  
  return psychographics
}

function extractBehaviors(profile: string): EnrichedProfile['behaviors'] {
  const profileLower = profile.toLowerCase()
  
  const behaviors: EnrichedProfile['behaviors'] = {
    onlineHabits: [],
    purchasePatterns: [],
    contentConsumption: [],
    socialMedia: [],
    deviceUsage: []
  }
  
  // Online habits
  const onlineHabitTerms = {
    'heavy internet user': ['always online', 'constantly connected', 'digital native'],
    'researcher': ['research', 'compare', 'review', 'investigate'],
    'early adopter': ['early adopter', 'first to try', 'beta tester'],
    'influencer': ['share', 'post', 'influence', 'content creator'],
    'lurker': ['browse', 'read', 'observe', 'passive']
  }
  
  for (const [habit, terms] of Object.entries(onlineHabitTerms)) {
    if (terms.some(term => profileLower.includes(term))) {
      behaviors.onlineHabits.push(habit)
    }
  }
  
  // Purchase patterns
  const purchaseTerms = {
    'impulse buyer': ['impulse', 'spontaneous purchase', 'quick decision'],
    'bargain hunter': ['deals', 'discounts', 'sales', 'coupons'],
    'brand loyal': ['loyal', 'repeat customer', 'brand preference'],
    'comparison shopper': ['compare prices', 'research before buying', 'read reviews'],
    'premium buyer': ['premium', 'high-end', 'luxury purchases']
  }
  
  for (const [pattern, terms] of Object.entries(purchaseTerms)) {
    if (terms.some(term => profileLower.includes(term))) {
      behaviors.purchasePatterns.push(pattern)
    }
  }
  
  // Content consumption
  const contentTerms = {
    'video content': ['watch videos', 'youtube', 'streaming', 'video'],
    'podcast listener': ['podcast', 'audio content', 'listen'],
    'article reader': ['read articles', 'blogs', 'news', 'publications'],
    'social media': ['social media', 'instagram', 'twitter', 'tiktok'],
    'live streams': ['live stream', 'twitch', 'live content']
  }
  
  for (const [content, terms] of Object.entries(contentTerms)) {
    if (terms.some(term => profileLower.includes(term))) {
      behaviors.contentConsumption.push(content)
    }
  }
  
  // Social media behavior
  const socialTerms = {
    'active poster': ['post', 'share', 'create content', 'upload'],
    'engager': ['comment', 'like', 'interact', 'engage'],
    'follower': ['follow', 'subscribe', 'fan'],
    'influencer': ['influence', 'followers', 'audience'],
    'browser': ['browse', 'scroll', 'lurk']
  }
  
  for (const [behavior, terms] of Object.entries(socialTerms)) {
    if (terms.some(term => profileLower.includes(term))) {
      behaviors.socialMedia.push(behavior)
    }
  }
  
  // Device usage
  const deviceTerms = {
    'mobile-first': ['mobile', 'smartphone', 'app', 'on-the-go'],
    'desktop user': ['desktop', 'computer', 'laptop', 'pc'],
    'multi-device': ['multiple devices', 'cross-device', 'tablet'],
    'smart home': ['smart home', 'iot', 'connected devices'],
    'wearables': ['smartwatch', 'fitness tracker', 'wearable']
  }
  
  for (const [usage, terms] of Object.entries(deviceTerms)) {
    if (terms.some(term => profileLower.includes(term))) {
      behaviors.deviceUsage.push(usage)
    }
  }
  
  return behaviors
}

function extractPainPoints(profile: string): string[] {
  const painPoints: string[] = []
  const profileLower = profile.toLowerCase()
  
  // Pain point indicators
  const painIndicators = [
    'struggle with', 'frustrated by', 'challenge', 'problem', 'issue',
    'difficulty', 'pain point', 'need help with', 'looking for solution',
    'want to improve', 'seeking', 'need', 'lack', 'missing'
  ]
  
  painIndicators.forEach(indicator => {
    const regex = new RegExp(`${indicator}\\s+([\\w\\s]+?)(?:\\.|,|and|$)`, 'gi')
    const matches = profile.matchAll(regex)
    for (const match of matches) {
      if (match[1]) {
        painPoints.push(match[1].trim())
      }
    }
  })
  
  // Common pain points by context
  if (profileLower.includes('busy') || profileLower.includes('time')) {
    painPoints.push('time constraints')
  }
  if (profileLower.includes('budget') || profileLower.includes('cost')) {
    painPoints.push('budget limitations')
  }
  if (profileLower.includes('complex') || profileLower.includes('confus')) {
    painPoints.push('complexity')
  }
  
  return [...new Set(painPoints)]
}

function extractBrandAffinities(profile: string): string[] {
  const brands: string[] = []
  const profileLower = profile.toLowerCase()
  
  // Tech brands
  const techBrands = ['apple', 'google', 'microsoft', 'amazon', 'netflix', 'spotify', 'tesla']
  // Fashion brands  
  const fashionBrands = ['nike', 'adidas', 'zara', 'h&m', 'gucci', 'louis vuitton']
  // Food brands
  const foodBrands = ['starbucks', 'mcdonalds', 'coca cola', 'pepsi']
  // Social brands
  const socialBrands = ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'linkedin']
  
  const allBrands = [...techBrands, ...fashionBrands, ...foodBrands, ...socialBrands]
  
  allBrands.forEach(brand => {
    if (profileLower.includes(brand)) {
      brands.push(brand.charAt(0).toUpperCase() + brand.slice(1))
    }
  })
  
  // Extract any capitalized words that might be brands
  const capitalizedWords = profile.match(/\b[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*\b/g) || []
  capitalizedWords.forEach(word => {
    if (word.length > 3 && !brands.includes(word)) {
      brands.push(word)
    }
  })
  
  return [...new Set(brands)]
}

function generateAdditionalInsights(profile: string, enrichedProfile: EnrichedProfile): string[] {
  const insights: string[] = []
  
  // Generate insights based on combinations
  if (enrichedProfile.demographics.ageRange && enrichedProfile.psychographics.values.length > 0) {
    insights.push(`${enrichedProfile.demographics.ageRange} age group with ${enrichedProfile.psychographics.values.join(', ')} values`)
  }
  
  if (enrichedProfile.behaviors.purchasePatterns.includes('impulse buyer') && 
      enrichedProfile.behaviors.deviceUsage.includes('mobile-first')) {
    insights.push('Mobile-optimized impulse purchase opportunities')
  }
  
  if (enrichedProfile.psychographics.lifestyle.includes('active') && 
      enrichedProfile.psychographics.values.includes('health')) {
    insights.push('Health-conscious active lifestyle segment')
  }
  
  // Time-based insights
  const timeTerms = ['morning', 'evening', 'weekend', 'weekday', 'lunch', 'commute']
  timeTerms.forEach(term => {
    if (profile.toLowerCase().includes(term)) {
      insights.push(`Active during ${term} hours`)
    }
  })
  
  // Seasonal insights
  const seasonTerms = ['summer', 'winter', 'spring', 'fall', 'holiday', 'seasonal']
  seasonTerms.forEach(term => {
    if (profile.toLowerCase().includes(term)) {
      insights.push(`${term.charAt(0).toUpperCase() + term.slice(1)}-focused behavior`)
    }
  })
  
  return insights
}

export function generateEnrichedTargetingPrompt(enrichedProfile: EnrichedProfile): string {
  const parts: string[] = [enrichedProfile.originalProfile]
  
  // Add demographic context
  if (Object.keys(enrichedProfile.demographics).length > 0) {
    parts.push(`Demographics: ${JSON.stringify(enrichedProfile.demographics)}`)
  }
  
  // Add psychographic context
  if (enrichedProfile.psychographics.values.length > 0) {
    parts.push(`Values: ${enrichedProfile.psychographics.values.join(', ')}`)
  }
  if (enrichedProfile.psychographics.interests.length > 0) {
    parts.push(`Interests: ${enrichedProfile.psychographics.interests.join(', ')}`)
  }
  
  // Add behavioral context
  if (enrichedProfile.behaviors.onlineHabits.length > 0) {
    parts.push(`Online behavior: ${enrichedProfile.behaviors.onlineHabits.join(', ')}`)
  }
  
  // Add pain points
  if (enrichedProfile.painPoints.length > 0) {
    parts.push(`Pain points: ${enrichedProfile.painPoints.join(', ')}`)
  }
  
  // Add brand affinities
  if (enrichedProfile.brandAffinities.length > 0) {
    parts.push(`Brand affinities: ${enrichedProfile.brandAffinities.join(', ')}`)
  }
  
  return parts.join('. ')
}