import { Influencer } from '@/types/targeting'

export const nflInfluencers = {
  official: [
    {
      handle: '@NFL',
      name: 'National Football League',
      followerCount: 35000000,
      relevanceScore: 10,
      category: 'macro' as const,
    },
    {
      handle: '@NFLNetwork',
      name: 'NFL Network',
      followerCount: 8500000,
      relevanceScore: 9,
      category: 'macro' as const,
    },
    {
      handle: '@ESPNNFL',
      name: 'ESPN NFL',
      followerCount: 12000000,
      relevanceScore: 9,
      category: 'macro' as const,
    },
  ],
  
  media: [
    {
      handle: '@AdamSchefter',
      name: 'Adam Schefter',
      followerCount: 10000000,
      relevanceScore: 9,
      category: 'macro' as const,
    },
    {
      handle: '@RapSheet',
      name: 'Ian Rapoport',
      followerCount: 3000000,
      relevanceScore: 8,
      category: 'macro' as const,
    },
    {
      handle: '@PatMcAfeeShow',
      name: 'Pat McAfee',
      followerCount: 2500000,
      relevanceScore: 8,
      category: 'macro' as const,
    },
    {
      handle: '@ColinCowherd',
      name: 'Colin Cowherd',
      followerCount: 1800000,
      relevanceScore: 7,
      category: 'macro' as const,
    },
    {
      handle: '@stephenasmith',
      name: 'Stephen A Smith',
      followerCount: 5500000,
      relevanceScore: 7,
      category: 'macro' as const,
    },
  ],
  
  players: [
    {
      handle: '@PatrickMahomes',
      name: 'Patrick Mahomes',
      followerCount: 2200000,
      relevanceScore: 10,
      category: 'macro' as const,
    },
    {
      handle: '@AaronRodgers12',
      name: 'Aaron Rodgers',
      followerCount: 4500000,
      relevanceScore: 9,
      category: 'macro' as const,
    },
    {
      handle: '@JoshAllenQB',
      name: 'Josh Allen',
      followerCount: 800000,
      relevanceScore: 9,
      category: 'micro' as const,
    },
    {
      handle: '@Trevorlawrencee',
      name: 'Trevor Lawrence',
      followerCount: 500000,
      relevanceScore: 8,
      category: 'micro' as const,
    },
    {
      handle: '@JJWatt',
      name: 'JJ Watt',
      followerCount: 5800000,
      relevanceScore: 8,
      category: 'macro' as const,
    },
  ],
  
  teams: {
    'Cowboys': [
      {
        handle: '@dallascowboys',
        name: 'Dallas Cowboys',
        followerCount: 4200000,
        relevanceScore: 10,
        category: 'macro' as const,
      },
      {
        handle: '@dak',
        name: 'Dak Prescott',
        followerCount: 1200000,
        relevanceScore: 9,
        category: 'macro' as const,
      },
    ],
    'Patriots': [
      {
        handle: '@Patriots',
        name: 'New England Patriots',
        followerCount: 4500000,
        relevanceScore: 10,
        category: 'macro' as const,
      },
    ],
    'Chiefs': [
      {
        handle: '@Chiefs',
        name: 'Kansas City Chiefs',
        followerCount: 2800000,
        relevanceScore: 10,
        category: 'macro' as const,
      },
      {
        handle: '@tkelce',
        name: 'Travis Kelce',
        followerCount: 3200000,
        relevanceScore: 9,
        category: 'macro' as const,
      },
    ],
    'Packers': [
      {
        handle: '@packers',
        name: 'Green Bay Packers',
        followerCount: 5200000,
        relevanceScore: 10,
        category: 'macro' as const,
      },
    ],
  },
}