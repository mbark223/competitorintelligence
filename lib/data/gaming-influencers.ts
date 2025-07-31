import { Influencer } from '@/types/targeting'

export const gamingInfluencers = {
  sportsbook: {
    media: [
      // Major sports media
      { handle: '@ESPNBet', name: 'ESPN Bet', followerCount: 500000, relevanceScore: 10, category: 'macro' as const },
      { handle: '@br_betting', name: 'B/R Betting', followerCount: 1200000, relevanceScore: 10, category: 'macro' as const },
      { handle: '@ActionNetworkHQ', name: 'Action Network', followerCount: 400000, relevanceScore: 10, category: 'micro' as const },
      { handle: '@TheAthletic', name: 'The Athletic', followerCount: 1500000, relevanceScore: 9, category: 'macro' as const },
      { handle: '@OddsShark', name: 'OddsShark', followerCount: 350000, relevanceScore: 9, category: 'micro' as const },
      { handle: '@Covers', name: 'Covers', followerCount: 250000, relevanceScore: 8, category: 'micro' as const },
      { handle: '@VSiNLive', name: 'VSiN', followerCount: 150000, relevanceScore: 8, category: 'micro' as const },
    ],
    
    personalities: [
      // Betting personalities and experts
      { handle: '@PatMcAfeeShow', name: 'Pat McAfee', followerCount: 2500000, relevanceScore: 10, category: 'macro' as const },
      { handle: '@ClayTravis', name: 'Clay Travis', followerCount: 1000000, relevanceScore: 9, category: 'macro' as const },
      { handle: '@darrenrovell', name: 'Darren Rovell', followerCount: 2000000, relevanceScore: 9, category: 'macro' as const },
      { handle: '@RJinVegas', name: 'RJ Bell', followerCount: 100000, relevanceScore: 8, category: 'micro' as const },
      { handle: '@BillSimmons', name: 'Bill Simmons', followerCount: 6500000, relevanceScore: 8, category: 'macro' as const },
      { handle: '@CousinSal', name: 'Cousin Sal', followerCount: 500000, relevanceScore: 8, category: 'micro' as const },
      { handle: '@Warren_Sharp', name: 'Warren Sharp', followerCount: 300000, relevanceScore: 9, category: 'micro' as const },
    ],
    
    handicappers: [
      // Professional handicappers
      { handle: '@vegasdave', name: 'Vegas Dave', followerCount: 200000, relevanceScore: 8, category: 'micro' as const },
      { handle: '@bobvoulgaris', name: 'Bob Voulgaris', followerCount: 150000, relevanceScore: 9, category: 'micro' as const },
      { handle: '@rufuspealeSB', name: 'Rufus Peabody', followerCount: 80000, relevanceScore: 9, category: 'nano' as const },
      { handle: '@PaulLoDuca', name: 'Paul Lo Duca', followerCount: 100000, relevanceScore: 7, category: 'micro' as const },
      { handle: '@SteveFezzik', name: 'Steve Fezzik', followerCount: 50000, relevanceScore: 8, category: 'nano' as const },
    ],
    
    content: [
      // Content creators and streamers
      { handle: '@PennyPicksPod', name: 'Penny Picks Podcast', followerCount: 75000, relevanceScore: 8, category: 'nano' as const },
      { handle: '@BetTheBoardPod', name: 'Bet The Board', followerCount: 60000, relevanceScore: 8, category: 'nano' as const },
      { handle: '@GreenLightPod', name: 'Green Light Podcast', followerCount: 40000, relevanceScore: 7, category: 'nano' as const },
      { handle: '@HammerDAHN', name: 'Hammer Dahn', followerCount: 100000, relevanceScore: 8, category: 'micro' as const },
      { handle: '@BangTheBook', name: 'Bang The Book', followerCount: 30000, relevanceScore: 7, category: 'nano' as const },
    ],
    
    dfs: [
      // DFS crossover influencers
      { handle: '@AdamLevitan', name: 'Adam Levitan', followerCount: 100000, relevanceScore: 9, category: 'micro' as const },
      { handle: '@EstablishTheRun', name: 'Establish The Run', followerCount: 150000, relevanceScore: 9, category: 'micro' as const },
      { handle: '@Awesemo_Com', name: 'Awesemo', followerCount: 80000, relevanceScore: 8, category: 'nano' as const },
      { handle: '@ChrisRaybon', name: 'Chris Raybon', followerCount: 50000, relevanceScore: 8, category: 'nano' as const },
      { handle: '@SaberSim', name: 'SaberSim', followerCount: 40000, relevanceScore: 7, category: 'nano' as const },
    ]
  },
  
  icasino: {
    streamers: [
      // Casino streamers
      { handle: '@Roshtein', name: 'Roshtein', followerCount: 500000, relevanceScore: 10, category: 'micro' as const },
      { handle: '@TrainwrecksTV', name: 'Trainwreckstv', followerCount: 800000, relevanceScore: 10, category: 'micro' as const },
      { handle: '@ClassyBeef', name: 'ClassyBeef', followerCount: 200000, relevanceScore: 9, category: 'micro' as const },
      { handle: '@XPosed', name: 'Xposed', followerCount: 150000, relevanceScore: 8, category: 'micro' as const },
      { handle: '@CasinoDaddy', name: 'CasinoDaddy', followerCount: 100000, relevanceScore: 8, category: 'micro' as const },
      { handle: '@LetsGiveItASpin', name: 'LetsGiveItASpin', followerCount: 80000, relevanceScore: 8, category: 'nano' as const },
    ],
    
    affiliates: [
      // Casino affiliate sites
      { handle: '@CasinoOrg', name: 'Casino.org', followerCount: 50000, relevanceScore: 9, category: 'nano' as const },
      { handle: '@CasinoGurucom', name: 'Casino Guru', followerCount: 40000, relevanceScore: 9, category: 'nano' as const },
      { handle: '@AskGamblers', name: 'AskGamblers', followerCount: 60000, relevanceScore: 8, category: 'nano' as const },
      { handle: '@ThePogg', name: 'ThePOGG', followerCount: 20000, relevanceScore: 7, category: 'nano' as const },
      { handle: '@LatestCasinoBon', name: 'Latest Casino Bonuses', followerCount: 30000, relevanceScore: 7, category: 'nano' as const },
    ],
    
    content: [
      // Casino content creators
      { handle: '@SlotLady', name: 'Slot Lady', followerCount: 100000, relevanceScore: 9, category: 'micro' as const },
      { handle: '@BCSlots', name: 'Brian Christopher Slots', followerCount: 150000, relevanceScore: 9, category: 'micro' as const },
      { handle: '@NGSlot', name: 'NG Slot', followerCount: 80000, relevanceScore: 8, category: 'nano' as const },
      { handle: '@SlotMachineUni', name: 'Slot Machine University', followerCount: 40000, relevanceScore: 7, category: 'nano' as const },
      { handle: '@BigWinPictures', name: 'Big Win Pictures', followerCount: 60000, relevanceScore: 8, category: 'nano' as const },
    ],
    
    providers: [
      // Game providers and official accounts
      { handle: '@NetEnt', name: 'NetEnt', followerCount: 25000, relevanceScore: 8, category: 'nano' as const },
      { handle: '@Microgaming', name: 'Microgaming', followerCount: 20000, relevanceScore: 8, category: 'nano' as const },
      { handle: '@EvolutionGroup', name: 'Evolution Gaming', followerCount: 30000, relevanceScore: 9, category: 'nano' as const },
      { handle: '@Pragmatic_Play', name: 'Pragmatic Play', followerCount: 35000, relevanceScore: 8, category: 'nano' as const },
      { handle: '@Play_n_Go', name: "Play'n GO", followerCount: 15000, relevanceScore: 7, category: 'nano' as const },
    ]
  },
  
  general: [
    // General gambling media
    { handle: '@GamblingCom', name: 'Gambling.com', followerCount: 40000, relevanceScore: 8, category: 'nano' as const },
    { handle: '@CalvinAyre', name: 'Calvin Ayre', followerCount: 30000, relevanceScore: 7, category: 'nano' as const },
    { handle: '@EGRIntel', name: 'EGR Intel', followerCount: 20000, relevanceScore: 7, category: 'nano' as const },
    { handle: '@SBCNews', name: 'SBC News', followerCount: 15000, relevanceScore: 6, category: 'nano' as const },
    { handle: '@GamblingInsider', name: 'Gambling Insider', followerCount: 25000, relevanceScore: 7, category: 'nano' as const },
  ]
}

export function getGamingInfluencers(type: 'sportsbook' | 'icasino' | 'both'): Influencer[] {
  const influencers: Influencer[] = []
  
  if (type === 'sportsbook' || type === 'both') {
    influencers.push(...gamingInfluencers.sportsbook.media)
    influencers.push(...gamingInfluencers.sportsbook.personalities)
    influencers.push(...gamingInfluencers.sportsbook.handicappers)
    influencers.push(...gamingInfluencers.sportsbook.content)
    influencers.push(...gamingInfluencers.sportsbook.dfs)
  }
  
  if (type === 'icasino' || type === 'both') {
    influencers.push(...gamingInfluencers.icasino.streamers)
    influencers.push(...gamingInfluencers.icasino.affiliates)
    influencers.push(...gamingInfluencers.icasino.content)
    influencers.push(...gamingInfluencers.icasino.providers)
  }
  
  influencers.push(...gamingInfluencers.general)
  
  // Remove duplicates and sort by relevance
  const uniqueInfluencers = Array.from(
    new Map(influencers.map(inf => [inf.handle, inf])).values()
  )
  
  return uniqueInfluencers.sort((a, b) => {
    const scoreA = (a.relevanceScore || 0) * (a.followerCount || 0)
    const scoreB = (b.relevanceScore || 0) * (b.followerCount || 0)
    return scoreB - scoreA
  })
}