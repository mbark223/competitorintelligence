'use client'

import { useEffect } from 'react'
import { AdIntelligence } from '@/types/airtable'

interface AdDetailsModalProps {
  isOpen: boolean
  ad: (AdIntelligence & { brandName?: string }) | null
  onClose: () => void
}

export default function AdDetailsModal({ isOpen, ad, onClose }: AdDetailsModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen || !ad) return null

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isVideo = ad.displayFormat?.toLowerCase().includes('video')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{ad.brandName || ad.pageName}</h2>
              <p className="text-sm text-gray-500 mt-1">Ad Archive ID: {ad.adArchiveId}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left: Creative */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ad Creative</h3>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                {isVideo && ad.mediaUrl ? (
                  <video
                    src={ad.mediaUrl}
                    controls
                    className="w-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : ad.thumbnailUrl ? (
                  <img
                    src={ad.thumbnailUrl}
                    alt="Ad creative"
                    className="w-full"
                  />
                ) : (
                  <div className="aspect-video flex items-center justify-center text-gray-400">
                    <p>No creative available</p>
                  </div>
                )}
              </div>

              {/* Ad Copy */}
              {ad.adCopy && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Ad Copy</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{ad.adCopy}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium text-gray-900">{ad.displayFormat}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-gray-900">{ad.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium text-gray-900">{formatDate(ad.startDate)}</span>
                </div>
                {ad.endDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium text-gray-900">{formatDate(ad.endDate)}</span>
                  </div>
                )}
                {ad.impressions > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Impressions:</span>
                    <span className="font-medium text-gray-900">{ad.impressions.toLocaleString()}</span>
                  </div>
                )}
                {ad.permalinkUrl && (
                  <div className="text-sm">
                    <a
                      href={ad.permalinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View on Facebook Ad Library →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Analysis */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">AI Analysis</h3>

              {ad.analysisCompleted ? (
                <div className="space-y-4">
                  {/* Insights */}
                  {ad.analysisInsights && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Insights</h4>
                      <p className="text-gray-900 text-sm">{ad.analysisInsights}</p>
                    </div>
                  )}

                  {/* Themes */}
                  {ad.analysisThemes && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Themes</h4>
                      <div className="flex flex-wrap gap-2">
                        {ad.analysisThemes.split(',').map((theme, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                          >
                            {theme.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sentiment */}
                  {ad.analysisSentiment && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Sentiment</h4>
                      <p className="text-gray-900 text-sm">{ad.analysisSentiment}</p>
                    </div>
                  )}

                  {/* Call to Action */}
                  {ad.analysisCallToAction && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Call to Action</h4>
                      <p className="text-gray-900 text-sm">{ad.analysisCallToAction}</p>
                    </div>
                  )}

                  {/* Target Audience */}
                  {ad.analysisTargetAudience && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Target Audience</h4>
                      <p className="text-gray-900 text-sm">{ad.analysisTargetAudience}</p>
                    </div>
                  )}

                  {ad.analysisDate && (
                    <p className="text-xs text-gray-500 mt-4">
                      Analyzed on {formatDate(ad.analysisDate)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-gray-600 font-medium mb-2">Not Yet Analyzed</p>
                  <p className="text-sm text-gray-500">
                    This ad hasn't been analyzed with AI yet. Run the ad analysis workflow to generate insights.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
