'use client'

import { AdIntelligence } from '@/types/airtable'

interface AdsGridProps {
  ads: (AdIntelligence & { brandName?: string })[]
  loading: boolean
  onSelectAd: (ad: AdIntelligence & { brandName?: string }) => void
}

export default function AdsGrid({ ads, loading, onSelectAd }: AdsGridProps) {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading ads...</p>
      </div>
    )
  }

  if (ads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No ads found. Try adjusting your filters or create a job to fetch ads.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {ads.map((ad) => (
        <div
          key={ad.recordId}
          onClick={() => onSelectAd(ad)}
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        >
          {/* Thumbnail */}
          <div className="relative aspect-video bg-gray-100">
            {ad.thumbnailUrl ? (
              <img
                src={ad.thumbnailUrl}
                alt={ad.adCopy || 'Ad thumbnail'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Format Badge */}
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
                {ad.displayFormat}
              </span>
            </div>

            {/* Analysis Badge */}
            {ad.analysisCompleted && (
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  AI
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">{ad.brandName || ad.pageName}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ad.status)}`}>
                {ad.status}
              </span>
            </div>

            <p className="text-sm text-gray-900 line-clamp-2 mb-2">
              {ad.adCopy || 'No ad copy available'}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatDate(ad.startDate)}</span>
              {ad.impressions > 0 && (
                <span>{ad.impressions.toLocaleString()} views</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
