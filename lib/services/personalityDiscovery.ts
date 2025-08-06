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
    const genericPersonalities: Personality[] = [
      {
        name: `${keyword} Expert`,
        handle: `@${keyword.replace(/\s+/g, '')}Expert`,
        role: `Leading ${keyword} Authority`,
        influence: 'micro',
        verified: false
      },
      {
        name: `${keyword} Daily`,
        handle: `@${keyword.replace(/\s+/g, '')}Daily`,
        role: `${keyword} News & Updates`,
        influence: 'micro',
        verified: false
      },
      {
        name: `The ${keyword} Guy`,
        handle: `@The${keyword.replace(/\s+/g, '')}Guy`,
        role: `${keyword} Content Creator`,
        influence: 'nano',
        verified: false
      },
      {
        name: `${keyword} Insider`,
        handle: `@${keyword.replace(/\s+/g, '')}Insider`,
        role: `${keyword} Industry Insider`,
        influence: 'micro',
        verified: false
      }
    ]

    personalities.push(...genericPersonalities)

    return personalities
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