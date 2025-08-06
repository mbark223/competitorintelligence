import { TwitterHandle } from '@/lib/types/targeting'
import { floridaSportsbookData } from '@/lib/data/floridaSportsbookData'

export class HandleGenerator {
  private static handlePatterns = [
    // Official variations
    { pattern: '@{keyword}', category: 'official' as const },
    { pattern: '@{keyword}Official', category: 'official' as const },
    { pattern: '@{keyword}HQ', category: 'official' as const },
    { pattern: '@{keyword}Corp', category: 'official' as const },
    { pattern: '@{keyword}Inc', category: 'official' as const },
    { pattern: '@{keyword}Co', category: 'official' as const },
    { pattern: '@The{keyword}', category: 'official' as const },
    { pattern: '@Real{keyword}', category: 'official' as const },
    { pattern: '@Official{keyword}', category: 'official' as const },
    { pattern: '@{keyword}Brand', category: 'official' as const },
    
    // Media variations
    { pattern: '@{keyword}News', category: 'media' as const },
    { pattern: '@{keyword}Daily', category: 'media' as const },
    { pattern: '@{keyword}Updates', category: 'media' as const },
    { pattern: '@{keyword}Media', category: 'media' as const },
    { pattern: '@{keyword}Press', category: 'media' as const },
    { pattern: '@{keyword}TV', category: 'media' as const },
    { pattern: '@{keyword}Live', category: 'media' as const },
    { pattern: '@{keyword}Report', category: 'media' as const },
    { pattern: '@{keyword}Wire', category: 'media' as const },
    { pattern: '@{keyword}Alert', category: 'media' as const },
    
    // Community variations
    { pattern: '@{keyword}Community', category: 'community' as const },
    { pattern: '@{keyword}Fans', category: 'community' as const },
    { pattern: '@{keyword}Nation', category: 'community' as const },
    { pattern: '@{keyword}Hub', category: 'community' as const },
    { pattern: '@{keyword}Central', category: 'community' as const },
    { pattern: '@{keyword}Club', category: 'community' as const },
    { pattern: '@{keyword}Squad', category: 'community' as const },
    { pattern: '@{keyword}Team', category: 'community' as const },
    { pattern: '@{keyword}Forum', category: 'community' as const },
    { pattern: '@{keyword}Talk', category: 'community' as const },
  ]

  private static industryHandles: Record<string, TwitterHandle[]> = {
    nfl: [
      { handle: '@NFL', name: 'National Football League', category: 'official', verified: true },
      { handle: '@NFLNetwork', name: 'NFL Network', category: 'media', verified: true },
      { handle: '@ESPNNFL', name: 'ESPN NFL', category: 'media', verified: true },
      { handle: '@AdamSchefter', name: 'Adam Schefter', category: 'personality', verified: true },
      { handle: '@RapSheet', name: 'Ian Rapoport', category: 'personality', verified: true },
    ],
    gaming: [
      { handle: '@IGN', name: 'IGN', category: 'media', verified: true },
      { handle: '@GameSpot', name: 'GameSpot', category: 'media', verified: true },
      { handle: '@Kotaku', name: 'Kotaku', category: 'media', verified: true },
      { handle: '@Steam', name: 'Steam', category: 'brand', verified: true },
      { handle: '@PlayStation', name: 'PlayStation', category: 'brand', verified: true },
    ],
    fashion: [
      { handle: '@voguemagazine', name: 'Vogue', category: 'media', verified: true },
      { handle: '@FashionWeek', name: 'Fashion Week', category: 'official', verified: true },
      { handle: '@BoF', name: 'Business of Fashion', category: 'media', verified: true },
      { handle: '@CFDA', name: 'CFDA', category: 'official', verified: true },
      { handle: '@WhoWhatWear', name: 'Who What Wear', category: 'media', verified: true },
    ],
    tech: [
      { handle: '@TechCrunch', name: 'TechCrunch', category: 'media', verified: true },
      { handle: '@verge', name: 'The Verge', category: 'media', verified: true },
      { handle: '@Wired', name: 'WIRED', category: 'media', verified: true },
      { handle: '@ProductHunt', name: 'Product Hunt', category: 'community', verified: true },
      { handle: '@hackernews', name: 'Hacker News', category: 'community', verified: true },
    ],
    crypto: [
      { handle: '@coinbase', name: 'Coinbase', category: 'brand', verified: true },
      { handle: '@binance', name: 'Binance', category: 'brand', verified: true },
      { handle: '@CoinDesk', name: 'CoinDesk', category: 'media', verified: true },
      { handle: '@cointelegraph', name: 'Cointelegraph', category: 'media', verified: true },
      { handle: '@Bitcoin', name: 'Bitcoin', category: 'official', verified: true },
    ],
  }

  private static mediaHandles: TwitterHandle[] = [
    { handle: '@CNN', name: 'CNN', category: 'media', verified: true },
    { handle: '@BBCBreaking', name: 'BBC Breaking News', category: 'media', verified: true },
    { handle: '@Reuters', name: 'Reuters', category: 'media', verified: true },
    { handle: '@WSJ', name: 'Wall Street Journal', category: 'media', verified: true },
    { handle: '@nytimes', name: 'The New York Times', category: 'media', verified: true },
    { handle: '@FT', name: 'Financial Times', category: 'media', verified: true },
    { handle: '@TheEconomist', name: 'The Economist', category: 'media', verified: true },
    { handle: '@Forbes', name: 'Forbes', category: 'media', verified: true },
    { handle: '@businessinsider', name: 'Business Insider', category: 'media', verified: true },
    { handle: '@TIME', name: 'TIME', category: 'media', verified: true },
  ]

  static generateHandles(keyword: string): TwitterHandle[] {
    const handles: TwitterHandle[] = []
    const normalizedKeyword = keyword.toLowerCase().replace(/\s+/g, '')
    const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase()

    // Generate pattern-based handles
    this.handlePatterns.forEach(({ pattern, category }) => {
      const handle = pattern
        .replace('{keyword}', capitalizedKeyword)
        .replace(/\s+/g, '')
      
      handles.push({
        handle,
        name: `${keyword} ${category === 'official' ? 'Official' : category === 'media' ? 'News' : 'Community'}`,
        category,
        verified: category === 'official'
      })
    })

    // Add industry-specific handles if match found
    for (const [industry, industryHandles] of Object.entries(this.industryHandles)) {
      if (normalizedKeyword.includes(industry) || industry.includes(normalizedKeyword)) {
        handles.push(...industryHandles)
        break
      }
    }

    // Check for Florida sportsbook keywords
    const sportsbookKeywords = ['sportsbook', 'betting', 'florida sports', 'florida betting', 'florida sportsbook']
    if (sportsbookKeywords.some(term => normalizedKeyword.includes(term))) {
      handles.push(...floridaSportsbookData.handles)
    }

    // Add variations for multi-word keywords
    if (keyword.includes(' ')) {
      const words = keyword.split(' ')
      const acronym = words.map(w => w[0].toUpperCase()).join('')
      
      handles.push({
        handle: `@${acronym}`,
        name: `${keyword} (${acronym})`,
        category: 'official',
        verified: false
      })

      // CamelCase version
      const camelCase = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
      handles.push({
        handle: `@${camelCase}`,
        name: keyword,
        category: 'official',
        verified: false
      })
    }

    // Remove duplicates
    const uniqueHandles = Array.from(
      new Map(handles.map(h => [h.handle, h])).values()
    )

    return uniqueHandles
  }

  static generateMediaHandles(keyword: string): TwitterHandle[] {
    const handles: TwitterHandle[] = [...this.mediaHandles]
    const normalizedKeyword = keyword.toLowerCase()

    // Add keyword-specific media handles
    const specificMediaPatterns = [
      `@${keyword}Times`,
      `@${keyword}Journal`,
      `@${keyword}Report`,
      `@${keyword}Magazine`,
      `@${keyword}Digest`
    ]

    specificMediaPatterns.forEach(pattern => {
      handles.push({
        handle: pattern.replace(/\s+/g, ''),
        name: `${keyword} Media`,
        category: 'media',
        verified: false
      })
    })

    return handles
  }
}