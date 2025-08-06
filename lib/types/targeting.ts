export interface TargetingResult {
  keyword: string;
  handles: TwitterHandle[];
  hashtags: Hashtag[];
  personalities: Personality[];
  relatedKeywords: Keyword[];
  geographicTargets: GeographicTarget[];
  interests: InterestCategory[];
  conversationalKeywords: string[];
  mediaHandles: TwitterHandle[];
  events: Event[];
  competitors: Competitor[];
}

export interface TwitterHandle {
  handle: string;
  name: string;
  category: 'official' | 'media' | 'personality' | 'brand' | 'community';
  verified?: boolean;
  followers?: string;
  description?: string;
}

export interface Hashtag {
  tag: string;
  usage: 'high' | 'medium' | 'low';
  description?: string;
}

export interface Personality {
  name: string;
  handle: string;
  role: string;
  influence: 'macro' | 'micro' | 'nano';
  verified?: boolean;
}

export interface Keyword {
  term: string;
  matchType: 'broad' | 'phrase' | 'exact';
  category: 'primary' | 'secondary' | 'long-tail';
}

export interface GeographicTarget {
  location: string;
  type: 'country' | 'state' | 'city' | 'region';
  relevance: 'high' | 'medium' | 'low';
}

export interface InterestCategory {
  id: string;
  name: string;
  subcategories?: string[];
}

export interface Event {
  name: string;
  date?: string;
  hashtags: string[];
  description?: string;
}

export interface Competitor {
  name: string;
  handle: string;
  category: string;
}