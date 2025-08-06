import { TwitterHandle, Hashtag, Personality } from '@/lib/types/targeting'

export interface IndustryData {
  handles: TwitterHandle[]
  hashtags: Hashtag[]
  personalities: Personality[]
  keywords: string[]
  events: string[]
}

export const industryDatabase: Record<string, IndustryData> = {
  // Sports Industries
  nba: {
    handles: [
      { handle: '@NBA', name: 'National Basketball Association', category: 'official', verified: true },
      { handle: '@NBAonTNT', name: 'NBA on TNT', category: 'media', verified: true },
      { handle: '@ESPNNBA', name: 'ESPN NBA', category: 'media', verified: true },
      { handle: '@TheAthletic', name: 'The Athletic', category: 'media', verified: true },
      { handle: '@BleacherReport', name: 'Bleacher Report', category: 'media', verified: true },
    ],
    hashtags: [
      { tag: '#NBA', usage: 'high' },
      { tag: '#Basketball', usage: 'high' },
      { tag: '#NBAPlayoffs', usage: 'high' },
      { tag: '#NBAFinals', usage: 'high' },
      { tag: '#NBATips', usage: 'medium' },
    ],
    personalities: [
      { name: 'LeBron James', handle: '@KingJames', role: 'NBA Player - Lakers', influence: 'macro', verified: true },
      { name: 'Stephen Curry', handle: '@StephenCurry30', role: 'NBA Player - Warriors', influence: 'macro', verified: true },
      { name: 'Shaquille O\'Neal', handle: '@SHAQ', role: 'NBA Legend & Analyst', influence: 'macro', verified: true },
      { name: 'Adrian Wojnarowski', handle: '@wojespn', role: 'ESPN NBA Insider', influence: 'macro', verified: true },
    ],
    keywords: ['basketball', 'hoops', 'court', 'slam dunk', 'three pointer', 'playoffs', 'championship'],
    events: ['NBA All-Star Weekend', 'NBA Draft', 'NBA Finals', 'NBA Summer League']
  },

  mlb: {
    handles: [
      { handle: '@MLB', name: 'Major League Baseball', category: 'official', verified: true },
      { handle: '@MLBNetwork', name: 'MLB Network', category: 'media', verified: true },
      { handle: '@BaseballAmerica', name: 'Baseball America', category: 'media', verified: true },
    ],
    hashtags: [
      { tag: '#MLB', usage: 'high' },
      { tag: '#Baseball', usage: 'high' },
      { tag: '#WorldSeries', usage: 'high' },
      { tag: '#OpeningDay', usage: 'medium' },
    ],
    personalities: [
      { name: 'Mike Trout', handle: '@MikeTrout', role: 'MLB Player - Angels', influence: 'macro', verified: true },
      { name: 'Ken Rosenthal', handle: '@Ken_Rosenthal', role: 'MLB Insider', influence: 'macro', verified: true },
    ],
    keywords: ['baseball', 'pitcher', 'home run', 'grand slam', 'strikeout', 'innings'],
    events: ['World Series', 'MLB All-Star Game', 'Spring Training', 'MLB Draft']
  },

  // Entertainment Industries
  movies: {
    handles: [
      { handle: '@IMDb', name: 'IMDb', category: 'media', verified: true },
      { handle: '@RottenTomatoes', name: 'Rotten Tomatoes', category: 'media', verified: true },
      { handle: '@THR', name: 'The Hollywood Reporter', category: 'media', verified: true },
      { handle: '@Variety', name: 'Variety', category: 'media', verified: true },
      { handle: '@FilmUpdates', name: 'Film Updates', category: 'media', verified: true },
    ],
    hashtags: [
      { tag: '#Movies', usage: 'high' },
      { tag: '#Film', usage: 'high' },
      { tag: '#Cinema', usage: 'medium' },
      { tag: '#MovieNight', usage: 'medium' },
      { tag: '#FilmTwitter', usage: 'high' },
    ],
    personalities: [
      { name: 'Christopher Nolan', handle: '@ChrisNolanNews', role: 'Film Director', influence: 'macro', verified: false },
      { name: 'Film Crit Hulk', handle: '@FilmCritHULK', role: 'Film Critic', influence: 'micro', verified: true },
    ],
    keywords: ['cinema', 'film', 'movie', 'director', 'actor', 'actress', 'screenplay', 'box office'],
    events: ['Oscars', 'Cannes Film Festival', 'Sundance', 'Venice Film Festival', 'Toronto Film Festival']
  },

  music: {
    handles: [
      { handle: '@Spotify', name: 'Spotify', category: 'brand', verified: true },
      { handle: '@AppleMusic', name: 'Apple Music', category: 'brand', verified: true },
      { handle: '@RollingStone', name: 'Rolling Stone', category: 'media', verified: true },
      { handle: '@billboard', name: 'Billboard', category: 'media', verified: true },
      { handle: '@Pitchfork', name: 'Pitchfork', category: 'media', verified: true },
    ],
    hashtags: [
      { tag: '#Music', usage: 'high' },
      { tag: '#NowPlaying', usage: 'high' },
      { tag: '#NewMusic', usage: 'high' },
      { tag: '#MusicMonday', usage: 'medium' },
      { tag: '#Vinyl', usage: 'medium' },
    ],
    personalities: [
      { name: 'Taylor Swift', handle: '@taylorswift13', role: 'Recording Artist', influence: 'macro', verified: true },
      { name: 'Drake', handle: '@Drake', role: 'Recording Artist', influence: 'macro', verified: true },
      { name: 'Anthony Fantano', handle: '@theneedledrop', role: 'Music Critic', influence: 'micro', verified: true },
    ],
    keywords: ['album', 'concert', 'tour', 'single', 'playlist', 'vinyl', 'streaming', 'festival'],
    events: ['Grammy Awards', 'Coachella', 'Lollapalooza', 'SXSW', 'Glastonbury']
  },

  // Business & Finance
  finance: {
    handles: [
      { handle: '@WSJ', name: 'Wall Street Journal', category: 'media', verified: true },
      { handle: '@FT', name: 'Financial Times', category: 'media', verified: true },
      { handle: '@Bloomberg', name: 'Bloomberg', category: 'media', verified: true },
      { handle: '@CNBC', name: 'CNBC', category: 'media', verified: true },
      { handle: '@YahooFinance', name: 'Yahoo Finance', category: 'media', verified: true },
    ],
    hashtags: [
      { tag: '#Finance', usage: 'high' },
      { tag: '#Investing', usage: 'high' },
      { tag: '#StockMarket', usage: 'high' },
      { tag: '#Trading', usage: 'medium' },
      { tag: '#FinTech', usage: 'high' },
    ],
    personalities: [
      { name: 'Warren Buffett', handle: '@WarrenBuffett', role: 'Investor', influence: 'macro', verified: true },
      { name: 'Jim Cramer', handle: '@jimcramer', role: 'CNBC Host', influence: 'macro', verified: true },
      { name: 'Cathie Wood', handle: '@CathieDWood', role: 'ARK Invest CEO', influence: 'macro', verified: true },
    ],
    keywords: ['stocks', 'bonds', 'portfolio', 'investment', 'trading', 'market', 'economy', 'banking'],
    events: ['Berkshire Hathaway Meeting', 'Federal Reserve Meetings', 'Earnings Season', 'IPOs']
  },

  // Lifestyle
  food: {
    handles: [
      { handle: '@FoodNetwork', name: 'Food Network', category: 'media', verified: true },
      { handle: '@bonappetit', name: 'Bon Appétit', category: 'media', verified: true },
      { handle: '@Eater', name: 'Eater', category: 'media', verified: true },
      { handle: '@foodandwine', name: 'Food & Wine', category: 'media', verified: true },
    ],
    hashtags: [
      { tag: '#Food', usage: 'high' },
      { tag: '#Foodie', usage: 'high' },
      { tag: '#Recipe', usage: 'high' },
      { tag: '#Cooking', usage: 'high' },
      { tag: '#FoodPorn', usage: 'medium' },
    ],
    personalities: [
      { name: 'Gordon Ramsay', handle: '@GordonRamsay', role: 'Celebrity Chef', influence: 'macro', verified: true },
      { name: 'Chrissy Teigen', handle: '@chrissyteigen', role: 'Cookbook Author', influence: 'macro', verified: true },
      { name: 'Alton Brown', handle: '@altonbrown', role: 'Food TV Host', influence: 'micro', verified: true },
    ],
    keywords: ['restaurant', 'cuisine', 'chef', 'recipe', 'dining', 'cooking', 'baking', 'ingredients'],
    events: ['James Beard Awards', 'Food & Wine Festival', 'Restaurant Week', 'Michelin Guide Release']
  },

  travel: {
    handles: [
      { handle: '@NatGeoTravel', name: 'National Geographic Travel', category: 'media', verified: true },
      { handle: '@lonelyplanet', name: 'Lonely Planet', category: 'media', verified: true },
      { handle: '@TravelLeisure', name: 'Travel + Leisure', category: 'media', verified: true },
      { handle: '@CondeNastTraveler', name: 'Condé Nast Traveler', category: 'media', verified: true },
    ],
    hashtags: [
      { tag: '#Travel', usage: 'high' },
      { tag: '#Wanderlust', usage: 'high' },
      { tag: '#TravelGram', usage: 'high' },
      { tag: '#Vacation', usage: 'medium' },
      { tag: '#TravelTips', usage: 'medium' },
    ],
    personalities: [
      { name: 'Rick Steves', handle: '@RickSteves', role: 'Travel Expert', influence: 'micro', verified: true },
      { name: 'Nomadic Matt', handle: '@nomadicmatt', role: 'Travel Blogger', influence: 'micro', verified: true },
    ],
    keywords: ['destination', 'hotel', 'flight', 'vacation', 'tourism', 'adventure', 'backpacking', 'resort'],
    events: ['Travel Trade Shows', 'Tourism Weeks', 'Holiday Seasons', 'Summer Travel Season']
  },

  // Health & Fitness
  fitness: {
    handles: [
      { handle: '@MensHealthMag', name: 'Men\'s Health', category: 'media', verified: true },
      { handle: '@WomensHealthMag', name: 'Women\'s Health', category: 'media', verified: true },
      { handle: '@Shape', name: 'Shape Magazine', category: 'media', verified: true },
      { handle: '@MyFitnessPal', name: 'MyFitnessPal', category: 'brand', verified: true },
    ],
    hashtags: [
      { tag: '#Fitness', usage: 'high' },
      { tag: '#Workout', usage: 'high' },
      { tag: '#GymLife', usage: 'high' },
      { tag: '#FitFam', usage: 'high' },
      { tag: '#HealthyLiving', usage: 'medium' },
    ],
    personalities: [
      { name: 'Kayla Itsines', handle: '@kayla_itsines', role: 'Fitness Influencer', influence: 'macro', verified: true },
      { name: 'Joe Wicks', handle: '@thebodycoach', role: 'Fitness Coach', influence: 'macro', verified: true },
    ],
    keywords: ['workout', 'exercise', 'gym', 'training', 'health', 'wellness', 'nutrition', 'cardio'],
    events: ['New Year Fitness Goals', 'Summer Body Season', 'Marathon Season', 'Fitness Expos']
  }
}