export interface GamingPreset {
  id: string
  name: string
  category: 'sportsbook' | 'icasino' | 'both'
  description: string
  profile: string
}

export const gamingPresets: GamingPreset[] = [
  // Sportsbook Presets
  {
    id: 'sportsbook-casual',
    name: 'Sportsbook: Casual Weekend Bettor',
    category: 'sportsbook',
    description: 'Recreational sports fans who bet occasionally for entertainment',
    profile: 'Male and female sports fans aged 21-45 who watch NFL, NBA, MLB games on weekends and place small recreational bets for entertainment. They follow their favorite teams, engage with sports content on social media, participate in office pools, and view sports betting as a way to make games more exciting. They typically bet $10-50 per week during their team\'s season, prefer simple bet types like moneylines and spreads, use mobile apps for convenience, and are influenced by promotions and sign-up bonuses. They consume sports media through ESPN, The Athletic, and team-specific content.'
  },
  {
    id: 'sportsbook-serious',
    name: 'Sportsbook: Professional Handicapper',
    category: 'sportsbook',
    description: 'Serious bettors who treat sports betting as an investment',
    profile: 'Predominantly male aged 25-55 who approach sports betting analytically and professionally. They spend 10+ hours weekly researching stats, injuries, weather conditions, and line movements. They follow professional handicappers, use multiple sportsbooks for best odds, manage bankroll systematically with 1-5% unit sizing, and focus on finding value rather than betting favorites. They subscribe to premium betting services, use advanced analytics tools, participate in betting forums and Discord groups, track all bets in spreadsheets, and view sports betting as a long-term investment requiring discipline and data analysis.'
  },
  {
    id: 'sportsbook-live',
    name: 'Sportsbook: Live Betting Enthusiast',
    category: 'sportsbook',
    description: 'Action-seekers who prefer in-game betting',
    profile: 'Tech-savvy sports fans aged 21-40 who crave constant action and engagement during games. They multi-screen between TV and mobile devices, place multiple live bets per game on changing odds, enjoy prop bets and micro-markets, react quickly to game momentum shifts, and seek instant gratification from rapid bet settlement. They follow real-time stats providers, use fastest mobile apps with live streaming, engage heavily during primetime games and playoffs, share betting slips on social media, and are attracted to cash-out features and bet builders.'
  },
  {
    id: 'sportsbook-fantasy',
    name: 'Sportsbook: Fantasy-First Bettor',
    category: 'sportsbook',
    description: 'Fantasy sports players transitioning to sports betting',
    profile: 'Fantasy sports veterans aged 25-45 who leverage their player knowledge for betting. They participate in multiple season-long and DFS leagues, focus heavily on player props and same-game parlays, use fantasy research for betting insights, bet on players from their fantasy teams, and combine fantasy and betting for maximum engagement. They follow fantasy experts and podcasts, use FantasyPros, Rotoworld, and similar tools, active in fantasy sports communities, attracted to fantasy-sports hybrid products, and view betting as natural extension of fantasy expertise.'
  },

  // iCasino Presets
  {
    id: 'icasino-slots',
    name: 'iCasino: Slots Enthusiast',
    category: 'icasino',
    description: 'Players who primarily enjoy slot games',
    profile: 'Diverse demographic aged 25-65 who enjoy the entertainment and excitement of online slots. They play daily for 30-60 minute sessions, prefer themed slots based on movies/TV shows, attracted to progressive jackpots and bonus features, enjoy free spins and daily bonuses, and play for entertainment rather than profit. They follow slot streamers on Twitch and YouTube, join online casino communities and forums, share big wins on social media, collect loyalty points and achievements, and switch between multiple games for variety.'
  },
  {
    id: 'icasino-table',
    name: 'iCasino: Table Games Player',
    category: 'icasino',
    description: 'Strategic players who prefer skill-based casino games',
    profile: 'Educated adults aged 30-60 who prefer strategy and skill in casino games. They focus on blackjack, roulette, baccarat, and poker, study optimal strategies and betting systems, prefer live dealer games for authenticity, manage bankroll with strict limits, and seek lowest house edge games. They read strategy guides and forums, watch professional players and tutorials, track results and analyze patterns, value VIP programs with cashback, and appreciate high betting limits for serious play.'
  },
  {
    id: 'icasino-vip',
    name: 'iCasino: VIP High Roller',
    category: 'icasino',
    description: 'High-value players with significant bankrolls',
    profile: 'Affluent individuals aged 35-65 with disposable income for premium gaming. They deposit $1000+ monthly, play high-limit slots and table games, expect personalized VIP treatment, value exclusive bonuses and faster withdrawals, and seek premium gaming experiences. They demand dedicated account managers, participate in VIP tournaments and events, expect luxury rewards and experiences, influence others in their network, and switch casinos for better VIP perks.'
  },
  {
    id: 'icasino-casual',
    name: 'iCasino: Casual Mobile Gamer',
    category: 'icasino',
    description: 'Mobile-first players who play casino games casually',
    profile: 'Mobile gamers aged 21-45 who play casino games as casual entertainment. They play exclusively on smartphones, prefer quick 5-15 minute sessions, enjoy simple games like slots and scratch cards, use no-deposit bonuses to try new games, and play during commutes or break times. They discovered casino through mobile app stores, influenced by mobile game advertising, appreciate gamification features, share on casual gaming communities, and treat it like other mobile entertainment.'
  },

  // Cross-Product Presets
  {
    id: 'both-weekend-warrior',
    name: 'Weekend Sports & Casino Player',
    category: 'both',
    description: 'Players who enjoy both sports betting and casino games',
    profile: 'Entertainment seekers aged 25-50 who engage with all forms of online gambling. They bet on sports during game days, play casino games between sporting events, increase activity during major sports seasons, use same account for convenience, and seek cross-product promotions. They follow both sports and casino influencers, participate in combined loyalty programs, appreciate unified wallet features, enjoy variety in gambling options, and respond to cross-sell opportunities.'
  },
  {
    id: 'both-vip-gambler',
    name: 'High-Value Omni-Gambler',
    category: 'both',
    description: 'VIP players active across all products',
    profile: 'High-net-worth individuals aged 35-60 who gamble seriously across all verticals. They maintain large bankrolls for both sports and casino, bet high stakes on major sporting events, play VIP casino tables regularly, expect premium treatment across products, and value comprehensive VIP programs. They use multiple gambling platforms, track performance across all products, network with other high-stakes players, seek exclusive cross-product bonuses, and influence platform choice for peers.'
  }
]

export function getPresetsByCategory(category: 'sportsbook' | 'icasino' | 'both'): GamingPreset[] {
  return gamingPresets.filter(preset => preset.category === category || category === 'both')
}

export function getPresetById(id: string): GamingPreset | undefined {
  return gamingPresets.find(preset => preset.id === id)
}