import { TargetingResult } from '@/lib/types/targeting'
import { KeywordAnalyzer } from './keywordAnalyzer'
import { HandleGenerator } from './handleGenerator'
import { HashtagGenerator } from './hashtagGenerator'
import { PersonalityDiscovery } from './personalityDiscovery'

export class TargetingService {
  static async generateTargeting(keyword: string): Promise<TargetingResult> {
    // Generate all targeting data
    const [
      relatedKeywords,
      handles,
      hashtags,
      personalities,
      mediaHandles,
      conversationalKeywords,
      competitors,
      events,
      geographicTargets,
      interests
    ] = await Promise.all([
      Promise.resolve(KeywordAnalyzer.generateKeywords(keyword)),
      Promise.resolve(HandleGenerator.generateHandles(keyword)),
      Promise.resolve(HashtagGenerator.generateHashtags(keyword)),
      Promise.resolve(PersonalityDiscovery.discoverPersonalities(keyword)),
      Promise.resolve(HandleGenerator.generateMediaHandles(keyword)),
      Promise.resolve(KeywordAnalyzer.generateConversationalKeywords(keyword)),
      Promise.resolve(PersonalityDiscovery.generateCompetitors(keyword)),
      Promise.resolve(PersonalityDiscovery.generateEvents(keyword)),
      Promise.resolve(PersonalityDiscovery.generateGeographicTargets(keyword)),
      Promise.resolve(PersonalityDiscovery.generateInterests(keyword))
    ])

    return {
      keyword,
      handles,
      hashtags,
      personalities,
      relatedKeywords,
      geographicTargets,
      interests,
      conversationalKeywords,
      mediaHandles,
      events,
      competitors
    }
  }
}