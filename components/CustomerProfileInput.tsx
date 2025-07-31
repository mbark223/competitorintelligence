'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Target, ChevronDown } from 'lucide-react'
import { gamingPresets, GamingPreset } from '@/lib/data/gaming-presets'

interface CustomerProfileInputProps {
  onGenerate: (profile: string) => void
  loading: boolean
}

const exampleProfiles = [
  "Tech-savvy professionals aged 25-40 who use SaaS tools for productivity and follow technology trends",
  "Fashion-conscious women interested in sustainable clothing brands and follow fashion influencers on social media",
  "Fitness enthusiasts who regularly go to the gym, purchase workout gear, and follow nutrition advice"
]

export default function CustomerProfileInput({ onGenerate, loading }: CustomerProfileInputProps) {
  const [profile, setProfile] = useState('')
  const [error, setError] = useState('')
  const [showPresets, setShowPresets] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sportsbook' | 'icasino' | 'both'>('all')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (profile.trim().length < 20) {
      setError('Please provide a more detailed customer profile (at least 20 characters)')
      return
    }
    
    setError('')
    onGenerate(profile)
  }

  const handleExampleClick = (example: string) => {
    setProfile(example)
    setError('')
  }

  const handlePresetClick = (preset: GamingPreset) => {
    setProfile(preset.profile)
    setError('')
    setShowPresets(false)
  }

  const filteredPresets = selectedCategory === 'all' 
    ? gamingPresets 
    : gamingPresets.filter(p => p.category === selectedCategory)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Describe Your Target Customer
        </h2>
        <p className="text-gray-600">
          Provide a detailed description of your ideal customer for Twitter ads
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={profile}
            onChange={(e) => {
              setProfile(e.target.value)
              setError('')
            }}
            placeholder="Example: Young professionals aged 25-35 interested in productivity tools, follow tech influencers, and regularly purchase software subscriptions..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={loading}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium">Quick examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleProfiles.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  disabled={loading}
                >
                  Example {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 font-medium">Gaming presets:</p>
              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                {showPresets ? 'Hide' : 'Show'} presets
                <ChevronDown className={`w-4 h-4 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {showPresets && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pt-2"
              >
                <div className="flex gap-2 flex-wrap">
                  {(['all', 'sportsbook', 'icasino', 'both'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
                
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                  {filteredPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                      disabled={loading}
                    >
                      <div className="font-medium text-sm group-hover:text-blue-600">
                        {preset.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {preset.description}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !profile.trim()}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Targeting
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}