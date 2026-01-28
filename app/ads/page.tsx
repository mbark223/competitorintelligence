'use client'

import { useState, useEffect } from 'react'
import AdFilters from '@/components/ads/AdFilters'
import AdsGrid from '@/components/ads/AdsGrid'
import AdDetailsModal from '@/components/ads/AdDetailsModal'
import { AdIntelligence } from '@/types/airtable'

type EnhancedAd = AdIntelligence & { brandName?: string }

export default function AdsPage() {
  const [ads, setAds] = useState<EnhancedAd[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAd, setSelectedAd] = useState<EnhancedAd | null>(null)
  const [filters, setFilters] = useState<any>({})

  useEffect(() => {
    fetchAds()
  }, [filters])

  const fetchAds = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value))
      })

      const response = await fetch(`/api/ads?${params}`)
      const data = await response.json()

      if (data.success) {
        setAds(data.data)
      }
    } catch (error) {
      console.error('Error fetching ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ads Library</h1>
        <p className="text-gray-600">Browse and analyze fetched competitor ads</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-600">Total Ads</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{ads.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-600">Analyzed with AI</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {ads.filter(ad => ad.analysisCompleted).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-600">Video Ads</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {ads.filter(ad => ad.displayFormat?.toLowerCase().includes('video')).length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <AdFilters onFilterChange={handleFilterChange} />
        </div>

        {/* Ads Grid */}
        <div className="lg:col-span-3">
          <AdsGrid
            ads={ads}
            loading={loading}
            onSelectAd={setSelectedAd}
          />
        </div>
      </div>

      {/* Ad Details Modal */}
      <AdDetailsModal
        isOpen={selectedAd !== null}
        ad={selectedAd}
        onClose={() => setSelectedAd(null)}
      />

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">About the Ads Library</h2>
        <div className="space-y-2 text-blue-800 text-sm">
          <p>
            <strong>Filtering:</strong> Use the sidebar filters to narrow down ads by brand, format, status, and more
          </p>
          <p>
            <strong>AI Analysis:</strong> Video ads with the purple "AI" badge have been analyzed by Gemini. Click to view insights
          </p>
          <p>
            <strong>Analysis Workflow:</strong> Run the ad analysis webhook to process unanalyzed video ads automatically
          </p>
        </div>
      </div>
    </main>
  )
}
