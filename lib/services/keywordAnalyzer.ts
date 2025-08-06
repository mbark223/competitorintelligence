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
    
    // Twitter Ads allows up to 1000 keywords per campaign
    // We'll aim for 200-300 keywords to give variety
    
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

    // Add case variations
    keywords.push({
      term: baseKeyword.toUpperCase(),
      matchType: 'exact',
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
        
        keywords.push({
          term: `${term} ${baseKeyword}`,
          matchType: 'phrase',
          category: 'long-tail'
        })
      })
    }

    // Expanded modifiers for more variations
    const expandedModifiers = {
      broad: [...this.keywordModifiers.broad, 
        'great', 'awesome', 'excellent', 'professional', 'expert', 'quality', 
        'reliable', 'trusted', 'leading', 'innovative', 'advanced', 'modern',
        'classic', 'traditional', 'authentic', 'genuine', 'real', 'official',
        'certified', 'approved', 'recommended', 'featured', 'special', 'unique'
      ],
      phrase: [...this.keywordModifiers.phrase,
        'where to find', 'how to get', 'best way to', 'looking for', 'searching for',
        'interested in', 'learn about', 'discover', 'explore', 'understand',
        'master', 'improve', 'enhance', 'upgrade', 'optimize', 'maximize'
      ],
      exact: [...this.keywordModifiers.exact,
        'online', 'near me', 'local', 'delivery', 'service', 'store',
        'shop', 'buy', 'purchase', 'order', 'get', 'find'
      ]
    }

    // Add modified keywords - all variations
    expandedModifiers.broad.forEach(modifier => {
      keywords.push({
        term: `${modifier} ${normalizedKeyword}`,
        matchType: 'broad',
        category: 'secondary'
      })
    })

    expandedModifiers.phrase.forEach(modifier => {
      keywords.push({
        term: `${modifier} ${normalizedKeyword}`,
        matchType: 'phrase',
        category: 'long-tail'
      })
    })

    expandedModifiers.exact.forEach(modifier => {
      keywords.push({
        term: `${baseKeyword} ${modifier}`,
        matchType: 'exact',
        category: 'secondary'
      })
    })

    // Add temporal keywords - multiple years
    const currentYear = new Date().getFullYear()
    for (let yearOffset = -1; yearOffset <= 2; yearOffset++) {
      keywords.push({
        term: `${baseKeyword} ${currentYear + yearOffset}`,
        matchType: 'exact',
        category: 'secondary'
      })
    }

    // Add seasonal variations
    const seasons = ['spring', 'summer', 'fall', 'winter', 'holiday', 'black friday', 'cyber monday']
    seasons.forEach(season => {
      keywords.push({
        term: `${baseKeyword} ${season}`,
        matchType: 'phrase',
        category: 'secondary'
      })
    })

    // Add location-based variations
    const locations = ['usa', 'america', 'us', 'united states', 'nationwide', 'global', 'international', 'worldwide']
    locations.forEach(location => {
      keywords.push({
        term: `${baseKeyword} ${location}`,
        matchType: 'phrase',
        category: 'secondary'
      })
    })

    // Add action-based keywords
    const actions = ['buy', 'shop', 'get', 'find', 'discover', 'explore', 'try', 'use', 'start', 'join', 'learn', 'watch', 'read', 'download', 'access']
    actions.forEach(action => {
      keywords.push({
        term: `${action} ${normalizedKeyword}`,
        matchType: 'phrase',
        category: 'long-tail'
      })
    })

    // Add question-based keywords
    const questions = ['what is', 'what are', 'how to', 'where to', 'when to', 'why', 'which', 'who']
    questions.forEach(question => {
      keywords.push({
        term: `${question} ${normalizedKeyword}`,
        matchType: 'phrase',
        category: 'long-tail'
      })
    })

    // Add comparison keywords
    const comparisons = ['vs', 'versus', 'compared to', 'alternative to', 'better than', 'like']
    comparisons.forEach(comparison => {
      keywords.push({
        term: `${baseKeyword} ${comparison}`,
        matchType: 'phrase',
        category: 'long-tail'
      })
    })

    // Add superlatives
    const superlatives = ['best', 'top', 'greatest', 'finest', 'premier', 'leading', 'ultimate', 'supreme', 'perfect', 'ideal']
    superlatives.forEach(superlative => {
      keywords.push({
        term: `${superlative} ${normalizedKeyword}`,
        matchType: 'broad',
        category: 'secondary'
      })
    })

    // Add plurals and variations
    if (!normalizedKeyword.endsWith('s')) {
      keywords.push({
        term: `${normalizedKeyword}s`,
        matchType: 'broad',
        category: 'primary'
      })
    }

    // Add common misspellings/variations
    const keywordVariations = this.generateSpellingVariations(normalizedKeyword)
    keywordVariations.forEach(variation => {
      keywords.push({
        term: variation,
        matchType: 'broad',
        category: 'secondary'
      })
    })

    // Add conversational keywords - expanded list
    const conversationalPhrases = [
      `${normalizedKeyword} fan`,
      `${normalizedKeyword} lover`,
      `${normalizedKeyword} enthusiast`,
      `${normalizedKeyword} community`,
      `${normalizedKeyword} news`,
      `${normalizedKeyword} update`,
      `${normalizedKeyword} tips`,
      `${normalizedKeyword} guide`,
      `${normalizedKeyword} tutorial`,
      `${normalizedKeyword} review`,
      `${normalizedKeyword} recommendation`,
      `${normalizedKeyword} advice`,
      `${normalizedKeyword} help`,
      `${normalizedKeyword} support`,
      `${normalizedKeyword} forum`,
      `${normalizedKeyword} discussion`,
      `${normalizedKeyword} group`,
      `${normalizedKeyword} club`,
      `${normalizedKeyword} association`,
      `${normalizedKeyword} organization`
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
      new Map(keywords.map(k => [`${k.term.toLowerCase()}-${k.matchType}`, k])).values()
    )

    // Ensure we have enough keywords - if not, generate more variations
    if (uniqueKeywords.length < 200) {
      // Add numbered variations
      for (let i = 1; i <= 10; i++) {
        keywords.push({
          term: `${baseKeyword} ${i}`,
          matchType: 'exact',
          category: 'secondary'
        })
        keywords.push({
          term: `top ${i} ${normalizedKeyword}`,
          matchType: 'phrase',
          category: 'long-tail'
        })
      }
    }

    return uniqueKeywords
  }

  private static generateSpellingVariations(keyword: string): string[] {
    const variations: string[] = []
    
    // Common replacements
    const replacements = [
      { from: 'er', to: 'r' },
      { from: 'or', to: 'r' },
      { from: 'ing', to: 'in' },
      { from: 'tion', to: 'shun' },
      { from: 'ise', to: 'ize' },
      { from: 'ize', to: 'ise' }
    ]

    replacements.forEach(({ from, to }) => {
      if (keyword.includes(from)) {
        variations.push(keyword.replace(from, to))
      }
    })

    return variations
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