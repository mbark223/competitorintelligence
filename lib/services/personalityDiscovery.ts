import { Personality, Competitor, Event, GeographicTarget, InterestCategory } from '@/lib/types/targeting'
import { floridaSportsbookData, floridaGeographicTargets, sportsbookInterests, floridaCompetitors } from '@/lib/data/floridaSportsbookData'

export class PersonalityDiscovery {
  private static industryPersonalities: Record<string, Personality[]> = {
    nfl: [
      { name: 'Patrick Mahomes', handle: '@PatrickMahomes', role: 'NFL Quarterback - Kansas City Chiefs', influence: 'macro', verified: true },
      { name: 'Tom Brady', handle: '@TomBrady', role: 'NFL Legend', influence: 'macro', verified: true },
      { name: 'Adam Schefter', handle: '@AdamSchefter', role: 'ESPN NFL Insider', influence: 'macro', verified: true },
      { name: 'Ian Rapoport', handle: '@RapSheet', role: 'NFL Network Insider', influence: 'macro', verified: true },
      { name: 'Pat McAfee', handle: '@PatMcAfeeShow', role: 'Sports Media Personality', influence: 'macro', verified: true },
      { name: 'Rich Eisen', handle: '@RichEisen', role: 'NFL Network Host', influence: 'macro', verified: true },
      { name: 'Kay Adams', handle: '@heykayadams', role: 'NFL Media Personality', influence: 'micro', verified: true },
      { name: 'Shannon Sharpe', handle: '@ShannonSharpe', role: 'NFL Hall of Famer & Analyst', influence: 'macro', verified: true },
    ],
    gaming: [
      { name: 'Ninja', handle: '@Ninja', role: 'Professional Gamer & Streamer', influence: 'macro', verified: true },
      { name: 'Pokimane', handle: '@pokimanelol', role: 'Twitch Streamer & Content Creator', influence: 'macro', verified: true },
      { name: 'DrDisrespect', handle: '@DrDisrespect', role: 'Gaming Streamer', influence: 'macro', verified: true },
      { name: 'Shroud', handle: '@shroud', role: 'Professional Gamer', influence: 'macro', verified: true },
      { name: 'TimTheTatman', handle: '@timthetatman', role: 'Twitch Streamer', influence: 'macro', verified: true },
      { name: 'Valkyrae', handle: '@Valkyrae', role: 'Gaming Content Creator', influence: 'macro', verified: true },
      { name: 'Ludwig', handle: '@LudwigAhgren', role: 'Content Creator & Streamer', influence: 'macro', verified: true },
      { name: 'xQc', handle: '@xQc', role: 'Twitch Streamer', influence: 'macro', verified: true },
    ],
    fashion: [
      { name: 'Anna Wintour', handle: '@voguemagazine', role: 'Vogue Editor-in-Chief', influence: 'macro', verified: true },
      { name: 'Virgil Abloh Estate', handle: '@virgilabloh', role: 'Fashion Designer Legacy', influence: 'macro', verified: true },
      { name: 'Chiara Ferragni', handle: '@ChiaraFerragni', role: 'Fashion Influencer & Designer', influence: 'macro', verified: true },
      { name: 'Aimee Song', handle: '@aimeesong', role: 'Fashion Blogger & Influencer', influence: 'macro', verified: true },
      { name: 'Camila Coelho', handle: '@camilacoelho', role: 'Fashion & Beauty Influencer', influence: 'macro', verified: true },
      { name: 'Bryanboy', handle: '@bryanboy', role: 'Fashion Blogger', influence: 'micro', verified: true },
      { name: 'Leandra Medine', handle: '@leandramcohen', role: 'Fashion Influencer', influence: 'micro', verified: true },
    ],
    tech: [
      { name: 'Elon Musk', handle: '@elonmusk', role: 'Tech Entrepreneur', influence: 'macro', verified: true },
      { name: 'Marques Brownlee', handle: '@MKBHD', role: 'Tech YouTuber', influence: 'macro', verified: true },
      { name: 'Sundar Pichai', handle: '@sundarpichai', role: 'Google CEO', influence: 'macro', verified: true },
      { name: 'Satya Nadella', handle: '@satyanadella', role: 'Microsoft CEO', influence: 'macro', verified: true },
      { name: 'iJustine', handle: '@ijustine', role: 'Tech Content Creator', influence: 'micro', verified: true },
      { name: 'Linus Tech Tips', handle: '@LinusTech', role: 'Tech YouTuber', influence: 'macro', verified: true },
      { name: 'Sara Dietschy', handle: '@saradietschy', role: 'Tech Creator', influence: 'micro', verified: true },
    ],
    crypto: [
      { name: 'Vitalik Buterin', handle: '@VitalikButerin', role: 'Ethereum Co-founder', influence: 'macro', verified: true },
      { name: 'CZ Binance', handle: '@cz_binance', role: 'Binance CEO', influence: 'macro', verified: true },
      { name: 'Michael Saylor', handle: '@saylor', role: 'MicroStrategy CEO', influence: 'macro', verified: true },
      { name: 'Anthony Pompliano', handle: '@APompliano', role: 'Crypto Investor', influence: 'macro', verified: true },
      { name: 'Raoul Pal', handle: '@RaoulGMI', role: 'Macro Investor', influence: 'macro', verified: true },
      { name: 'PlanB', handle: '@100trillionUSD', role: 'Crypto Analyst', influence: 'micro', verified: true },
    ],
  }

  private static genericRoles = [
    'Industry Expert', 'Thought Leader', 'Content Creator', 'Influencer', 
    'Analyst', 'Journalist', 'Commentator', 'Enthusiast', 'Professional', 'Specialist'
  ]

  static discoverPersonalities(keyword: string): Personality[] {
    const personalities: Personality[] = []
    const normalizedKeyword = keyword.toLowerCase()

    // Check for industry match
    for (const [industry, industryPersonalities] of Object.entries(this.industryPersonalities)) {
      if (normalizedKeyword.includes(industry) || industry.includes(normalizedKeyword)) {
        personalities.push(...industryPersonalities)
        break
      }
    }

    // Check for Florida sportsbook keywords
    const sportsbookKeywords = ['sportsbook', 'betting', 'florida sports', 'florida betting', 'florida sportsbook']
    if (sportsbookKeywords.some(term => normalizedKeyword.includes(term))) {
      personalities.push(...floridaSportsbookData.personalities)
    }

    // Generate generic personalities based on keyword
    // Twitter allows targeting up to 100 usernames, so we'll generate plenty
    const keywordNoSpace = keyword.replace(/\s+/g, '')
    const keywordLower = keyword.toLowerCase().replace(/\s+/g, '')
    
    const genericPersonalities: Personality[] = [
      // Experts and authorities
      {
        name: `${keyword} Expert`,
        handle: `@${keywordNoSpace}Expert`,
        role: `Leading ${keyword} Authority`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Pro`,
        handle: `@${keywordNoSpace}Pro`,
        role: `Professional ${keyword} Specialist`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Master`,
        handle: `@${keywordNoSpace}Master`,
        role: `${keyword} Master`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Guru`,
        handle: `@${keywordNoSpace}Guru`,
        role: `${keyword} Guru`,
        influence: 'micro',
        verified: false
      },
      {
        name: `Dr. ${keyword}`,
        handle: `@Dr${keywordNoSpace}`,
        role: `${keyword} Doctor/Expert`,
        influence: 'micro',
        verified: false
      },
      
      // News and media
      {
        name: `${keyword} Daily`,
        handle: `@${keywordNoSpace}Daily`,
        role: `${keyword} News & Updates`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Times`,
        handle: `@${keywordNoSpace}Times`,
        role: `${keyword} News Publication`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Wire`,
        handle: `@${keywordNoSpace}Wire`,
        role: `${keyword} News Wire`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Report`,
        handle: `@${keywordNoSpace}Report`,
        role: `${keyword} Reports`,
        influence: 'micro',
        verified: false
      },
      
      // Content creators
      {
        name: `The ${keyword} Guy`,
        handle: `@The${keywordNoSpace}Guy`,
        role: `${keyword} Content Creator`,
        influence: 'nano',
        verified: false
      },
      {
        name: `The ${keyword} Girl`,
        handle: `@The${keywordNoSpace}Girl`,
        role: `${keyword} Content Creator`,
        influence: 'nano',
        verified: false
      },
      {
        name: `${keyword} Blogger`,
        handle: `@${keywordNoSpace}Blog`,
        role: `${keyword} Blogger`,
        influence: 'nano',
        verified: false
      },
      {
        name: `${keyword} Vlogger`,
        handle: `@${keywordNoSpace}Vlog`,
        role: `${keyword} Video Creator`,
        influence: 'nano',
        verified: false
      },
      
      // Industry insiders
      {
        name: `${keyword} Insider`,
        handle: `@${keywordNoSpace}Insider`,
        role: `${keyword} Industry Insider`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Source`,
        handle: `@${keywordNoSpace}Source`,
        role: `${keyword} Information Source`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Intel`,
        handle: `@${keywordNoSpace}Intel`,
        role: `${keyword} Intelligence`,
        influence: 'micro',
        verified: false
      },
      
      // Community leaders
      {
        name: `${keyword} Community`,
        handle: `@${keywordNoSpace}Comm`,
        role: `${keyword} Community Leader`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Nation`,
        handle: `@${keywordNoSpace}Nation`,
        role: `${keyword} Nation Leader`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Club`,
        handle: `@${keywordNoSpace}Club`,
        role: `${keyword} Club President`,
        influence: 'nano',
        verified: false
      },
      
      // Influencers
      {
        name: `${keyword} Influencer`,
        handle: `@${keywordNoSpace}Inf`,
        role: `${keyword} Influencer`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Star`,
        handle: `@${keywordNoSpace}Star`,
        role: `${keyword} Star`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Queen`,
        handle: `@${keywordNoSpace}Queen`,
        role: `${keyword} Queen`,
        influence: 'nano',
        verified: false
      },
      {
        name: `${keyword} King`,
        handle: `@${keywordNoSpace}King`,
        role: `${keyword} King`,
        influence: 'nano',
        verified: false
      },
      
      // Additional variations with underscores
      {
        name: `${keyword} Central`,
        handle: `@${keywordLower}_central`,
        role: `${keyword} Central Hub`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} HQ`,
        handle: `@${keywordLower}_hq`,
        role: `${keyword} Headquarters`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Live`,
        handle: `@${keywordLower}_live`,
        role: `${keyword} Live Coverage`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Updates`,
        handle: `@${keywordLower}_updates`,
        role: `${keyword} Updates`,
        influence: 'micro',
        verified: false
      },
      
      // Numbered variations
      {
        name: `${keyword} 24/7`,
        handle: `@${keywordNoSpace}247`,
        role: `24/7 ${keyword} Coverage`,
        influence: 'nano',
        verified: false
      },
      {
        name: `${keyword} 365`,
        handle: `@${keywordNoSpace}365`,
        role: `Daily ${keyword} Content`,
        influence: 'nano',
        verified: false
      },
      {
        name: `${keyword} 101`,
        handle: `@${keywordNoSpace}101`,
        role: `${keyword} Basics`,
        influence: 'nano',
        verified: false
      }
    ]

    personalities.push(...genericPersonalities)

    // Remove duplicates based on handle
    const uniquePersonalities = Array.from(
      new Map(personalities.map(p => [p.handle.toLowerCase(), p])).values()
    )

    return uniquePersonalities
  }

  static generateCompetitors(keyword: string): Competitor[] {
    const competitors: Competitor[] = []
    const normalizedKeyword = keyword.toLowerCase()
    
    // Check for Florida sportsbook keywords
    const sportsbookKeywords = ['sportsbook', 'betting', 'florida sports', 'florida betting', 'florida sportsbook']
    if (sportsbookKeywords.some(term => normalizedKeyword.includes(term))) {
      return floridaCompetitors
    }
    
    const competitorPatterns = [
      { name: `${keyword} Pro`, handle: `@${keyword.replace(/\s+/g, '')}Pro`, category: 'Premium Service' },
      { name: `${keyword} Plus`, handle: `@${keyword.replace(/\s+/g, '')}Plus`, category: 'Enhanced Service' },
      { name: `My${keyword}`, handle: `@My${keyword.replace(/\s+/g, '')}`, category: 'Personal Brand' },
      { name: `${keyword} Central`, handle: `@${keyword.replace(/\s+/g, '')}Central`, category: 'Hub/Community' },
      { name: `${keyword} Hub`, handle: `@${keyword.replace(/\s+/g, '')}Hub`, category: 'Resource Center' },
    ]

    competitors.push(...competitorPatterns)
    return competitors
  }

  static generateEvents(keyword: string): Event[] {
    const events: Event[] = []
    const currentYear = new Date().getFullYear()
    
    const eventPatterns = [
      {
        name: `${keyword} Conference ${currentYear}`,
        hashtags: [`#${keyword.replace(/\s+/g, '')}Conf`, `#${keyword.replace(/\s+/g, '')}${currentYear}`],
        description: `Annual ${keyword} industry conference`
      },
      {
        name: `${keyword} Week`,
        hashtags: [`#${keyword.replace(/\s+/g, '')}Week`, `#${keyword.replace(/\s+/g, '')}Week${currentYear}`],
        description: `Celebration of all things ${keyword}`
      },
      {
        name: `${keyword} Summit`,
        hashtags: [`#${keyword.replace(/\s+/g, '')}Summit`, `#${keyword.replace(/\s+/g, '')}Summit${currentYear}`],
        description: `Leadership summit for ${keyword} professionals`
      },
      {
        name: `${keyword} Awards`,
        hashtags: [`#${keyword.replace(/\s+/g, '')}Awards`, `#${keyword.replace(/\s+/g, '')}Awards${currentYear}`],
        description: `Annual ${keyword} industry awards`
      }
    ]

    events.push(...eventPatterns)
    return events
  }

  static generateGeographicTargets(keyword: string): GeographicTarget[] {
    const normalizedKeyword = keyword.toLowerCase()
    
    // Check for Florida sportsbook keywords
    const sportsbookKeywords = ['sportsbook', 'betting', 'florida sports', 'florida betting', 'florida sportsbook']
    if (sportsbookKeywords.some(term => normalizedKeyword.includes(term))) {
      return floridaGeographicTargets
    }
    
    const targets: GeographicTarget[] = [
      { location: 'United States', type: 'country', relevance: 'high' },
      { location: 'United Kingdom', type: 'country', relevance: 'high' },
      { location: 'Canada', type: 'country', relevance: 'medium' },
      { location: 'Australia', type: 'country', relevance: 'medium' },
    ]

    // Add major cities
    const majorCities = [
      { location: 'New York', type: 'city' as const, relevance: 'high' as const },
      { location: 'Los Angeles', type: 'city' as const, relevance: 'high' as const },
      { location: 'London', type: 'city' as const, relevance: 'high' as const },
      { location: 'Tokyo', type: 'city' as const, relevance: 'medium' as const },
      { location: 'San Francisco', type: 'city' as const, relevance: 'medium' as const },
    ]

    targets.push(...majorCities)
    return targets
  }

  static generateInterests(keyword: string): InterestCategory[] {
    const normalizedKeyword = keyword.toLowerCase()
    const interests: InterestCategory[] = []

    // Twitter's main interest categories mapping
    const interestMappings: Record<string, InterestCategory[]> = {
      nfl: [
        { id: 'sports', name: 'Sports', subcategories: ['Football', 'NFL', 'American football'] },
        { id: 'sports_news', name: 'Sports news' },
        { id: 'sporting_events', name: 'Sporting events', subcategories: ['NFL games', 'Super Bowl'] }
      ],
      gaming: [
        { id: 'gaming', name: 'Gaming', subcategories: ['Console gaming', 'PC gaming', 'Mobile gaming'] },
        { id: 'gaming_news', name: 'Gaming news' },
        { id: 'esports', name: 'Esports' }
      ],
      fashion: [
        { id: 'fashion', name: 'Fashion & beauty', subcategories: ['Fashion', 'Beauty', 'Fashion brands'] },
        { id: 'fashion_designers', name: 'Fashion designers' },
        { id: 'fashion_events', name: 'Fashion events' }
      ],
      tech: [
        { id: 'technology', name: 'Technology', subcategories: ['Consumer electronics', 'Enterprise technology'] },
        { id: 'tech_news', name: 'Tech news' },
        { id: 'tech_personalities', name: 'Tech personalities' }
      ],
      crypto: [
        { id: 'business_finance', name: 'Business and finance', subcategories: ['Cryptocurrencies', 'Financial services'] },
        { id: 'technology', name: 'Technology', subcategories: ['Blockchain'] }
      ]
    }

    // Check for Florida sportsbook keywords first
    const sportsbookKeywords = ['sportsbook', 'betting', 'florida sports', 'florida betting', 'florida sportsbook']
    if (sportsbookKeywords.some(term => normalizedKeyword.includes(term))) {
      return sportsbookInterests
    }
    
    // Find matching interests
    for (const [industry, categoryList] of Object.entries(interestMappings)) {
      if (normalizedKeyword.includes(industry) || industry.includes(normalizedKeyword)) {
        interests.push(...categoryList)
        break
      }
    }

    // Add generic interests
    if (interests.length === 0) {
      interests.push(
        { id: 'general', name: keyword, subcategories: [`${keyword} enthusiasts`, `${keyword} professionals`] }
      )
    }

    return interests
  }
}