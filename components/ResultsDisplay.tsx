import { TargetingResult } from '@/lib/types/targeting'
import { Users, Hash, MapPin, Sparkles, MessageCircle, Newspaper, Calendar, Building } from 'lucide-react'

interface ResultsDisplayProps {
  results: TargetingResult
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  return (
    <div className="space-y-8">
      {/* Official Handles */}
      <section className="twitter-card">
        <div className="flex items-center mb-4">
          <Users className="w-5 h-5 text-twitter-blue mr-2" />
          <h2 className="text-xl font-semibold">Official Handles</h2>
          <span className="ml-2 text-sm text-twitter-dark-gray">({results.handles.length})</span>
        </div>
        <div className="flex flex-wrap">
          {results.handles.map((handle, idx) => (
            <div key={idx} className="result-item">
              <span className="text-twitter-blue">{handle.handle}</span>
              {handle.verified && <span className="ml-1">✓</span>}
              <span className="text-twitter-dark-gray text-xs ml-2">({handle.name})</span>
            </div>
          ))}
        </div>
      </section>

      {/* Hashtags */}
      <section className="twitter-card">
        <div className="flex items-center mb-4">
          <Hash className="w-5 h-5 text-twitter-blue mr-2" />
          <h2 className="text-xl font-semibold">Hashtags</h2>
          <span className="ml-2 text-sm text-twitter-dark-gray">({results.hashtags.length})</span>
        </div>
        <div className="flex flex-wrap">
          {results.hashtags.map((hashtag, idx) => (
            <div key={idx} className={`result-item ${
              hashtag.usage === 'high' ? 'border-green-500' : 
              hashtag.usage === 'medium' ? 'border-yellow-500' : 
              'border-gray-300'
            }`}>
              <span className="text-twitter-blue">{hashtag.tag}</span>
              <span className="ml-2 text-xs text-twitter-dark-gray">({hashtag.usage})</span>
            </div>
          ))}
        </div>
      </section>

      {/* Key Personalities */}
      <section className="twitter-card">
        <div className="flex items-center mb-4">
          <Sparkles className="w-5 h-5 text-twitter-blue mr-2" />
          <h2 className="text-xl font-semibold">Key Personalities & Influencers</h2>
          <span className="ml-2 text-sm text-twitter-dark-gray">({results.personalities.length})</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {results.personalities.map((person, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{person.name}</div>
                <div className="text-sm text-twitter-blue">{person.handle}</div>
                <div className="text-xs text-twitter-dark-gray">{person.role}</div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                person.influence === 'macro' ? 'bg-purple-100 text-purple-700' :
                person.influence === 'micro' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {person.influence}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Related Keywords */}
      <section className="twitter-card">
        <div className="flex items-center mb-4">
          <MessageCircle className="w-5 h-5 text-twitter-blue mr-2" />
          <h2 className="text-xl font-semibold">Related Keywords</h2>
          <span className="ml-2 text-sm text-twitter-dark-gray">({results.relatedKeywords.length})</span>
        </div>
        <div className="space-y-3">
          {['broad', 'phrase', 'exact'].map(matchType => {
            const keywords = results.relatedKeywords.filter(k => k.matchType === matchType)
            if (keywords.length === 0) return null
            
            return (
              <div key={matchType}>
                <h3 className="text-sm font-medium text-twitter-dark-gray mb-2 capitalize">
                  {matchType} Match ({keywords.length})
                </h3>
                <div className="flex flex-wrap">
                  {keywords.map((keyword, idx) => (
                    <div key={idx} className="result-item">
                      {keyword.term}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Geographic Targets */}
      <section className="twitter-card">
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-twitter-blue mr-2" />
          <h2 className="text-xl font-semibold">Geographic Targets</h2>
          <span className="ml-2 text-sm text-twitter-dark-gray">({results.geographicTargets.length})</span>
        </div>
        <div className="flex flex-wrap">
          {results.geographicTargets.map((geo, idx) => (
            <div key={idx} className="result-item">
              <span>{geo.location}</span>
              <span className="ml-2 text-xs text-twitter-dark-gray">({geo.type})</span>
            </div>
          ))}
        </div>
      </section>

      {/* Media Handles */}
      <section className="twitter-card">
        <div className="flex items-center mb-4">
          <Newspaper className="w-5 h-5 text-twitter-blue mr-2" />
          <h2 className="text-xl font-semibold">Media & Publication Handles</h2>
          <span className="ml-2 text-sm text-twitter-dark-gray">({results.mediaHandles.length})</span>
        </div>
        <div className="flex flex-wrap">
          {results.mediaHandles.map((handle, idx) => (
            <div key={idx} className="result-item">
              <span className="text-twitter-blue">{handle.handle}</span>
              <span className="text-twitter-dark-gray text-xs ml-2">({handle.name})</span>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      {results.events.length > 0 && (
        <section className="twitter-card">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-twitter-blue mr-2" />
            <h2 className="text-xl font-semibold">Related Events</h2>
            <span className="ml-2 text-sm text-twitter-dark-gray">({results.events.length})</span>
          </div>
          <div className="space-y-3">
            {results.events.map((event, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{event.name}</div>
                {event.date && <div className="text-sm text-twitter-dark-gray">{event.date}</div>}
                <div className="flex flex-wrap mt-2">
                  {event.hashtags.map((tag, tagIdx) => (
                    <span key={tagIdx} className="text-sm text-twitter-blue mr-2">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Competitors */}
      {results.competitors.length > 0 && (
        <section className="twitter-card">
          <div className="flex items-center mb-4">
            <Building className="w-5 h-5 text-twitter-blue mr-2" />
            <h2 className="text-xl font-semibold">Competitors & Related Brands</h2>
            <span className="ml-2 text-sm text-twitter-dark-gray">({results.competitors.length})</span>
          </div>
          <div className="flex flex-wrap">
            {results.competitors.map((competitor, idx) => (
              <div key={idx} className="result-item">
                <span>{competitor.name}</span>
                <span className="text-twitter-blue text-sm ml-2">{competitor.handle}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}