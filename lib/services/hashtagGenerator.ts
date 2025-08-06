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
    const allCapsKeyword = keyword.toUpperCase().replace(/\s+/g, '')

    // Twitter allows up to 500 hashtags per campaign
    // We'll generate 100-150 to ensure comprehensive coverage

    // Generate pattern-based hashtags
    this.hashtagPatterns.forEach(({ pattern, usage }) => {
      // CamelCase version
      let hashtag = pattern
        .replace('{keyword}', camelCaseKeyword)
        .replace('{year}', currentYear.toString())
      
      hashtags.push({
        tag: hashtag,
        usage,
        description: `General ${keyword} hashtag`
      })

      // Lowercase version
      hashtags.push({
        tag: pattern.replace('{keyword}', normalizedKeyword).replace('{year}', currentYear.toString()),
        usage: usage === 'high' ? 'medium' : 'low',
        description: `Alternative ${keyword} hashtag`
      })

      // All caps version for high usage tags
      if (usage === 'high') {
        hashtags.push({
          tag: pattern.replace('{keyword}', allCapsKeyword).replace('{year}', currentYear.toString()),
          usage: 'medium',
          description: `Emphasis ${keyword} hashtag`
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

    // Add ALL trending variations
    this.trendingModifiers.forEach(modifier => {
      hashtags.push({
        tag: `#${modifier}${camelCaseKeyword}`,
        usage: 'low',
        description: `Trending ${keyword} content`
      })
      
      // Also add with space/underscore
      hashtags.push({
        tag: `#${modifier}_${normalizedKeyword}`,
        usage: 'low',
        description: `Trending ${keyword} variant`
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
      
      // Add lowercase version
      hashtags.push({
        tag: `#${acronym.toLowerCase()}`,
        usage: 'low',
        description: `${keyword} acronym lowercase`
      })
    }

    // Add temporal hashtags - multiple years
    for (let yearOffset = -1; yearOffset <= 3; yearOffset++) {
      const year = currentYear + yearOffset
      hashtags.push({
        tag: `#${camelCaseKeyword}${year}`,
        usage: yearOffset === 0 ? 'high' : 'medium',
        description: `${keyword} ${year}`
      })
      
      hashtags.push({
        tag: `#${normalizedKeyword}${year}`,
        usage: 'low',
        description: `${keyword} ${year} lowercase`
      })
    }

    // Add monthly variations
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    months.forEach(month => {
      hashtags.push({
        tag: `#${camelCaseKeyword}${month}`,
        usage: 'low',
        description: `${keyword} ${month}`
      })
    })

    // Add day-based hashtags
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    days.forEach(day => {
      hashtags.push({
        tag: `#${camelCaseKeyword}${day}`,
        usage: 'low',
        description: `${keyword} ${day}`
      })
    })

    // Add engagement hashtags - expanded list
    const engagementTags = [
      { tag: `#${camelCaseKeyword}Challenge`, usage: 'medium' as const, description: 'User-generated content' },
      { tag: `#${camelCaseKeyword}Goals`, usage: 'low' as const, description: 'Aspirational content' },
      { tag: `#${camelCaseKeyword}Tips`, usage: 'medium' as const, description: 'Educational content' },
      { tag: `#${camelCaseKeyword}Facts`, usage: 'low' as const, description: 'Informational content' },
      { tag: `#${camelCaseKeyword}Love`, usage: 'medium' as const, description: 'Fan content' },
      { tag: `#${camelCaseKeyword}Life`, usage: 'medium' as const, description: 'Lifestyle content' },
      { tag: `#${camelCaseKeyword}Vibes`, usage: 'low' as const, description: 'Mood content' },
      { tag: `#${camelCaseKeyword}Squad`, usage: 'low' as const, description: 'Community content' },
      { tag: `#${camelCaseKeyword}Gang`, usage: 'low' as const, description: 'Group content' },
      { tag: `#${camelCaseKeyword}Crew`, usage: 'low' as const, description: 'Team content' },
      { tag: `#${camelCaseKeyword}Family`, usage: 'medium' as const, description: 'Community content' },
      { tag: `#${camelCaseKeyword}Nation`, usage: 'medium' as const, description: 'Large community' },
      { tag: `#${camelCaseKeyword}Army`, usage: 'low' as const, description: 'Fan army' },
      { tag: `#${camelCaseKeyword}Team`, usage: 'medium' as const, description: 'Team content' },
      { tag: `#${camelCaseKeyword}Club`, usage: 'low' as const, description: 'Club content' },
      { tag: `#${camelCaseKeyword}Society`, usage: 'low' as const, description: 'Society content' },
      { tag: `#${camelCaseKeyword}World`, usage: 'low' as const, description: 'Global content' },
      { tag: `#${camelCaseKeyword}Universe`, usage: 'low' as const, description: 'Universe content' },
      { tag: `#${camelCaseKeyword}Power`, usage: 'low' as const, description: 'Power content' },
      { tag: `#${camelCaseKeyword}Magic`, usage: 'low' as const, description: 'Magic content' }
    ]

    hashtags.push(...engagementTags)

    // Add action-based hashtags
    const actions = ['Get', 'Try', 'Buy', 'Use', 'Love', 'Need', 'Want', 'Share', 'Join', 'Follow']
    actions.forEach(action => {
      hashtags.push({
        tag: `#${action}${camelCaseKeyword}`,
        usage: 'low',
        description: `${action} ${keyword}`
      })
    })

    // Add emotion-based hashtags
    const emotions = ['Happy', 'Excited', 'Proud', 'Blessed', 'Grateful', 'Inspired', 'Motivated']
    emotions.forEach(emotion => {
      hashtags.push({
        tag: `#${emotion}${camelCaseKeyword}`,
        usage: 'low',
        description: `${emotion} about ${keyword}`
      })
    })

    // Add superlative hashtags
    const superlatives = ['Best', 'Top', 'Ultimate', 'Perfect', 'Amazing', 'Awesome', 'Incredible']
    superlatives.forEach(superlative => {
      hashtags.push({
        tag: `#${superlative}${camelCaseKeyword}`,
        usage: 'low',
        description: `${superlative} ${keyword}`
      })
    })

    // Add location-based hashtags if not already Florida-specific
    const locations = ['USA', 'America', 'US', 'Global', 'World', 'International']
    locations.forEach(location => {
      hashtags.push({
        tag: `#${camelCaseKeyword}${location}`,
        usage: 'low',
        description: `${keyword} in ${location}`
      })
    })

    // Add numbered hashtags
    for (let i = 1; i <= 10; i++) {
      hashtags.push({
        tag: `#${camelCaseKeyword}${i}`,
        usage: 'low',
        description: `${keyword} number ${i}`
      })
    }

    // Remove duplicates
    const uniqueHashtags = Array.from(
      new Map(hashtags.map(h => [h.tag.toLowerCase(), h])).values()
    )

    return uniqueHashtags
  }
}