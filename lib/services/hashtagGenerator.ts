import { Hashtag } from '@/lib/types/targeting'
import { floridaSportsbookData } from '@/lib/data/floridaSportsbookData'

export class HashtagGenerator {
  private static hashtagPatterns = [
    { pattern: '#{keyword}', usage: 'high' as const },
    { pattern: '#{keyword}News', usage: 'medium' as const },
    { pattern: '#{keyword}Update', usage: 'medium' as const },
    { pattern: '#{keyword}Community', usage: 'medium' as const },
    { pattern: '#{keyword}Fan', usage: 'medium' as const },
    { pattern: '#{keyword}Love', usage: 'low' as const },
    { pattern: '#{keyword}{year}', usage: 'high' as const },
    { pattern: '#Team{keyword}', usage: 'medium' as const },
    { pattern: '#{keyword}Nation', usage: 'medium' as const },
    { pattern: '#{keyword}Life', usage: 'low' as const },
  ]

  private static industryHashtags: Record<string, Hashtag[]> = {
    nfl: [
      { tag: '#NFL', usage: 'high' },
      { tag: '#Football', usage: 'high' },
      { tag: '#SuperBowl', usage: 'high' },
      { tag: '#FantasyFootball', usage: 'high' },
      { tag: '#NFLDraft', usage: 'high' },
      { tag: '#GameDay', usage: 'medium' },
      { tag: '#TouchDown', usage: 'medium' },
      { tag: '#NFLPlayoffs', usage: 'high' },
      { tag: '#ProBowl', usage: 'medium' },
      { tag: '#RedZone', usage: 'medium' },
    ],
    gaming: [
      { tag: '#Gaming', usage: 'high' },
      { tag: '#Gamer', usage: 'high' },
      { tag: '#VideoGames', usage: 'high' },
      { tag: '#ESports', usage: 'high' },
      { tag: '#Twitch', usage: 'high' },
      { tag: '#GameDev', usage: 'medium' },
      { tag: '#IndieGame', usage: 'medium' },
      { tag: '#PCGaming', usage: 'high' },
      { tag: '#ConsoleGaming', usage: 'high' },
      { tag: '#MobileGaming', usage: 'medium' },
    ],
    fashion: [
      { tag: '#Fashion', usage: 'high' },
      { tag: '#Style', usage: 'high' },
      { tag: '#OOTD', usage: 'high' },
      { tag: '#FashionWeek', usage: 'high' },
      { tag: '#Streetwear', usage: 'medium' },
      { tag: '#HighFashion', usage: 'medium' },
      { tag: '#FashionBlogger', usage: 'medium' },
      { tag: '#FashionTrends', usage: 'medium' },
      { tag: '#Designer', usage: 'medium' },
      { tag: '#Runway', usage: 'medium' },
    ],
    tech: [
      { tag: '#Tech', usage: 'high' },
      { tag: '#Technology', usage: 'high' },
      { tag: '#AI', usage: 'high' },
      { tag: '#Innovation', usage: 'high' },
      { tag: '#Startup', usage: 'high' },
      { tag: '#Programming', usage: 'medium' },
      { tag: '#Developer', usage: 'medium' },
      { tag: '#TechNews', usage: 'medium' },
      { tag: '#Digital', usage: 'medium' },
      { tag: '#Future', usage: 'low' },
    ],
    crypto: [
      { tag: '#Crypto', usage: 'high' },
      { tag: '#Bitcoin', usage: 'high' },
      { tag: '#Ethereum', usage: 'high' },
      { tag: '#Blockchain', usage: 'high' },
      { tag: '#DeFi', usage: 'high' },
      { tag: '#NFT', usage: 'high' },
      { tag: '#CryptoNews', usage: 'medium' },
      { tag: '#HODL', usage: 'medium' },
      { tag: '#Altcoins', usage: 'medium' },
      { tag: '#Web3', usage: 'high' },
    ],
  }

  private static trendingModifiers = [
    'Trending', 'Viral', 'Breaking', 'Latest', 'Hot', 'New', 'Top', 'Best', 'Epic', 'Amazing'
  ]

  static generateHashtags(keyword: string): Hashtag[] {
    const hashtags: Hashtag[] = []
    const currentYear = new Date().getFullYear()
    const normalizedKeyword = keyword.toLowerCase().replace(/\s+/g, '')
    const camelCaseKeyword = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')

    // Generate pattern-based hashtags
    this.hashtagPatterns.forEach(({ pattern, usage }) => {
      let hashtag = pattern
        .replace('{keyword}', camelCaseKeyword)
        .replace('{year}', currentYear.toString())
      
      hashtags.push({
        tag: hashtag,
        usage,
        description: `General ${keyword} hashtag`
      })

      // Add lowercase version for high usage tags
      if (usage === 'high') {
        hashtags.push({
          tag: pattern.replace('{keyword}', normalizedKeyword).replace('{year}', currentYear.toString()),
          usage: 'medium',
          description: `Alternative ${keyword} hashtag`
        })
      }
    })

    // Add industry-specific hashtags
    for (const [industry, industryTags] of Object.entries(this.industryHashtags)) {
      if (normalizedKeyword.includes(industry) || industry.includes(normalizedKeyword)) {
        hashtags.push(...industryTags)
        break
      }
    }

    // Check for Florida sportsbook keywords
    const sportsbookKeywords = ['sportsbook', 'betting', 'florida sports', 'florida betting', 'florida sportsbook']
    if (sportsbookKeywords.some(term => normalizedKeyword.includes(term))) {
      hashtags.push(...floridaSportsbookData.hashtags)
    }

    // Add trending variations
    this.trendingModifiers.slice(0, 5).forEach(modifier => {
      hashtags.push({
        tag: `#${modifier}${camelCaseKeyword}`,
        usage: 'low',
        description: `Trending ${keyword} content`
      })
    })

    // Add acronym hashtag for multi-word keywords
    if (keyword.includes(' ')) {
      const acronym = keyword.split(' ').map(w => w[0].toUpperCase()).join('')
      hashtags.push({
        tag: `#${acronym}`,
        usage: 'medium',
        description: `${keyword} acronym`
      })
    }

    // Add temporal hashtags
    hashtags.push({
      tag: `#${camelCaseKeyword}${currentYear}`,
      usage: 'high',
      description: `${keyword} ${currentYear}`
    })

    hashtags.push({
      tag: `#${camelCaseKeyword}${currentYear + 1}`,
      usage: 'medium',
      description: `${keyword} ${currentYear + 1}`
    })

    // Add engagement hashtags
    const engagementTags = [
      { tag: `#${camelCaseKeyword}Challenge`, usage: 'medium' as const, description: 'User-generated content' },
      { tag: `#${camelCaseKeyword}Goals`, usage: 'low' as const, description: 'Aspirational content' },
      { tag: `#${camelCaseKeyword}Tips`, usage: 'medium' as const, description: 'Educational content' },
      { tag: `#${camelCaseKeyword}Facts`, usage: 'low' as const, description: 'Informational content' },
    ]

    hashtags.push(...engagementTags)

    // Remove duplicates
    const uniqueHashtags = Array.from(
      new Map(hashtags.map(h => [h.tag.toLowerCase(), h])).values()
    )

    return uniqueHashtags
  }
}