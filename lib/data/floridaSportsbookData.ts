import { IndustryData } from './industryDatabase'
import { TwitterHandle, Hashtag, Personality } from '@/lib/types/targeting'

export const floridaSportsbookData: IndustryData = {
  handles: [
    // Florida NFL Teams
    { handle: '@MiamiDolphins', name: 'Miami Dolphins', category: 'official', verified: true },
    { handle: '@Buccaneers', name: 'Tampa Bay Buccaneers', category: 'official', verified: true },
    { handle: '@Jaguars', name: 'Jacksonville Jaguars', category: 'official', verified: true },
    
    // Florida NBA Teams
    { handle: '@MiamiHEAT', name: 'Miami Heat', category: 'official', verified: true },
    { handle: '@OrlandoMagic', name: 'Orlando Magic', category: 'official', verified: true },
    
    // Florida NHL Teams
    { handle: '@FlaPanthers', name: 'Florida Panthers', category: 'official', verified: true },
    { handle: '@TBLightning', name: 'Tampa Bay Lightning', category: 'official', verified: true },
    
    // Florida MLB Teams
    { handle: '@Marlins', name: 'Miami Marlins', category: 'official', verified: true },
    { handle: '@RaysBaseball', name: 'Tampa Bay Rays', category: 'official', verified: true },
    
    // College Sports
    { handle: '@GatorsFB', name: 'Florida Gators Football', category: 'official', verified: true },
    { handle: '@FSUFootball', name: 'FSU Football', category: 'official', verified: true },
    { handle: '@MiamiHurricanes', name: 'Miami Hurricanes', category: 'official', verified: true },
    { handle: '@UCF_Football', name: 'UCF Football', category: 'official', verified: true },
    
    // Sports Media
    { handle: '@espn', name: 'ESPN', category: 'media', verified: true },
    { handle: '@ActionNetworkHQ', name: 'Action Network', category: 'media', verified: true },
    { handle: '@br_betting', name: 'B/R Betting', category: 'media', verified: true },
    { handle: '@OddsShark', name: 'OddsShark', category: 'media', verified: true },
    
    // Florida Sports Media
    { handle: '@MiamiHerald', name: 'Miami Herald Sports', category: 'media', verified: true },
    { handle: '@orlandosentinel', name: 'Orlando Sentinel Sports', category: 'media', verified: true },
    { handle: '@TB_Times', name: 'Tampa Bay Times Sports', category: 'media', verified: true },
    
    // Sportsbook Competitors
    { handle: '@FDSportsbook', name: 'FanDuel Sportsbook', category: 'brand', verified: true },
    { handle: '@DraftKings', name: 'DraftKings', category: 'brand', verified: true },
    { handle: '@BetMGM', name: 'BetMGM', category: 'brand', verified: true },
    { handle: '@CaesarsSports', name: 'Caesars Sportsbook', category: 'brand', verified: true },
    { handle: '@HardRockBet', name: 'Hard Rock Bet', category: 'brand', verified: true },
  ],
  
  hashtags: [
    // Florida Team Hashtags
    { tag: '#FinsUp', usage: 'high', description: 'Miami Dolphins fans' },
    { tag: '#GoBucs', usage: 'high', description: 'Tampa Bay Buccaneers' },
    { tag: '#DUUUVAL', usage: 'high', description: 'Jacksonville Jaguars' },
    { tag: '#HeatCulture', usage: 'high', description: 'Miami Heat' },
    { tag: '#MagicTogether', usage: 'medium', description: 'Orlando Magic' },
    { tag: '#GoBolts', usage: 'high', description: 'Tampa Bay Lightning' },
    { tag: '#TimeToHunt', usage: 'medium', description: 'Florida Panthers' },
    { tag: '#RaysUp', usage: 'medium', description: 'Tampa Bay Rays' },
    
    // College Hashtags
    { tag: '#GoGators', usage: 'high', description: 'Florida Gators' },
    { tag: '#GoNoles', usage: 'high', description: 'Florida State' },
    { tag: '#ItsAllAboutTheU', usage: 'high', description: 'Miami Hurricanes' },
    { tag: '#ChargeOn', usage: 'medium', description: 'UCF Knights' },
    
    // Betting Hashtags
    { tag: '#SportsBetting', usage: 'high', description: 'General sports betting' },
    { tag: '#GamblingTwitter', usage: 'high', description: 'Betting community' },
    { tag: '#BettingTips', usage: 'high', description: 'Betting advice' },
    { tag: '#FreeBets', usage: 'high', description: 'Promotional offers' },
    { tag: '#PlayerProps', usage: 'medium', description: 'Player prop bets' },
    { tag: '#Parlay', usage: 'high', description: 'Parlay betting' },
    { tag: '#LiveBetting', usage: 'medium', description: 'In-game betting' },
    { tag: '#BetResponsibly', usage: 'high', description: 'Responsible gambling' },
    
    // Florida-specific
    { tag: '#FloridaSports', usage: 'medium', description: 'All Florida sports' },
    { tag: '#SunshineSports', usage: 'low', description: 'Florida sports nickname' },
    { tag: '#FloridaBetting', usage: 'medium', description: 'Florida sports betting' },
  ],
  
  personalities: [
    // NFL Players & Personalities
    { name: 'Tua Tagovailoa', handle: '@Tua', role: 'Dolphins QB', influence: 'macro', verified: true },
    { name: 'Mike Evans', handle: '@MikeEvans13_', role: 'Buccaneers WR', influence: 'macro', verified: true },
    { name: 'Trevor Lawrence', handle: '@Trevorlawrencee', role: 'Jaguars QB', influence: 'macro', verified: true },
    
    // NBA Players
    { name: 'Jimmy Butler', handle: '@JimmyButler', role: 'Heat Star', influence: 'macro', verified: true },
    { name: 'Bam Adebayo', handle: '@Bam1of1', role: 'Heat Center', influence: 'macro', verified: true },
    { name: 'Paolo Banchero', handle: '@Pp_doesit', role: 'Magic Forward', influence: 'micro', verified: true },
    
    // Local Sports Media
    { name: 'Omar Kelly', handle: '@OmarKelly', role: 'Dolphins Beat Writer', influence: 'micro', verified: true },
    { name: 'Greg Auman', handle: '@gregauman', role: 'Bucs Reporter', influence: 'micro', verified: true },
    { name: 'Ira Winderman', handle: '@IraHeatBeat', role: 'Heat Beat Writer', influence: 'micro', verified: true },
    
    // Betting Experts
    { name: 'Darren Rovell', handle: '@darrenrovell', role: 'Sports Business Reporter', influence: 'macro', verified: true },
    { name: 'Bill Simmons', handle: '@BillSimmons', role: 'Sports Analyst & Bettor', influence: 'macro', verified: true },
    { name: 'Vegas Dave', handle: '@VegasDave', role: 'Sports Betting Personality', influence: 'micro', verified: false },
    
    // Local Influencers
    { name: 'Dan Le Batard', handle: '@LeBatardShow', role: 'Miami Sports Personality', influence: 'macro', verified: true },
    { name: 'Pat Dooley', handle: '@PatDooleyUF', role: 'Florida Sports Writer', influence: 'micro', verified: true },
  ],
  
  keywords: [
    // Betting Terms
    'sports betting', 'sportsbook', 'florida betting', 'online betting', 'mobile betting',
    'bet slip', 'odds', 'spreads', 'point spread', 'over under', 'moneyline',
    'parlay', 'teaser', 'prop bets', 'live betting', 'in-play betting',
    'cash out', 'free bet', 'risk free bet', 'odds boost', 'profit boost',
    
    // Florida Teams
    'dolphins betting', 'buccaneers betting', 'jaguars betting',
    'heat betting', 'magic betting', 'lightning betting', 'panthers betting',
    'rays betting', 'marlins betting', 'gators betting', 'seminoles betting',
    'hurricanes betting', 'ucf betting',
    
    // Promotional
    'florida sportsbook promo', 'welcome bonus', 'deposit match', 'signup bonus',
    'florida betting app', 'legal sports betting florida', 'florida gambling',
    
    // Events
    'super bowl betting', 'nba finals betting', 'world series betting',
    'march madness florida', 'college football playoffs', 'stanley cup betting',
    
    // Responsible Gaming
    'responsible gambling', 'betting limits', 'self exclusion', 'problem gambling'
  ],
  
  events: [
    'Super Bowl', 'NFL Playoffs', 'NBA Finals', 'Stanley Cup Playoffs',
    'World Series', 'March Madness', 'College Football Playoff',
    'Orange Bowl', 'Citrus Bowl', 'Gasparilla Bowl', 'Daytona 500',
    'The Players Championship', 'Miami Open', 'Florida Derby'
  ]
}

// Additional Florida-specific targeting data
export const floridaGeographicTargets = [
  // Major Cities
  { location: 'Miami', type: 'city' as const, relevance: 'high' as const },
  { location: 'Tampa', type: 'city' as const, relevance: 'high' as const },
  { location: 'Jacksonville', type: 'city' as const, relevance: 'high' as const },
  { location: 'Orlando', type: 'city' as const, relevance: 'high' as const },
  { location: 'Fort Lauderdale', type: 'city' as const, relevance: 'high' as const },
  { location: 'St. Petersburg', type: 'city' as const, relevance: 'medium' as const },
  { location: 'Tallahassee', type: 'city' as const, relevance: 'medium' as const },
  { location: 'Gainesville', type: 'city' as const, relevance: 'medium' as const },
  
  // Counties
  { location: 'Miami-Dade County', type: 'region' as const, relevance: 'high' as const },
  { location: 'Broward County', type: 'region' as const, relevance: 'high' as const },
  { location: 'Palm Beach County', type: 'region' as const, relevance: 'high' as const },
  { location: 'Hillsborough County', type: 'region' as const, relevance: 'high' as const },
  { location: 'Orange County', type: 'region' as const, relevance: 'high' as const },
  
  // State
  { location: 'Florida', type: 'state' as const, relevance: 'high' as const },
  
  // Neighboring States (for border marketing)
  { location: 'Georgia', type: 'state' as const, relevance: 'low' as const },
  { location: 'Alabama', type: 'state' as const, relevance: 'low' as const },
]

// Betting-specific interest categories
export const sportsbookInterests = [
  { id: 'sports', name: 'Sports', subcategories: ['NFL', 'NBA', 'MLB', 'NHL', 'College Football', 'College Basketball'] },
  { id: 'sports_betting', name: 'Sports betting' },
  { id: 'gambling', name: 'Gambling' },
  { id: 'fantasy_sports', name: 'Fantasy sports', subcategories: ['Daily Fantasy Sports', 'Season-long Fantasy'] },
  { id: 'florida_sports', name: 'Florida Sports Teams' },
  { id: 'sports_news', name: 'Sports news' },
  { id: 'sporting_events', name: 'Sporting events' },
]

// Competitor sportsbooks operating in Florida
export const floridaCompetitors = [
  { name: 'Hard Rock Bet', handle: '@HardRockBet', category: 'Primary Competitor' },
  { name: 'FanDuel', handle: '@FDSportsbook', category: 'Major Competitor' },
  { name: 'DraftKings', handle: '@DraftKings', category: 'Major Competitor' },
  { name: 'BetMGM', handle: '@BetMGM', category: 'Major Competitor' },
  { name: 'Caesars', handle: '@CaesarsSports', category: 'Major Competitor' },
  { name: 'PointsBet', handle: '@PointsBetUSA', category: 'Competitor' },
  { name: 'BetRivers', handle: '@BetRivers', category: 'Competitor' },
]

// Seasonal campaigns for Florida sportsbook
export const floridaSeasonalCampaigns = {
  fall: {
    focus: 'NFL & College Football',
    hashtags: ['#NFLSeason', '#CollegeFootball', '#FootballSeason', '#BowlSeason'],
    events: ['NFL Kickoff', 'College Football Week 1', 'Thanksgiving Games', 'Bowl Games']
  },
  winter: {
    focus: 'NBA, NHL & College Basketball',
    hashtags: ['#NBAseason', '#NHLseason', '#MarchMadness', '#SuperBowl'],
    events: ['NBA All-Star', 'NHL All-Star', 'March Madness', 'Super Bowl']
  },
  spring: {
    focus: 'MLB, NBA/NHL Playoffs',
    hashtags: ['#MLBOpening', '#NBAPlayoffs', '#StanleyCup', '#SpringTraining'],
    events: ['MLB Opening Day', 'NBA Playoffs', 'Stanley Cup Playoffs', 'The Players Championship']
  },
  summer: {
    focus: 'MLB, Soccer, Golf',
    hashtags: ['#MLBSeason', '#WorldCup', '#GolfMajors', '#Olympics'],
    events: ['MLB All-Star Game', 'US Open Golf', 'FIFA Events', 'Summer Olympics']
  }
}