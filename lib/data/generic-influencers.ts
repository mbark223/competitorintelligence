import { Influencer } from '@/types/targeting'

export const genericInfluencers: Record<string, Influencer[]> = {
  technology: [
    { handle: '@elonmusk', name: 'Elon Musk', followerCount: 190000000, relevanceScore: 10, category: 'macro' },
    { handle: '@sundarpichai', name: 'Sundar Pichai', followerCount: 4000000, relevanceScore: 9, category: 'macro' },
    { handle: '@satyanadella', name: 'Satya Nadella', followerCount: 3200000, relevanceScore: 9, category: 'macro' },
    { handle: '@mkbhd', name: 'Marques Brownlee', followerCount: 6800000, relevanceScore: 9, category: 'macro' },
    { handle: '@verge', name: 'The Verge', followerCount: 3000000, relevanceScore: 8, category: 'macro' },
    { handle: '@TechCrunch', name: 'TechCrunch', followerCount: 10000000, relevanceScore: 8, category: 'macro' },
  ],
  
  fashion: [
    { handle: '@voguemagazine', name: 'Vogue', followerCount: 13000000, relevanceScore: 10, category: 'macro' },
    { handle: '@KendallJenner', name: 'Kendall Jenner', followerCount: 35000000, relevanceScore: 9, category: 'macro' },
    { handle: '@GiGiHadid', name: 'Gigi Hadid', followerCount: 9000000, relevanceScore: 9, category: 'macro' },
    { handle: '@Zara', name: 'ZARA', followerCount: 1200000, relevanceScore: 8, category: 'macro' },
    { handle: '@hm', name: 'H&M', followerCount: 8500000, relevanceScore: 8, category: 'macro' },
  ],
  
  fitness: [
    { handle: '@TheRock', name: 'Dwayne Johnson', followerCount: 16000000, relevanceScore: 10, category: 'macro' },
    { handle: '@Cristiano', name: 'Cristiano Ronaldo', followerCount: 109000000, relevanceScore: 9, category: 'macro' },
    { handle: '@MrBeastYT', name: 'MrBeast', followerCount: 22000000, relevanceScore: 8, category: 'macro' },
    { handle: '@kayla_itsines', name: 'Kayla Itsines', followerCount: 800000, relevanceScore: 8, category: 'micro' },
    { handle: '@massy.arias', name: 'Massy Arias', followerCount: 300000, relevanceScore: 7, category: 'micro' },
  ],
  
  food: [
    { handle: '@GordonRamsay', name: 'Gordon Ramsay', followerCount: 7500000, relevanceScore: 10, category: 'macro' },
    { handle: '@Tasty', name: 'Tasty', followerCount: 2000000, relevanceScore: 9, category: 'macro' },
    { handle: '@foodnetwork', name: 'Food Network', followerCount: 1500000, relevanceScore: 8, category: 'macro' },
    { handle: '@jamieoliver', name: 'Jamie Oliver', followerCount: 6800000, relevanceScore: 8, category: 'macro' },
  ],
  
  travel: [
    { handle: '@NatGeo', name: 'National Geographic', followerCount: 30000000, relevanceScore: 10, category: 'macro' },
    { handle: '@lonelyplanet', name: 'Lonely Planet', followerCount: 2200000, relevanceScore: 9, category: 'macro' },
    { handle: '@TripAdvisor', name: 'TripAdvisor', followerCount: 500000, relevanceScore: 8, category: 'micro' },
    { handle: '@Expedia', name: 'Expedia', followerCount: 250000, relevanceScore: 7, category: 'micro' },
  ],
  
  gaming: [
    { handle: '@Ninja', name: 'Ninja', followerCount: 6700000, relevanceScore: 10, category: 'macro' },
    { handle: '@pokimanelol', name: 'Pokimane', followerCount: 4000000, relevanceScore: 9, category: 'macro' },
    { handle: '@IGN', name: 'IGN', followerCount: 6500000, relevanceScore: 9, category: 'macro' },
    { handle: '@Twitch', name: 'Twitch', followerCount: 9500000, relevanceScore: 8, category: 'macro' },
    { handle: '@PlayStation', name: 'PlayStation', followerCount: 20000000, relevanceScore: 8, category: 'macro' },
    { handle: '@Xbox', name: 'Xbox', followerCount: 13000000, relevanceScore: 8, category: 'macro' },
  ],
  
  music: [
    { handle: '@Spotify', name: 'Spotify', followerCount: 4000000, relevanceScore: 10, category: 'macro' },
    { handle: '@AppleMusic', name: 'Apple Music', followerCount: 900000, relevanceScore: 9, category: 'micro' },
    { handle: '@RollingStone', name: 'Rolling Stone', followerCount: 3200000, relevanceScore: 8, category: 'macro' },
    { handle: '@billboard', name: 'Billboard', followerCount: 6000000, relevanceScore: 8, category: 'macro' },
  ],
  
  beauty: [
    { handle: '@jamescharles', name: 'James Charles', followerCount: 7500000, relevanceScore: 10, category: 'macro' },
    { handle: '@NikkieTutorials', name: 'NikkieTutorials', followerCount: 2000000, relevanceScore: 9, category: 'macro' },
    { handle: '@Sephora', name: 'Sephora', followerCount: 2300000, relevanceScore: 9, category: 'macro' },
    { handle: '@ultabeauty', name: 'Ulta Beauty', followerCount: 900000, relevanceScore: 8, category: 'micro' },
  ],
  
  finance: [
    { handle: '@WarrenBuffett', name: 'Warren Buffett', followerCount: 2000000, relevanceScore: 10, category: 'macro' },
    { handle: '@RayDalio', name: 'Ray Dalio', followerCount: 1000000, relevanceScore: 9, category: 'macro' },
    { handle: '@CNBC', name: 'CNBC', followerCount: 4500000, relevanceScore: 8, category: 'macro' },
    { handle: '@WSJ', name: 'Wall Street Journal', followerCount: 19000000, relevanceScore: 8, category: 'macro' },
    { handle: '@coinbase', name: 'Coinbase', followerCount: 2800000, relevanceScore: 7, category: 'macro' },
  ],
  
  education: [
    { handle: '@edutopia', name: 'Edutopia', followerCount: 700000, relevanceScore: 9, category: 'micro' },
    { handle: '@coursera', name: 'Coursera', followerCount: 650000, relevanceScore: 8, category: 'micro' },
    { handle: '@udemy', name: 'Udemy', followerCount: 300000, relevanceScore: 7, category: 'micro' },
    { handle: '@khanacademy', name: 'Khan Academy', followerCount: 1900000, relevanceScore: 8, category: 'macro' },
  ],
  
  entertainment: [
    { handle: '@netflix', name: 'Netflix', followerCount: 32000000, relevanceScore: 10, category: 'macro' },
    { handle: '@PrimeVideo', name: 'Prime Video', followerCount: 4500000, relevanceScore: 9, category: 'macro' },
    { handle: '@hulu', name: 'Hulu', followerCount: 2000000, relevanceScore: 8, category: 'macro' },
    { handle: '@disneyplus', name: 'Disney+', followerCount: 3500000, relevanceScore: 8, category: 'macro' },
    { handle: '@HBO', name: 'HBO', followerCount: 7000000, relevanceScore: 8, category: 'macro' },
  ],
}