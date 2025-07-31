export interface Keyword {
  text: string
  matchType: 'broad' | 'phrase' | 'exact'
  category?: string
}

export interface Influencer {
  handle: string
  name?: string
  followerCount?: number
  relevanceScore?: number
  category: 'macro' | 'micro' | 'nano'
}

export interface InterestCategory {
  id: string
  name: string
  subcategories?: string[]
}

export interface TargetingResults {
  keywords: Keyword[]
  negativeKeywords: string[]
  influencers: Influencer[]
  interestCategories: InterestCategory[]
  profile: string
  generatedAt: string
}