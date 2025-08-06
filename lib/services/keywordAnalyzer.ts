import { Keyword } from '@/lib/types/targeting'

export class KeywordAnalyzer {
  private static industryKeywords: Record<string, string[]> = {
    nfl: ['football', 'touchdown', 'quarterback', 'playoffs', 'super bowl', 'draft', 'fantasy football', 'gridiron', 'endzone', 'field goal'],
    gaming: ['esports', 'twitch', 'steam', 'console', 'pc gaming', 'mobile gaming', 'multiplayer', 'streaming', 'gamer', 'gameplay'],
    fashion: ['style', 'trend', 'designer', 'runway', 'couture', 'streetwear', 'outfit', 'lookbook', 'fashion week', 'collection'],
    tech: ['innovation', 'startup', 'ai', 'software', 'hardware', 'digital', 'cloud', 'saas', 'developer', 'programming'],
    crypto: ['blockchain', 'bitcoin', 'ethereum', 'defi', 'nft', 'mining', 'wallet', 'exchange', 'altcoin', 'hodl'],
    travel: ['vacation', 'tourism', 'destination', 'hotel', 'flight', 'adventure', 'explore', 'wanderlust', 'backpacking', 'resort'],
    food: ['restaurant', 'cuisine', 'chef', 'recipe', 'foodie', 'dining', 'gourmet', 'culinary', 'menu', 'taste'],
    fitness: ['workout', 'gym', 'exercise', 'training', 'health', 'wellness', 'nutrition', 'cardio', 'strength', 'yoga'],
    music: ['artist', 'album', 'concert', 'tour', 'playlist', 'spotify', 'genre', 'festival', 'band', 'song'],
    entertainment: ['movie', 'tv show', 'celebrity', 'hollywood', 'netflix', 'streaming', 'actor', 'director', 'premiere', 'awards']
  }

  private static keywordModifiers = {
    broad: ['best', 'top', 'new', 'latest', 'trending', 'popular', 'viral', 'amazing', 'ultimate', 'essential'],
    phrase: ['how to', 'guide to', 'tips for', 'news about', 'updates on', 'facts about', 'history of', 'future of'],
    exact: ['2024', '2025', 'official', 'verified', 'authentic', 'original', 'exclusive', 'limited', 'pro', 'premium']
  }

  static generateKeywords(baseKeyword: string): Keyword[] {
    const keywords: Keyword[] = []
    const normalizedKeyword = baseKeyword.toLowerCase()
    
    // Add base keyword variations
    keywords.push({
      term: baseKeyword,
      matchType: 'exact',
      category: 'primary'
    })
    
    keywords.push({
      term: normalizedKeyword,
      matchType: 'broad',
      category: 'primary'
    })

    // Find matching industry
    let industryMatch: string | null = null
    for (const [industry, terms] of Object.entries(this.industryKeywords)) {
      if (normalizedKeyword.includes(industry) || industry.includes(normalizedKeyword)) {
        industryMatch = industry
        break
      }
    }

    // Add industry-specific keywords
    if (industryMatch && this.industryKeywords[industryMatch]) {
      this.industryKeywords[industryMatch].forEach(term => {
        keywords.push({
          term,
          matchType: 'broad',
          category: 'secondary'
        })
        
        // Add compound keywords
        keywords.push({
          term: `${baseKeyword} ${term}`,
          matchType: 'phrase',
          category: 'long-tail'
        })
      })
    }

    // Add modified keywords
    this.keywordModifiers.broad.forEach(modifier => {
      keywords.push({
        term: `${modifier} ${normalizedKeyword}`,
        matchType: 'broad',
        category: 'secondary'
      })
    })

    this.keywordModifiers.phrase.slice(0, 5).forEach(modifier => {
      keywords.push({
        term: `${modifier} ${normalizedKeyword}`,
        matchType: 'phrase',
        category: 'long-tail'
      })
    })

    // Add temporal keywords
    const currentYear = new Date().getFullYear()
    keywords.push({
      term: `${baseKeyword} ${currentYear}`,
      matchType: 'exact',
      category: 'secondary'
    })
    
    keywords.push({
      term: `${baseKeyword} ${currentYear + 1}`,
      matchType: 'exact',
      category: 'secondary'
    })

    // Add conversational keywords
    const conversationalPhrases = [
      `${normalizedKeyword} fan`,
      `${normalizedKeyword} lover`,
      `${normalizedKeyword} enthusiast`,
      `${normalizedKeyword} community`,
      `${normalizedKeyword} news`
    ]

    conversationalPhrases.forEach(phrase => {
      keywords.push({
        term: phrase,
        matchType: 'phrase',
        category: 'long-tail'
      })
    })

    // Remove duplicates
    const uniqueKeywords = Array.from(
      new Map(keywords.map(k => [`${k.term}-${k.matchType}`, k])).values()
    )

    return uniqueKeywords
  }

  static generateConversationalKeywords(baseKeyword: string): string[] {
    const normalized = baseKeyword.toLowerCase()
    return [
      `love ${normalized}`,
      `hate ${normalized}`,
      `${normalized} sucks`,
      `${normalized} rocks`,
      `excited about ${normalized}`,
      `disappointed in ${normalized}`,
      `${normalized} is amazing`,
      `${normalized} is terrible`,
      `can't wait for ${normalized}`,
      `looking forward to ${normalized}`,
      `${normalized} review`,
      `${normalized} opinion`,
      `thoughts on ${normalized}`,
      `${normalized} discussion`,
      `${normalized} debate`
    ]
  }
}