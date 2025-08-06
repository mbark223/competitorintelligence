'use client'

import { useState } from 'react'
import { Search, Download, Copy, Loader2 } from 'lucide-react'
import SearchInput from '@/components/SearchInput'
import ResultsDisplay from '@/components/ResultsDisplay'
import ExportOptions from '@/components/ExportOptions'
import { TargetingResult } from '@/lib/types/targeting'

export default function Home() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<TargetingResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (searchKeyword: string) => {
    if (!searchKeyword.trim()) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate-targeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: searchKeyword }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate targeting data')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-twitter-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-twitter-black mb-4">
            Twitter Targeting Tool
          </h1>
          <p className="text-lg text-twitter-dark-gray max-w-2xl mx-auto">
            Generate comprehensive Twitter ad targeting parameters from any keyword. 
            Get handles, hashtags, influencers, and more - with the same granularity as professional targeting spreadsheets.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
            loading={loading}
          />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-twitter-blue" />
            <span className="ml-3 text-twitter-dark-gray">Generating targeting data...</span>
          </div>
        )}

        {results && !loading && (
          <>
            <div className="mb-8">
              <ExportOptions results={results} />
            </div>
            <ResultsDisplay results={results} />
          </>
        )}
      </div>
    </main>
  )
}