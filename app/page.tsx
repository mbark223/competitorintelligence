'use client'

import { useState } from 'react'
import CustomerProfileInput from '@/components/CustomerProfileInput'
import ResultsDisplay from '@/components/ResultsDisplay'
import { TargetingResults } from '@/types/targeting'

export default function Home() {
  const [results, setResults] = useState<TargetingResults | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (profile: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-targeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error generating targeting:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Twitter Ad Targeting Generator
        </h1>
        
        <div className="max-w-6xl mx-auto">
          <CustomerProfileInput onGenerate={handleGenerate} loading={loading} />
          
          {results && (
            <div className="mt-8">
              <ResultsDisplay results={results} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}