import { InterestCategory } from '@/types/targeting'
import { analyzeProfile } from './generic-analyzer'

export async function generateInterestCategories(profile: string): Promise<InterestCategory[]> {
  const profileLower = profile.toLowerCase()
  const categories: InterestCategory[] = []
  const analysis = analyzeProfile(profile)

  // Industry-based interest mapping
  const industryInterests: Record<string, InterestCategory[]> = {
    technology: [
      { id: 'tech', name: 'Technology', subcategories: ['Software', 'Hardware', 'Innovation'] },
      { id: 'business_tech', name: 'Business Technology', subcategories: ['SaaS', 'Enterprise', 'Cloud'] },
      { id: 'consumer_tech', name: 'Consumer Electronics', subcategories: ['Gadgets', 'Smart devices', 'Tech reviews'] },
    ],
    fashion: [
      { id: 'fashion_beauty', name: 'Fashion & Beauty', subcategories: ['Fashion trends', 'Style', 'Beauty'] },
      { id: 'luxury', name: 'Luxury Goods', subcategories: ['Designer brands', 'High fashion', 'Luxury lifestyle'] },
      { id: 'shopping_fashion', name: 'Fashion Shopping', subcategories: ['Online fashion', 'Fashion deals', 'Style inspiration'] },
    ],
    fitness: [
      { id: 'health_fitness', name: 'Health & Fitness', subcategories: ['Exercise', 'Nutrition', 'Wellness'] },
      { id: 'sports_fitness', name: 'Sports & Fitness', subcategories: ['Gym', 'Training', 'Athletic performance'] },
      { id: 'wellness', name: 'Wellness & Self-care', subcategories: ['Mental health', 'Meditation', 'Lifestyle'] },
    ],
    food: [
      { id: 'food_drink', name: 'Food & Drink', subcategories: ['Cuisine', 'Restaurants', 'Recipes'] },
      { id: 'cooking', name: 'Cooking', subcategories: ['Home cooking', 'Food prep', 'Kitchen'] },
      { id: 'dining', name: 'Dining Out', subcategories: ['Restaurants', 'Food delivery', 'Food experiences'] },
    ],
    travel: [
      { id: 'travel', name: 'Travel', subcategories: ['Destinations', 'Travel planning', 'Adventure'] },
      { id: 'hospitality', name: 'Hotels & Accommodation', subcategories: ['Hotels', 'Vacation rentals', 'Travel stays'] },
      { id: 'tourism', name: 'Tourism & Sightseeing', subcategories: ['Attractions', 'Tours', 'Travel experiences'] },
    ],
    gaming: [
      { id: 'gaming', name: 'Gaming', subcategories: ['Video games', 'PC gaming', 'Console gaming'] },
      { id: 'esports', name: 'Esports', subcategories: ['Competitive gaming', 'Gaming tournaments', 'Pro gaming'] },
      { id: 'gaming_content', name: 'Gaming Content', subcategories: ['Game streaming', 'Gaming videos', 'Gaming news'] },
    ],
    music: [
      { id: 'music', name: 'Music', subcategories: ['Music genres', 'Artists', 'Albums'] },
      { id: 'live_music', name: 'Live Events', subcategories: ['Concerts', 'Festivals', 'Live performances'] },
      { id: 'music_streaming', name: 'Music & Audio', subcategories: ['Streaming', 'Playlists', 'Podcasts'] },
    ],
    beauty: [
      { id: 'beauty', name: 'Beauty', subcategories: ['Makeup', 'Skincare', 'Hair care'] },
      { id: 'cosmetics', name: 'Cosmetics', subcategories: ['Makeup products', 'Beauty brands', 'Beauty tools'] },
      { id: 'personal_care', name: 'Personal Care', subcategories: ['Self-care', 'Grooming', 'Beauty routines'] },
    ],
    finance: [
      { id: 'finance', name: 'Personal Finance', subcategories: ['Investing', 'Savings', 'Budgeting'] },
      { id: 'business_finance', name: 'Business & Finance', subcategories: ['Markets', 'Economy', 'Business news'] },
      { id: 'crypto', name: 'Cryptocurrency', subcategories: ['Bitcoin', 'Blockchain', 'Digital assets'] },
    ],
    education: [
      { id: 'education', name: 'Education', subcategories: ['Learning', 'Online education', 'Skills'] },
      { id: 'career', name: 'Career Development', subcategories: ['Professional growth', 'Job skills', 'Career advice'] },
      { id: 'academic', name: 'Academic Interests', subcategories: ['Research', 'Study', 'Knowledge'] },
    ],
    entertainment: [
      { id: 'entertainment', name: 'Entertainment', subcategories: ['Movies', 'TV shows', 'Streaming'] },
      { id: 'pop_culture', name: 'Pop Culture', subcategories: ['Celebrities', 'Trends', 'Entertainment news'] },
      { id: 'media', name: 'Digital Media', subcategories: ['Content', 'Videos', 'Social media'] },
    ],
  }

  // Check if this is NFL-related
  if (analysis.isNFL) {
    categories.push({
      id: 'sports',
      name: 'Sports',
      subcategories: ['Football', 'NFL', 'American football'],
    })

    categories.push({
      id: 'sports_news',
      name: 'Sports news',
      subcategories: ['NFL news', 'Football news', 'Sports media'],
    })

    if (profileLower.includes('fantasy')) {
      categories.push({
        id: 'gaming',
        name: 'Gaming',
        subcategories: ['Fantasy sports', 'Sports gaming', 'Online gaming'],
      })
    }

    if (profileLower.includes('merchandise') || profileLower.includes('gear')) {
      categories.push({
        id: 'shopping',
        name: 'Shopping',
        subcategories: ['Sports merchandise', 'Online shopping', 'Apparel'],
      })
    }

    categories.push({
      id: 'entertainment',
      name: 'Entertainment',
      subcategories: ['Sports entertainment', 'Live events', 'Television'],
    })
  }

  // Add industry-specific interests
  analysis.industries.forEach(industry => {
    if (industryInterests[industry]) {
      categories.push(...industryInterests[industry])
    }
  })

  // Add behavioral categories based on profile analysis
  if (profileLower.includes('watch') || profileLower.includes('viewer')) {
    categories.push({
      id: 'tv_and_movies',
      name: 'TV & Movies',
      subcategories: ['Programming', 'Streaming', 'Entertainment content'],
    })
  }

  if (profileLower.includes('social') || profileLower.includes('engage')) {
    categories.push({
      id: 'social_media',
      name: 'Social Media',
      subcategories: ['Online communities', 'Content engagement', 'Social sharing'],
    })
  }

  if (analysis.behaviors.includes('purchase') || profileLower.includes('shop')) {
    categories.push({
      id: 'shopping',
      name: 'Shopping',
      subcategories: ['Online shopping', 'E-commerce', 'Deals & discounts'],
    })
  }

  // Remove duplicates based on id
  const uniqueCategories = Array.from(
    new Map(categories.map(cat => [cat.id, cat])).values()
  )

  return uniqueCategories
}